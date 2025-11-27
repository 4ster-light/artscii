use image::{DynamicImage, GenericImageView, Rgb};

use crate::dithering::DitheringStrategy;
use crate::error::{ArtsciiError, Result};

/// Default ASCII character ramp from dark to light
const ASCII_CHARS: &str = " .,:;i1tfLCG08@";
/// Inverted ASCII character ramp from light to dark
const ASCII_CHARS_INVERTED: &str = "@80GCLft1i;:,. ";

/// Configuration for ASCII art generation
#[derive(Debug, Clone)]
pub struct ConvertConfig {
    /// Scale factor for the output (0.01 to 1.0)
    pub resolution: f32,
    /// Contrast adjustment (0.1 to 3.0)
    pub contrast: f32,
    /// Brightness adjustment (0.1 to 3.0)
    pub brightness: f32,
    /// Invert the character mapping
    pub inverted: bool,
    /// Use colored output
    pub colored: bool,
    /// Dithering algorithm to use
    pub dithering: DitheringStrategy,
}

impl Default for ConvertConfig {
    fn default() -> Self {
        Self {
            resolution: 0.3,
            contrast: 1.0,
            brightness: 1.0,
            inverted: false,
            colored: false,
            dithering: DitheringStrategy::None,
        }
    }
}

impl ConvertConfig {
    pub fn validate(&self) -> Result<()> {
        if !(0.01..=1.0).contains(&self.resolution) {
            return Err(ArtsciiError::InvalidResolution(self.resolution));
        }
        if !(0.1..=3.0).contains(&self.contrast) {
            return Err(ArtsciiError::InvalidContrast(self.contrast));
        }
        if !(0.1..=3.0).contains(&self.brightness) {
            return Err(ArtsciiError::InvalidBrightness(self.brightness));
        }
        Ok(())
    }
}

/// Result of ASCII conversion containing all necessary data for output
#[derive(Debug)]
pub struct AsciiResult {
    pub width: usize,
    pub height: usize,
    pub chars: Vec<char>,
    pub colors: Vec<Rgb<u8>>,
    pub colored: bool,
}

impl AsciiResult {
    /// Convert to plain text (no colors)
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

    /// Convert to ANSI colored terminal output
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

    /// Convert to HTML with inline styles
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
                    let escaped = html_escape::encode_text(&char_str);
                    result.push_str(&escaped);
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

/// Calculate perceived brightness using ITU-R BT.601 luma formula
#[inline]
fn get_brightness(r: u8, g: u8, b: u8) -> f32 {
    0.299 * r as f32 + 0.587 * g as f32 + 0.114 * b as f32
}

/// Apply contrast and brightness adjustments to a pixel value
#[inline]
fn adjust_pixel(value: f32, contrast: f32, brightness: f32) -> f32 {
    let adjusted = (value - 128.0) * contrast + 128.0;
    let adjusted = adjusted * brightness;
    adjusted.clamp(0.0, 255.0)
}

/// Convert an image to ASCII art
pub fn convert_image(img: &DynamicImage, config: &ConvertConfig) -> Result<AsciiResult> {
    config.validate()?;

    let (orig_width, orig_height) = img.dimensions();

    // Calculate new dimensions (height is halved because terminal chars are ~2:1)
    let new_width = ((orig_width as f32) * config.resolution).floor() as usize;
    let new_height = ((orig_height as f32) * config.resolution * 0.5).floor() as usize;

    if new_width < 1 || new_height < 1 {
        return Err(ArtsciiError::ImageTooSmall);
    }

    // Resize image for processing
    let resized = img.resize_exact(
        new_width as u32,
        new_height as u32,
        image::imageops::FilterType::Lanczos3,
    );

    let rgb_img = resized.to_rgb8();

    // Extract pixel data with adjustments
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

    // Apply dithering
    let chars: Vec<char> = if config.inverted {
        ASCII_CHARS_INVERTED.chars().collect()
    } else {
        ASCII_CHARS.chars().collect()
    };
    let char_count = chars.len();

    config
        .dithering
        .apply(&mut grayscale, new_width, new_height, char_count);

    // Convert to ASCII characters
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

/// Load an image from a file path
pub fn load_image(path: &std::path::Path) -> Result<DynamicImage> {
    let img = image::open(path)?;
    Ok(img)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_brightness_calculation() {
        // Black should be 0
        assert!((get_brightness(0, 0, 0) - 0.0).abs() < 0.001);
        // White should be ~255
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
