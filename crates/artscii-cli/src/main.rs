mod cli;
mod output;

use anyhow::{Context, Result};
use clap::Parser;

use artscii_img::{convert_image, load_image};
#[cfg(feature = "video")]
use artscii_video::{convert_video, render_video};

use cli::Cli;
use output::{print_header, print_info, write_output};

fn main() -> Result<()> {
    let args = Cli::parse();

    if args.video {
        #[cfg(feature = "video")]
        {
            let config = args.to_video_config();
            let conversion = convert_video(&config).context("Failed to convert video to ASCII")?;
            render_video(&conversion, args.output.as_deref()).context("Failed to render video")?;
            return Ok(());
        }
        #[cfg(not(feature = "video"))]
        anyhow::bail!(
            "Video support was not compiled in this build. Rebuild with the 'video' feature, or use 'nix build'."
        );
    }

    if !args.quiet {
        print_header(&args.input);
    }

    let img = load_image(&args.input)
        .with_context(|| format!("Failed to load image: {}", args.input.display()))?;

    let config = args.to_convert_config();

    let result = convert_image(&img, &config).context("Failed to convert image to ASCII")?;

    if !args.quiet {
        print_info(result.width, result.height, result.colored);
    }

    let format = args.determine_format();
    write_output(&result, format, args.output.as_deref(), args.quiet)
        .context("Failed to write output")?;

    Ok(())
}
