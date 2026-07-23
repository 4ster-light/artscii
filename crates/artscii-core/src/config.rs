/// Configuration for an image-to-ASCII conversion.
///
/// All fields are public so they can be set directly or constructed from
/// a CLI, web form, or any other front-end. Call [`validate`](Self::validate)
/// after setting values to catch out-of-range parameters early.
///
/// # Defaults
///
/// | Field        | Default | Range      |
/// |--------------|---------|------------|
/// | `resolution` | `0.3`   | 0.01–1.0   |
/// | `contrast`   | `1.0`   | 0.1–3.0    |
/// | `brightness` | `1.0`   | 0.1–3.0    |
/// | `inverted`   | `false` | –          |
/// | `colored`    | `false` | –          |
/// | `dithering`  | `None`  | –          |
#[derive(Debug, Clone)]
pub struct ConvertConfig {
    /// Scale factor for output dimensions (0.01–1.0).
    /// Lower values produce smaller output with fewer characters.
    pub resolution: f32,
    /// Contrast adjustment (0.1–3.0). 1.0 means no change.
    pub contrast: f32,
    /// Brightness multiplier (0.1–3.0). 1.0 means no change.
    pub brightness: f32,
    /// When `true`, the character ramp is reversed (dark → light).
    /// Useful for light-background terminals.
    pub inverted: bool,
    /// When `true`, per-pixel colour information is preserved so
    /// formatters like `to_ansi()` and `to_html()` can emit colour.
    pub colored: bool,
    /// The dithering algorithm to apply before character mapping.
    pub dithering: crate::strategy::DitheringStrategy,
}

impl Default for ConvertConfig {
    fn default() -> Self {
        Self {
            resolution: 0.3,
            contrast: 1.0,
            brightness: 1.0,
            inverted: false,
            colored: false,
            dithering: crate::strategy::DitheringStrategy::None,
        }
    }
}

impl ConvertConfig {
    /// Checks that all numeric fields are within their valid ranges.
    ///
    /// Returns [`InvalidResolution`](crate::ArtsciiError::InvalidResolution),
    /// [`InvalidContrast`](crate::ArtsciiError::InvalidContrast),
    /// or [`InvalidBrightness`](crate::ArtsciiError::InvalidBrightness) if
    /// any value is out of bounds.
    pub fn validate(&self) -> crate::Result<()> {
        if !(0.01..=1.0).contains(&self.resolution) {
            return Err(crate::ArtsciiError::InvalidResolution(self.resolution));
        }
        if !(0.1..=3.0).contains(&self.contrast) {
            return Err(crate::ArtsciiError::InvalidContrast(self.contrast));
        }
        if !(0.1..=3.0).contains(&self.brightness) {
            return Err(crate::ArtsciiError::InvalidBrightness(self.brightness));
        }
        Ok(())
    }
}
