use std::path::PathBuf;

use artscii_core::{ConvertConfig, DitheringStrategy};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Default)]
pub enum VideoOutputMode {
    #[default]
    Terminal,
    Gif,
    Mp4,
}

#[derive(Debug, Clone)]
pub struct VideoConfig {
    pub input: PathBuf,
    pub output: Option<PathBuf>,
    pub mode: VideoOutputMode,
    pub preserve_audio: bool,
    pub frame_rate: Option<f64>,
    pub convert: ConvertConfig,
}

impl VideoConfig {
    pub fn new(input: impl Into<PathBuf>) -> Self {
        Self {
            input: input.into(),
            output: None,
            mode: VideoOutputMode::Terminal,
            preserve_audio: false,
            frame_rate: None,
            convert: ConvertConfig::default(),
        }
    }

    pub fn with_convert(mut self, convert: ConvertConfig) -> Self {
        self.convert = convert;
        self
    }

    pub fn with_output(mut self, output: impl Into<PathBuf>) -> Self {
        self.output = Some(output.into());
        self
    }

    pub fn validate(&self) -> artscii_core::Result<()> {
        self.convert.validate()
    }

    pub fn set_dithering(&mut self, dithering: DitheringStrategy) {
        self.convert.dithering = dithering;
    }
}
