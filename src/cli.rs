use clap::{Parser, ValueEnum};
use std::path::PathBuf;

use crate::dithering::DitheringStrategy;

#[derive(Debug, Clone, Copy, Default, ValueEnum)]
pub enum OutputFormat {
    /// Print to terminal (with optional ANSI colors)
    #[default]
    Terminal,
    /// Save as plain text file
    Text,
    /// Save as HTML file with styling
    Html,
}

/// Convert images to beautiful ASCII art
///
/// Artscii transforms your images into ASCII art with support for
/// multiple dithering algorithms, color output, and various export formats.
#[derive(Parser, Debug)]
#[command(
    name = "artscii",
    author = "4ster-light",
    version,
    about = "🎨 Convert images to beautiful ASCII art",
    long_about = None,
    after_help = "Examples:
  artscii image.png                      # Display in terminal
  artscii image.png -c                   # Display with colors
  artscii image.png -o art.txt           # Save as text file
  artscii image.png -o art.html -c       # Save as colored HTML
  artscii image.png -r 0.5 -d atkinson   # Higher resolution with Atkinson dithering"
)]
pub struct Cli {
    /// Input image file (supports PNG, JPG, GIF, BMP, WebP, etc.)
    #[arg(value_name = "IMAGE")]
    pub input: PathBuf,

    /// Output file path (if not specified, prints to terminal)
    #[arg(short, long, value_name = "FILE")]
    pub output: Option<PathBuf>,

    /// Output format (auto-detected from extension if not specified)
    #[arg(short, long, value_enum, value_name = "FORMAT")]
    pub format: Option<OutputFormat>,

    /// Resolution scale factor (0.01 to 1.0)
    #[arg(short, long, default_value = "0.3", value_name = "SCALE")]
    pub resolution: f32,

    /// Contrast adjustment (0.1 to 3.0)
    #[arg(long, default_value = "1.0", value_name = "VALUE")]
    pub contrast: f32,

    /// Brightness adjustment (0.1 to 3.0)
    #[arg(short, long, default_value = "1.0", value_name = "VALUE")]
    pub brightness: f32,

    /// Invert the ASCII character mapping
    #[arg(short, long)]
    pub invert: bool,

    /// Enable colored output (ANSI for terminal, RGB for HTML)
    #[arg(short, long)]
    pub color: bool,

    /// Dithering algorithm to apply
    #[arg(
        short,
        long,
        value_enum,
        default_value = "none",
        value_name = "ALGORITHM"
    )]
    pub dithering: DitheringStrategy,

    /// Suppress all non-error output except the ASCII art itself
    #[arg(short, long)]
    pub quiet: bool,
}

impl Cli {
    /// Determine the output format based on arguments and file extension
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
}
