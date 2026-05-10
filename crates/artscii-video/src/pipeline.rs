use artscii_core::ConvertConfig;

#[derive(Debug, Clone)]
pub struct FrameConversion {
    pub frame_index: usize,
    pub config: ConvertConfig,
}

#[derive(Debug, Clone)]
pub struct VideoConversion {
    pub frames: Vec<FrameConversion>,
}

impl Default for VideoConversion {
    fn default() -> Self {
        Self::new()
    }
}

impl VideoConversion {
    pub fn new() -> Self {
        Self { frames: Vec::new() }
    }
}
