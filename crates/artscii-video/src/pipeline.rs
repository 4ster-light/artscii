use std::path::Path;

use anyhow::Result;
use artscii_img::AsciiResult;

use crate::config::{VideoConfig, VideoOutputMode};

#[derive(Debug)]
pub struct FrameConversion {
    pub frame_index: usize,
    pub ascii: AsciiResult,
}

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

pub fn convert_video(config: &VideoConfig) -> Result<VideoConversion> {
    crate::decoder::decode_video(config)
}

pub fn render_video(conversion: &VideoConversion, output: Option<&Path>) -> Result<()> {
    crate::encoder::encode_video(conversion, output)
}
