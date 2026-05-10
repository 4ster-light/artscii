use crate::VideoConfig;

#[derive(Debug, Clone, Copy)]
pub struct VideoEncoder;

impl Default for VideoEncoder {
    fn default() -> Self {
        Self::new()
    }
}

impl VideoEncoder {
    pub fn new() -> Self {
        Self
    }

    pub fn open(_config: &VideoConfig) -> Self {
        Self
    }
}
