use anyhow::{Context, Result, anyhow};
use artscii_core::ConvertConfig;
use artscii_img::{AsciiResult, convert_image};
use ffmpeg_next as ffmpeg;
use image::{DynamicImage, RgbImage};

use crate::{FrameConversion, VideoConfig, VideoConversion};

/// Decode a video file using `ffmpeg` and convert every frame to ASCII.
///
/// Initialises the ffmpeg library, opens the input, finds the best video
/// stream, decodes it frame-by-frame into RGB, and passes each frame through
/// [`artscii_img::convert_image`]. Returns a [`VideoConversion`] with all
/// the converted frames.
pub fn decode_video(config: &VideoConfig) -> Result<VideoConversion> {
    config
        .validate()
        .context("invalid video conversion settings")?;

    ffmpeg::init().context("failed to initialize ffmpeg")?;

    let mut ictx = ffmpeg::format::input(&config.input)
        .with_context(|| format!("failed to open input video: {}", config.input.display()))?;

    let input_stream = ictx
        .streams()
        .best(ffmpeg::media::Type::Video)
        .ok_or_else(|| anyhow!("no video stream found"))?;

    let source_rate =
        rational_pair(input_stream.avg_frame_rate()).or_else(|| rational_pair(input_stream.rate()));

    let stream_index = input_stream.index();
    let context = ffmpeg::codec::context::Context::from_parameters(input_stream.parameters())?;
    let mut decoder = context.decoder().video()?;
    let mut scaler = ffmpeg::software::scaling::Context::get(
        decoder.format(),
        decoder.width(),
        decoder.height(),
        ffmpeg::format::Pixel::RGB24,
        decoder.width(),
        decoder.height(),
        ffmpeg::software::scaling::Flags::BILINEAR,
    )?;

    let mut frames = Vec::new();
    let mut decoded = ffmpeg::util::frame::Video::empty();
    let mut rgb_frame = ffmpeg::util::frame::Video::empty();
    let convert = config.convert.clone();

    for (frame_index, (stream, packet)) in ictx.packets().enumerate() {
        if stream.index() != stream_index {
            continue;
        }

        decoder.send_packet(&packet)?;
        while decoder.receive_frame(&mut decoded).is_ok() {
            scaler.run(&decoded, &mut rgb_frame)?;
            let ascii = frame_to_ascii(&rgb_frame, &convert)?;
            frames.push(FrameConversion { frame_index, ascii });
        }
    }

    decoder.send_eof()?;
    while decoder.receive_frame(&mut decoded).is_ok() {
        scaler.run(&decoded, &mut rgb_frame)?;
        let ascii = frame_to_ascii(&rgb_frame, &convert)?;
        frames.push(FrameConversion {
            frame_index: frames.len(),
            ascii,
        });
    }

    let mut conversion = VideoConversion::new();
    conversion.input = config.input.clone();
    conversion.frames = frames;
    conversion.output_mode = config.mode;
    conversion.preserve_audio = config.preserve_audio;
    conversion.frame_rate = source_rate;
    Ok(conversion)
}

fn frame_to_ascii(
    frame: &ffmpeg::util::frame::Video,
    config: &ConvertConfig,
) -> Result<AsciiResult> {
    let width = frame.width() as usize;
    let height = frame.height() as usize;
    let stride = frame.stride(0);
    let data = frame.data(0);

    let mut img = RgbImage::new(width as u32, height as u32);
    let raw = img.as_mut();

    for y in 0..height {
        let src = &data[y * stride..y * stride + width * 3];
        let dst = &mut raw[y * width * 3..(y + 1) * width * 3];
        dst.copy_from_slice(src);
    }

    let dynamic = DynamicImage::ImageRgb8(img);
    convert_image(&dynamic, config).context("failed to convert frame to ASCII")
}

fn rational_pair(value: ffmpeg::Rational) -> Option<(i32, i32)> {
    let num = value.numerator();
    let den = value.denominator();
    if num == 0 || den == 0 {
        None
    } else {
        Some((num, den))
    }
}
