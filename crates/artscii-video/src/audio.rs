use std::collections::VecDeque;
use std::sync::{Arc, Mutex};

use anyhow::{Context, Result};
use cpal::traits::{DeviceTrait, HostTrait, StreamTrait};
use ffmpeg_next as ffmpeg;

/// Play the audio track of the given video file through the default audio device.
///
/// Uses `ffmpeg` to decode the audio stream and `cpal` for playback.
/// Returns after the decoded audio has been consumed.
pub fn play_audio(input: &std::path::Path) -> Result<()> {
    ffmpeg::init().context("failed to initialize ffmpeg")?;

    let mut ictx = ffmpeg::format::input(input)
        .with_context(|| format!("failed to open audio input: {}", input.display()))?;
    let audio_stream = ictx
        .streams()
        .best(ffmpeg::media::Type::Audio)
        .context("no audio stream found")?;
    let audio_stream_index = audio_stream.index();

    let context = ffmpeg::codec::context::Context::from_parameters(audio_stream.parameters())?;
    let mut decoder = context.decoder().audio()?;

    let host = cpal::default_host();
    let device = host
        .default_output_device()
        .context("no output audio device available")?;
    let supported = device.default_output_config()?;
    let config: cpal::StreamConfig = supported.clone().into();

    let mut resampler = ffmpeg::software::resampling::Context::get(
        decoder.format(),
        decoder.channel_layout(),
        decoder.rate(),
        ffmpeg::format::Sample::F32(ffmpeg::format::sample::Type::Packed),
        decoder.channel_layout(),
        config.sample_rate,
    )?;

    let queue: Arc<Mutex<VecDeque<f32>>> = Arc::new(Mutex::new(VecDeque::new()));
    let err_fn = |err| eprintln!("audio stream error: {err}");
    let stream = match supported.sample_format() {
        cpal::SampleFormat::F32 => {
            let queue = Arc::clone(&queue);
            device.build_output_stream(
                &config,
                move |data: &mut [f32], _| fill_f32(data, &queue),
                err_fn,
                None,
            )?
        }
        cpal::SampleFormat::I16 => {
            let queue = Arc::clone(&queue);
            device.build_output_stream(
                &config,
                move |data: &mut [i16], _| fill_i16(data, &queue),
                err_fn,
                None,
            )?
        }
        cpal::SampleFormat::U16 => {
            let queue = Arc::clone(&queue);
            device.build_output_stream(
                &config,
                move |data: &mut [u16], _| fill_u16(data, &queue),
                err_fn,
                None,
            )?
        }
        _ => return Err(anyhow::anyhow!("unsupported output sample format")),
    };
    stream.play()?;

    let mut decoded = ffmpeg::util::frame::Audio::empty();
    let mut converted = ffmpeg::util::frame::Audio::empty();

    for (packet_stream, packet) in ictx.packets() {
        if packet_stream.index() != audio_stream_index {
            continue;
        }

        if decoder.send_packet(&packet).is_err() {
            break;
        }

        while decoder.receive_frame(&mut decoded).is_ok() {
            if resampler.run(&decoded, &mut converted).is_ok() {
                let data = converted.data(0);
                let mut samples = Vec::with_capacity(data.len() / 4);
                for chunk in data.chunks_exact(4) {
                    samples.push(f32::from_ne_bytes([chunk[0], chunk[1], chunk[2], chunk[3]]));
                }
                if let Ok(mut q) = queue.lock() {
                    q.extend(samples);
                } else {
                    return Ok(());
                }
            }
        }
    }

    while queue.lock().map(|q| !q.is_empty()).unwrap_or(false) {
        std::thread::sleep(std::time::Duration::from_millis(20));
    }

    Ok(())
}

fn fill_f32(data: &mut [f32], queue: &Arc<Mutex<VecDeque<f32>>>) {
    if let Ok(mut q) = queue.lock() {
        for sample in data.iter_mut() {
            *sample = q.pop_front().unwrap_or(0.0);
        }
    } else {
        data.fill(0.0);
    }
}

fn fill_i16(data: &mut [i16], queue: &Arc<Mutex<VecDeque<f32>>>) {
    if let Ok(mut q) = queue.lock() {
        for sample in data.iter_mut() {
            *sample = (q.pop_front().unwrap_or(0.0) * i16::MAX as f32) as i16;
        }
    } else {
        data.fill(0);
    }
}

fn fill_u16(data: &mut [u16], queue: &Arc<Mutex<VecDeque<f32>>>) {
    if let Ok(mut q) = queue.lock() {
        for sample in data.iter_mut() {
            let v = q.pop_front().unwrap_or(0.0).clamp(-1.0, 1.0);
            *sample = ((v + 1.0) * 0.5 * u16::MAX as f32) as u16;
        }
    } else {
        data.fill(u16::MAX / 2);
    }
}
