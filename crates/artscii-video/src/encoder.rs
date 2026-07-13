use std::fs::File;
use std::io::{self, Write};
use std::path::Path;
use std::time::Duration;

use anyhow::{Context, Result};
use ffmpeg_next as ffmpeg;
use font8x8::UnicodeFonts;
use gif::{Encoder, Frame, Repeat};
use image::{ImageBuffer, Rgb, RgbImage};

use crate::{VideoConversion, VideoOutputMode};

pub fn encode_video(conversion: &VideoConversion, output: Option<&Path>) -> Result<()> {
    match conversion.output_mode {
        VideoOutputMode::Terminal => write_terminal(conversion),
        VideoOutputMode::Gif => write_gif(conversion, output),
        VideoOutputMode::Mp4 => write_mp4(conversion, output),
    }
}

fn write_terminal(conversion: &VideoConversion) -> Result<()> {
    let frame_delay = frame_delay(conversion.frame_rate);
    let _audio = if conversion.preserve_audio {
        Some(std::thread::spawn({
            let input = conversion.input.clone();
            move || {
                let _ = crate::audio::play_audio(&input);
            }
        }))
    } else {
        None
    };

    for frame in &conversion.frames {
        print!("\x1b[2J\x1b[H");
        print!("{}", frame.ascii.to_plain_text());
        io::stdout().flush()?;
        std::thread::sleep(frame_delay);
    }

    if let Some(handle) = _audio {
        let _ = handle.join();
    }
    Ok(())
}

fn write_gif(conversion: &VideoConversion, output: Option<&Path>) -> Result<()> {
    let path = output.context("gif output path is required")?;
    let first = conversion
        .frames
        .first()
        .context("video had no frames to export")?;

    let cell_w = 8u32;
    let cell_h = 8u32;
    let width = (first.ascii.width as u32 * cell_w) as u16;
    let height = (first.ascii.height as u32 * cell_h) as u16;
    let pixel_count = (width as usize) * (height as usize) * 4;

    let mut file = File::create(path)?;
    let mut encoder = Encoder::new(&mut file, width, height, &[])?;
    encoder.set_repeat(Repeat::Infinite)?;

    for frame in &conversion.frames {
        let rgb = render_ascii_frame(&frame.ascii);
        let mut buffer = Vec::with_capacity(pixel_count);
        for px in rgb.pixels() {
            buffer.extend_from_slice(&[px[0], px[1], px[2], 255]);
        }
        let mut gif_frame = Frame::from_rgba_speed(width, height, &mut buffer, 10);
        gif_frame.delay = gif_delay(conversion.frame_rate);
        encoder.write_frame(&gif_frame)?;
    }

    Ok(())
}

fn write_mp4(conversion: &VideoConversion, output: Option<&Path>) -> Result<()> {
    let path = output.context("mp4 output path is required")?;
    if conversion.frames.is_empty() {
        return Err(anyhow::anyhow!("video had no frames to export"));
    }

    ffmpeg::init().context("failed to initialize ffmpeg")?;

    let first = &conversion.frames[0].ascii;
    let width = (first.width as u32).saturating_mul(8);
    let height = (first.height as u32).saturating_mul(8);
    let (fps_num, fps_den) = conversion.frame_rate.unwrap_or((30, 1));

    let mut octx = ffmpeg::format::output(&path)
        .with_context(|| format!("failed to create output video: {}", path.display()))?;
    let global_header = octx
        .format()
        .flags()
        .contains(ffmpeg::format::Flags::GLOBAL_HEADER);
    let codec =
        ffmpeg::encoder::find(ffmpeg::codec::Id::H264).context("H264 encoder not available")?;
    let mut encoder = ffmpeg::codec::context::Context::new_with_codec(codec)
        .encoder()
        .video()?;
    encoder.set_width(width);
    encoder.set_height(height);
    encoder.set_format(ffmpeg::format::Pixel::YUV420P);
    encoder.set_time_base((fps_den, fps_num));
    encoder.set_max_b_frames(0);
    if global_header {
        encoder.set_flags(ffmpeg::codec::Flags::GLOBAL_HEADER);
    }
    let mut encoder = encoder.open_as(codec)?;
    let video_tb = ffmpeg::Rational::new(fps_den, fps_num);
    let video_stream_index;
    {
        let mut video_stream = octx.add_stream(codec)?;
        video_stream.set_parameters(&encoder);
        video_stream.set_time_base(video_tb);
        video_stream_index = video_stream.index();
    }

    let mut audio_stream_index = None;
    let mut input_audio_time_base = None;
    if conversion.preserve_audio {
        let ictx = ffmpeg::format::input(&conversion.input)?;
        if let Some(istream) = ictx.streams().best(ffmpeg::media::Type::Audio) {
            input_audio_time_base = Some(istream.time_base());
            let output_audio_index;
            {
                let mut ostream = octx.add_stream(None)?;
                ostream.set_parameters(istream.parameters());
                unsafe {
                    (*ostream.parameters().as_mut_ptr()).codec_tag = 0;
                }
                ostream.set_time_base(istream.time_base());
                output_audio_index = ostream.index();
            }
            audio_stream_index = Some((istream.index(), output_audio_index));
        }
    }

    octx.write_header()?;

    let video_ost_tb = octx
        .stream(video_stream_index)
        .context("missing output video stream")?
        .time_base();

    let mut scaler = ffmpeg::software::scaling::Context::get(
        ffmpeg::format::Pixel::RGB24,
        width,
        height,
        ffmpeg::format::Pixel::YUV420P,
        width,
        height,
        ffmpeg::software::scaling::Flags::BILINEAR,
    )?;

    for (frame_pts, frame) in (0_i64..).zip(conversion.frames.iter()) {
        let rgb = render_ascii_frame(&frame.ascii);
        let mut input =
            ffmpeg::util::frame::Video::new(ffmpeg::format::Pixel::RGB24, width, height);
        copy_rgb_to_ffmpeg(&rgb, &mut input);
        let mut yuv =
            ffmpeg::util::frame::Video::new(ffmpeg::format::Pixel::YUV420P, width, height);
        scaler.run(&input, &mut yuv)?;
        yuv.set_pts(Some(frame_pts));
        encoder.send_frame(&yuv)?;

        let mut packet = ffmpeg::Packet::empty();
        while encoder.receive_packet(&mut packet).is_ok() {
            packet.set_stream(0);
            packet.set_time_base(video_tb);
            packet.rescale_ts(video_tb, video_ost_tb);
            packet.write_interleaved(&mut octx)?;
        }
    }

    encoder.send_eof()?;
    let mut packet = ffmpeg::Packet::empty();
    while encoder.receive_packet(&mut packet).is_ok() {
        packet.set_stream(0);
        packet.set_time_base(video_tb);
        packet.rescale_ts(video_tb, video_ost_tb);
        packet.write_interleaved(&mut octx)?;
    }

    if let (Some((input_audio_index, output_audio_index)), Some(input_tb)) =
        (audio_stream_index, input_audio_time_base)
    {
        let mut ictx = ffmpeg::format::input(&conversion.input)?;
        let audio_ost_tb = octx
            .stream(output_audio_index)
            .context("missing output audio stream")?
            .time_base();
        for (stream, mut packet) in ictx.packets() {
            if stream.index() != input_audio_index {
                continue;
            }
            packet.set_time_base(input_tb);
            packet.set_position(-1);
            packet.set_stream(output_audio_index);
            packet.rescale_ts(input_tb, audio_ost_tb);
            packet.write_interleaved(&mut octx)?;
        }
    }

    octx.write_trailer()?;
    Ok(())
}

fn frame_delay(frame_rate: Option<(i32, i32)>) -> Duration {
    let fps = frame_rate
        .map(|(num, den)| num as f64 / den as f64)
        .unwrap_or(30.0)
        .max(1.0);
    Duration::from_secs_f64(1.0 / fps)
}

fn gif_delay(frame_rate: Option<(i32, i32)>) -> u16 {
    let fps = frame_rate
        .map(|(num, den)| num as f64 / den as f64)
        .unwrap_or(30.0)
        .max(1.0);
    let centiseconds = (100.0 / fps).round().max(1.0);
    centiseconds as u16
}

fn render_ascii_frame(ascii: &artscii_img::AsciiResult) -> RgbImage {
    let cell_w = 8u32;
    let cell_h = 8u32;
    let mut image = ImageBuffer::from_pixel(
        (ascii.width as u32) * cell_w,
        (ascii.height as u32) * cell_h,
        Rgb([0, 0, 0]),
    );

    for y in 0..ascii.height {
        for x in 0..ascii.width {
            let i = y * ascii.width + x;
            let ch = ascii.chars[i];
            let fg = if ascii.colored {
                ascii.colors[i]
            } else {
                let rgb = ascii.colors[i];
                let gray =
                    (0.299 * rgb[0] as f32 + 0.587 * rgb[1] as f32 + 0.114 * rgb[2] as f32) as u8;
                image::Rgb([gray, gray, gray])
            };
            draw_glyph(&mut image, x as u32 * cell_w, y as u32 * cell_h, ch, fg);
        }
    }

    image
}

fn draw_glyph(image: &mut RgbImage, x: u32, y: u32, ch: char, color: Rgb<u8>) {
    let glyph = font8x8::BASIC_FONTS.get(ch).unwrap_or([0; 8]);
    for (row, bits) in glyph.iter().enumerate() {
        for col in 0..8 {
            if (bits >> col) & 1 == 1 {
                let px = x + col;
                let py = y + row as u32;
                if px < image.width() && py < image.height() {
                    image.put_pixel(px, py, color);
                }
            }
        }
    }
}

fn copy_rgb_to_ffmpeg(src: &RgbImage, dst: &mut ffmpeg::util::frame::Video) {
    let stride = dst.stride(0);
    let data = dst.data_mut(0);
    let width = src.width() as usize * 3;
    for y in 0..src.height() as usize {
        let src_row = &src.as_raw()[y * width..(y + 1) * width];
        let dst_row = &mut data[y * stride..y * stride + width];
        dst_row.copy_from_slice(src_row);
    }
}
