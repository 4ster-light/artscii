use image::{DynamicImage, GenericImageView, Rgb};

use artscii_core::ConvertConfig;

use crate::error::{ArtsciiImgError, Result};

const ASCII_CHARS: &str = " .,:;i1tfLCG08@";
const ASCII_CHARS_INVERTED: &str = "@80GCLft1i;:,. ";

#[derive(Debug, Clone, PartialEq)]
pub struct AsciiResult {
    pub width: usize,
    pub height: usize,
    pub chars: Vec<char>,
    pub colors: Vec<Rgb<u8>>,
    pub colored: bool,
}

impl AsciiResult {
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
