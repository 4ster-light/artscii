use crate::VideoConfig;

#[derive(Debug, Clone, Copy)]
pub struct VideoDecoder;

impl Default for VideoDecoder {
    fn default() -> Self {
        Self::new()
    }
}

impl VideoDecoder {
    pub fn new() -> Self {
        Self
    }

    pub fn open(_config: &VideoConfig) -> Self {
        Self
    }
}
