use std::fs;
use std::io::{self, Write};
use std::path::Path;

use artscii_img::AsciiResult;

use crate::cli::OutputFormat;
use anyhow::Result;

/// Write the ASCII result in the requested format to stdout or a file.
///
/// * [`OutputFormat::Terminal`] — prints to stdout (ANSI-coloured if `result.colored`).
/// * [`OutputFormat::Text`] — writes UTF-8 to a file or stdout.
/// * [`OutputFormat::Html`] — writes a full HTML document to a file or stdout.
pub fn write_output(
    result: &AsciiResult,
    format: OutputFormat,
    output_path: Option<&Path>,
    quiet: bool,
) -> Result<()> {
    match format {
        OutputFormat::Terminal => {
            let output = if result.colored {
                result.to_ansi()
            } else {
                result.to_plain_text()
            };
            print!("{}", output);
            io::stdout().flush()?;
        }
        OutputFormat::Text => {
            let output = if result.colored {
                result.to_ansi()
            } else {
                result.to_plain_text()
            };
            if let Some(path) = output_path {
                fs::write(path, &output)?;
                if !quiet {
                    eprintln!("✓ Saved ASCII art to: {}", path.display());
                }
            } else {
                print!("{}", output);
                io::stdout().flush()?;
            }
        }
        OutputFormat::Html => {
            let output = result.to_html();
            if let Some(path) = output_path {
                fs::write(path, &output)?;
                if !quiet {
                    eprintln!("✓ Saved HTML to: {}", path.display());
                }
            } else {
                print!("{}", output);
                io::stdout().flush()?;
            }
        }
    }

    Ok(())
}

/// Print the conversion header (logo + input path) to stderr.
pub fn print_header(input_path: &Path) {
    use colored::Colorize;

    eprintln!(
        "{} {}",
        "🎨 Artscii".bold().cyan(),
        "- Image to ASCII Art Converter".dimmed()
    );
    eprintln!(
        "{} {}",
        "📁 Input:".bold(),
        input_path.display().to_string().green()
    );
    eprintln!();
}

/// Print conversion info (dimensions, colour status) to stderr.
pub fn print_info(width: usize, height: usize, colored: bool) {
    use colored::Colorize;

    eprintln!(
        "{} {}x{} characters {}",
        "📐 Size:".bold(),
        width.to_string().yellow(),
        height.to_string().yellow(),
        if colored {
            "(colored)".cyan().to_string()
        } else {
            "".to_string()
        }
    );
    eprintln!();
}
