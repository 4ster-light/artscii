use clap::{Parser, ValueEnum};
use std::path::PathBuf;

use artscii_img::DitheringStrategy;
#[cfg(feature = "video")]
use artscii_video::{VideoConfig, VideoOutputMode};

/// Output format for image-to-ASCII conversion.
///
/// When not specified explicitly, the format is inferred from the output
/// file extension (`.html` → Html, `.txt` → Text) or defaults to
/// [`OutputFormat::Terminal`].
#[derive(Debug, Clone, Copy, Default, ValueEnum)]
pub enum OutputFormat {
    /// Print to stdout with optional ANSI colours.
    #[default]
    Terminal,
    /// Plain UTF-8 text (with ANSI escapes if `--color` is set).
    Text,
    /// Self-contained styled HTML document.
    Html,
}

/// Video output mode — determines how the converted frames are rendered.
#[derive(Debug, Clone, Copy, Default, ValueEnum)]
pub enum VideoFormat {
    /// Play back in the terminal (frame-by-frame with ASCII).
    #[default]
    Terminal,
    /// Export as an animated GIF.
    Gif,
    /// Export as an MP4 video file.
    Mp4,
}

#[derive(Parser, Debug)]
#[command(
    name = "artscii",
    author = "4ster-light",
    version,
    about = "Convert images to beautiful ASCII art",
    long_about = None,
    after_help = "Examples:\n  artscii image.png                      # Display in terminal\n  artscii image.png -c                   # Display with colors\n  artscii image.png -c -o art.txt        # Save ANSI-colored text\n  artscii image.png -o art.txt           # Save as plain text\n  artscii image.png -o art.html -c       # Save as colored HTML\n  artscii image.png -r 0.5 -d atkinson   # Higher resolution with Atkinson dithering"
)]
pub struct Cli {
    #[arg(value_name = "IMAGE")]
    pub input: PathBuf,

    #[arg(short, long, value_name = "FILE")]
    pub output: Option<PathBuf>,

    #[arg(short, long, value_enum, value_name = "FORMAT")]
    pub format: Option<OutputFormat>,

    #[arg(short, long, default_value = "0.3", value_name = "SCALE")]
    pub resolution: f32,

    #[arg(long, default_value = "1.0", value_name = "VALUE")]
    pub contrast: f32,

    #[arg(short, long, default_value = "1.0", value_name = "VALUE")]
    pub brightness: f32,

    #[arg(short, long)]
    pub invert: bool,

    #[arg(short, long)]
    pub color: bool,

    #[arg(
        short,
        long,
        value_enum,
        default_value = "none",
        value_name = "ALGORITHM"
    )]
    pub dithering: DitheringStrategy,

    #[arg(long)]
    pub video: bool,

    #[arg(long, value_enum, default_value = "terminal")]
    pub video_format: VideoFormat,

    #[arg(long)]
    pub preserve_audio: bool,

    #[arg(short, long)]
    pub quiet: bool,
}

impl Cli {
    /// Determine the output format, respecting explicit `--format` first,
    /// then falling back to the output file extension, then to
    /// [`OutputFormat::Terminal`].
    pub fn determine_format(&self) -> OutputFormat {
        if let Some(format) = self.format {
            return format;
        }

        if let Some(ref path) = self.output
            && let Some(ext) = path.extension()
        {
            return match ext.to_str().unwrap_or("").to_lowercase().as_str() {
                "html" | "htm" => OutputFormat::Html,
                "txt" | "text" | "ascii" => OutputFormat::Text,
                _ => OutputFormat::Terminal,
            };
        }

        OutputFormat::Terminal
    }

    /// Build a [`VideoConfig`] from the CLI arguments.
    #[cfg(feature = "video")]
    pub fn to_video_config(&self) -> VideoConfig {
        let mut config = VideoConfig::new(&self.input);
        config.output = self.output.clone();
        config.mode = match self.video_format {
            VideoFormat::Terminal => VideoOutputMode::Terminal,
            VideoFormat::Gif => VideoOutputMode::Gif,
            VideoFormat::Mp4 => VideoOutputMode::Mp4,
        };
        config.preserve_audio = self.preserve_audio;
        config.convert.resolution = self.resolution;
        config.convert.contrast = self.contrast;
        config.convert.brightness = self.brightness;
        config.convert.inverted = self.invert;
        config.convert.colored = self.color;
        config.convert.dithering = self.dithering;
        config
    }

    /// Build a [`artscii_img::ConvertConfig`] from the CLI arguments.
    pub fn to_convert_config(&self) -> artscii_img::ConvertConfig {
        artscii_img::ConvertConfig {
            resolution: self.resolution,
            contrast: self.contrast,
            brightness: self.brightness,
            inverted: self.invert,
            colored: self.color,
            dithering: self.dithering,
        }
    }
}
