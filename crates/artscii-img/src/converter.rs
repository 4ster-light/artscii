use image::{DynamicImage, GenericImageView, Rgb};

use artscii_core::ConvertConfig;

use crate::error::{ArtsciiImgError, Result};

const ASCII_CHARS: &str = " .,:;i1tfLCG08@";
const ASCII_CHARS_INVERTED: &str = "@80GCLft1i;:,. ";

/// The result of an ASCII conversion — a grid of characters, optional
/// per-cell colour, and ready-made formatters.
///
/// # Output formats
///
/// * [`to_plain_text`](Self::to_plain_text) — newline-delimited UTF-8, always available.
/// * [`to_ansi`](Self::to_ansi) — terminal-coloured output (requires the `cli` feature).
/// * [`to_html`](Self::to_html) — self-contained styled HTML document.
#[derive(Debug, Clone, PartialEq)]
pub struct AsciiResult {
    /// Width of the character grid.
    pub width: usize,
    /// Height of the character grid.
    pub height: usize,
    /// Row-major character buffer (`chars[y * width + x]`).
    pub chars: Vec<char>,
    /// Row-major per-pixel colour buffer, even when `colored` is `false`.
    pub colors: Vec<Rgb<u8>>,
    /// Whether the conversion was configured with `colored = true`.
    pub colored: bool,
}

impl AsciiResult {
    /// Render the ASCII grid as plain UTF-8 text with newlines.
    ///
    /// Ignores colour information — use [`to_ansi`](Self::to_ansi) or
    /// [`to_html`](Self::to_html) for colour output.
    pub fn to_plain_text(&self) -> String {
        let mut result = String::with_capacity(self.width * self.height + self.height);

        for y in 0..self.height {
            for x in 0..self.width {
                result.push(self.chars[y * self.width + x]);
            }
            result.push('\n');
        }

        result
    }

    /// Render as ANSI-coloured terminal text.
    ///
    /// Requires the `cli` feature (depends on `colored`). If the conversion
    /// was not configured with `colored = true`, this falls back to plain text.
    #[cfg(feature = "cli")]
    pub fn to_ansi(&self) -> String {
        use colored::Colorize;

        if !self.colored {
            return self.to_plain_text();
        }

        let mut result = String::new();

        for y in 0..self.height {
            for x in 0..self.width {
                let i = y * self.width + x;
                let c = self.chars[i];
                let color = self.colors[i];
                let colored_char = c.to_string().truecolor(color[0], color[1], color[2]);
                result.push_str(&colored_char.to_string());
            }
            result.push('\n');
        }

        result
    }

    /// Render as a self-contained HTML document.
    ///
    /// Produces a complete `<html>` page with dark-background styling. When
    /// `colored` is `true`, each character is wrapped in a `<span>` with an
    /// inline `color:rgb(…)` style.
    pub fn to_html(&self) -> String {
        let mut result = String::from(
            r#"<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ASCII Art</title>
    <style>
        body {
            background-color: #1a1a2e;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
            box-sizing: border-box;
        }
        pre {
            font-family: 'Courier New', Courier, monospace;
            font-size: 8px;
            line-height: 1;
            letter-spacing: 0.1em;
            background-color: #0f0f1a;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        }
    </style>
</head>
<body>
    <pre>"#,
        );

        if self.colored {
            for y in 0..self.height {
                for x in 0..self.width {
                    let i = y * self.width + x;
                    let c = self.chars[i];
                    let color = self.colors[i];
                    let char_str = c.to_string();
                    let escaped = html_escape::encode_text(&char_str);
                    result.push_str(&format!(
                        r#"<span style="color:rgb({},{},{})">{}</span>"#,
                        color[0], color[1], color[2], escaped
                    ));
                }
                result.push_str("<br>");
            }
        } else {
            for y in 0..self.height {
                for x in 0..self.width {
                    let c = self.chars[y * self.width + x];
                    let char_str = c.to_string();
                    result.push_str(&html_escape::encode_text(&char_str));
                }
                result.push_str("<br>");
            }
        }

        result.push_str(
            r#"</pre>
</body>
</html>"#,
        );

        result
    }
}

#[inline]
fn get_brightness(r: u8, g: u8, b: u8) -> f32 {
    0.299 * r as f32 + 0.587 * g as f32 + 0.114 * b as f32
}

#[inline]
fn adjust_pixel(value: f32, contrast: f32, brightness: f32) -> f32 {
    let adjusted = (value - 128.0) * contrast + 128.0;
    let adjusted = adjusted * brightness;
    adjusted.clamp(0.0, 255.0)
}

/// Convert an image to an ASCII art grid.
///
/// Resizes the image according to `config.resolution`, optionally adjusts
/// contrast and brightness, applies the chosen dithering, and maps each
/// pixel to a character from the internal ramp (` .,:;i1tfLCG08@`).
///
/// # Errors
///
/// Returns [`ArtsciiImgError::Core`] if the config fails validation or the
/// scaled dimensions become zero.
pub fn convert_image(img: &DynamicImage, config: &ConvertConfig) -> Result<AsciiResult> {
    config.validate()?;

    let (orig_width, orig_height) = img.dimensions();
    let new_width = ((orig_width as f32) * config.resolution).floor() as usize;
    let new_height = ((orig_height as f32) * config.resolution * 0.5).floor() as usize;

    if new_width < 1 || new_height < 1 {
        return Err(ArtsciiImgError::from(
            artscii_core::ArtsciiError::ImageTooSmall,
        ));
    }

    let resized = img.resize_exact(
        new_width as u32,
        new_height as u32,
        image::imageops::FilterType::Lanczos3,
    );

    let rgb_img = resized.to_rgb8();

    let mut grayscale: Vec<f32> = Vec::with_capacity(new_width * new_height);
    let mut colors: Vec<Rgb<u8>> = Vec::with_capacity(new_width * new_height);

    for y in 0..new_height {
        for x in 0..new_width {
            let pixel = rgb_img.get_pixel(x as u32, y as u32);
            let r = adjust_pixel(pixel[0] as f32, config.contrast, config.brightness) as u8;
            let g = adjust_pixel(pixel[1] as f32, config.contrast, config.brightness) as u8;
            let b = adjust_pixel(pixel[2] as f32, config.contrast, config.brightness) as u8;

            grayscale.push(get_brightness(r, g, b));
            colors.push(Rgb([r, g, b]));
        }
    }

    let chars: Vec<char> = if config.inverted {
        ASCII_CHARS_INVERTED.chars().collect()
    } else {
        ASCII_CHARS.chars().collect()
    };
    let char_count = chars.len();

    config
        .dithering
        .apply(&mut grayscale, new_width, new_height, char_count);

    let ascii_chars: Vec<char> = grayscale
        .iter()
        .map(|&brightness| {
            let index = ((brightness / 255.0) * (char_count - 1) as f32)
                .round()
                .clamp(0.0, (char_count - 1) as f32) as usize;
            chars[index]
        })
        .collect();

    Ok(AsciiResult {
        width: new_width,
        height: new_height,
        chars: ascii_chars,
        colors,
        colored: config.colored,
    })
}

/// Load an image from a file path.
///
/// This is a thin convenience wrapper around [`image::open`] that returns
/// an [`ArtsciiImgError::ImageLoad`] on failure.
pub fn load_image(path: &std::path::Path) -> Result<DynamicImage> {
    let img = image::open(path)?;
    Ok(img)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_brightness_calculation() {
        assert!((get_brightness(0, 0, 0) - 0.0).abs() < 0.001);
        assert!((get_brightness(255, 255, 255) - 255.0).abs() < 0.001);
    }

    #[test]
    fn test_adjust_pixel_clamping() {
        assert!((adjust_pixel(0.0, 1.0, 1.0) - 0.0).abs() < 0.001);
        assert!((adjust_pixel(300.0, 1.0, 1.0) - 255.0).abs() < 0.001);
    }

    #[test]
    fn test_config_validation() {
        let mut config = ConvertConfig::default();
        assert!(config.validate().is_ok());

        config.resolution = 0.0;
        assert!(config.validate().is_err());

        config.resolution = 0.5;
        config.contrast = 0.0;
        assert!(config.validate().is_err());
    }
}
