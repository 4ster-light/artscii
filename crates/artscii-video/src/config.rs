use std::path::PathBuf;

use artscii_core::{ConvertConfig, DitheringStrategy};

/// The format to render the converted video to.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Default)]
pub enum VideoOutputMode {
    /// Play back frame-by-frame in the terminal.
    #[default]
    Terminal,
    /// Export as an animated GIF.
    Gif,
    /// Export as an MP4 (H.264) video file.
    Mp4,
}

/// Configuration for a video-to-ASCII conversion.
///
/// Holds the input path, output mode, optional audio preservation,
/// and the shared image-conversion settings.
#[derive(Debug, Clone)]
pub struct VideoConfig {
    /// Path to the input video file.
    pub input: PathBuf,
    /// Optional output path (required for GIF and MP4 modes).
    pub output: Option<PathBuf>,
    /// The output mode — terminal, GIF, or MP4.
    pub mode: VideoOutputMode,
    /// When `true`, copy the original audio track into MP4 output.
    pub preserve_audio: bool,
    /// Override the detected frame rate (`None` means auto-detect).
    pub frame_rate: Option<f64>,
    /// Image-conversion settings applied to every frame.
    pub convert: ConvertConfig,
}

impl VideoConfig {
    /// Create a new config for the given input file with all defaults.
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

    /// Set the image-conversion settings (builder pattern).
    pub fn with_convert(mut self, convert: ConvertConfig) -> Self {
        self.convert = convert;
        self
    }

    /// Set the output path (builder pattern).
    pub fn with_output(mut self, output: impl Into<PathBuf>) -> Self {
        self.output = Some(output.into());
        self
    }

    /// Validate the embedded [`ConvertConfig`].
    ///
    /// Returns an error if any image-conversion parameter is out of range.
    pub fn validate(&self) -> artscii_core::Result<()> {
        self.convert.validate()
    }

    /// Convenience setter for the dithering algorithm.
    pub fn set_dithering(&mut self, dithering: DitheringStrategy) {
        self.convert.dithering = dithering;
    }
}
