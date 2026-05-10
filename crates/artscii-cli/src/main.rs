mod cli;
mod output;

use anyhow::{Context, Result};
use clap::Parser;

use artscii_img::{ConvertConfig, convert_image, load_image};

use cli::Cli;
use output::{print_header, print_info, write_output};

fn main() -> Result<()> {
    let args = Cli::parse();

    if !args.quiet {
        print_header(&args.input);
    }

    let img = load_image(&args.input)
        .with_context(|| format!("Failed to load image: {}", args.input.display()))?;

    let config = ConvertConfig {
        resolution: args.resolution,
        contrast: args.contrast,
        brightness: args.brightness,
        inverted: args.invert,
        colored: args.color,
        dithering: args.dithering,
    };

    let result = convert_image(&img, &config).context("Failed to convert image to ASCII")?;

    if !args.quiet {
        print_info(result.width, result.height, result.colored);
    }

    let format = args.determine_format();
    write_output(&result, format, args.output.as_deref(), args.quiet)
        .context("Failed to write output")?;

    Ok(())
}
