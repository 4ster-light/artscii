#[derive(Debug, Clone)]
pub struct ConvertConfig {
    pub resolution: f32,
    pub contrast: f32,
    pub brightness: f32,
    pub inverted: bool,
    pub colored: bool,
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
