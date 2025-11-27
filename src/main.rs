mod cli;
mod converter;
mod dithering;
mod error;
mod output;

use anyhow::{Context, Result};
use clap::Parser;

use cli::Cli;
use converter::{ConvertConfig, convert_image, load_image};
use output::{print_header, print_info, write_output};

fn main() -> Result<()> {
    let args = Cli::parse();

    // Print header unless in quiet mode
    if !args.quiet {
        print_header(&args.input);
    }

    // Load the image
    let img = load_image(&args.input)
        .with_context(|| format!("Failed to load image: {}", args.input.display()))?;

    // Configure conversion
    let config = ConvertConfig {
        resolution: args.resolution,
        contrast: args.contrast,
        brightness: args.brightness,
        inverted: args.invert,
        colored: args.color,
        dithering: args.dithering,
    };

    // Convert to ASCII
    let result = convert_image(&img, &config).context("Failed to convert image to ASCII")?;

    // Print info unless in quiet mode
    if !args.quiet {
        print_info(result.width, result.height, result.colored);
    }

    // Determine output format and write
    let format = args.determine_format();
    write_output(&result, format, args.output.as_deref(), args.quiet)
        .context("Failed to write output")?;

    Ok(())
}
