#[derive(Debug, Clone)]
pub struct VideoConfig {
    pub input: std::path::PathBuf,
    pub output: Option<std::path::PathBuf>,
}

impl VideoConfig {
    pub fn new(input: impl Into<std::path::PathBuf>) -> Self {
        Self {
            input: input.into(),
            output: None,
        }
    }
}
