use std::path::Path;

use anyhow::Result;
use artscii_img::AsciiResult;

use crate::config::{VideoConfig, VideoOutputMode};

/// A single converted video frame — an ASCII snapshot at a given index.
#[derive(Debug)]
pub struct FrameConversion {
    /// Zero-based frame index in presentation order.
    pub frame_index: usize,
    /// The ASCII art rendering of this frame.
    pub ascii: AsciiResult,
}

/// The complete result of a video-to-ASCII conversion.
///
/// Contains all converted frames, the output mode, optional audio flag,
/// and the detected (or configured) frame rate.
#[derive(Debug)]
pub struct VideoConversion {
    pub input: std::path::PathBuf,
    pub frames: Vec<FrameConversion>,
    pub output_mode: VideoOutputMode,
    pub preserve_audio: bool,
    pub frame_rate: Option<(i32, i32)>,
}

impl Default for VideoConversion {
    fn default() -> Self {
        Self::new()
    }
}

impl VideoConversion {
    /// Create an empty conversion result. Usually obtained via [`convert_video`].
    pub fn new() -> Self {
        Self {
            input: std::path::PathBuf::new(),
            frames: Vec::new(),
            output_mode: VideoOutputMode::Terminal,
            preserve_audio: false,
            frame_rate: None,
        }
    }
}

/// Decode a video and convert every frame to ASCII.
///
/// Opens the input file with `ffmpeg`, decodes each video frame, converts
/// it to an [`AsciiResult`] via [`artscii_img::convert_image`], and returns
/// the complete [`VideoConversion`].
pub fn convert_video(config: &VideoConfig) -> Result<VideoConversion> {
    crate::decoder::decode_video(config)
}

/// Render a completed conversion to the chosen output.
///
/// For [`VideoOutputMode::Terminal`] mode this writes to stdout;
/// for [`VideoOutputMode::Gif`] and [`VideoOutputMode::Mp4`]
/// modes it requires an output path (otherwise returns an error).
pub fn render_video(conversion: &VideoConversion, output: Option<&Path>) -> Result<()> {
    crate::encoder::encode_video(conversion, output)
}
