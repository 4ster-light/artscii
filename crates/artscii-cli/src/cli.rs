use clap::{Parser, ValueEnum};
use std::path::PathBuf;

use artscii_img::DitheringStrategy;

#[derive(Debug, Clone, Copy, Default, ValueEnum)]
pub enum OutputFormat {
    #[default]
    Terminal,
    Text,
    Html,
}

#[derive(Parser, Debug)]
#[command(
    name = "artscii",
    author = "4ster-light",
    version,
    about = "Convert images to beautiful ASCII art",
    long_about = None,
    after_help = "Examples:\n  artscii image.png                      # Display in terminal\n  artscii image.png -c                   # Display with colors\n  artscii image.png -o art.txt           # Save as text file\n  artscii image.png -o art.html -c       # Save as colored HTML\n  artscii image.png -r 0.5 -d atkinson   # Higher resolution with Atkinson dithering"
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

    #[arg(short, long)]
    pub quiet: bool,
}

impl Cli {
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
