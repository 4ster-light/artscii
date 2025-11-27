use thiserror::Error;

#[derive(Error, Debug)]
pub enum ArtsciiError {
    #[error("Failed to load image: {0}")]
    ImageLoad(#[from] image::ImageError),

    #[error("Failed to read file: {0}")]
    FileRead(#[from] std::io::Error),

    #[error("Invalid resolution: {0}. Must be between 0.01 and 1.0")]
    InvalidResolution(f32),

    #[error("Invalid contrast: {0}. Must be between 0.1 and 3.0")]
    InvalidContrast(f32),

    #[error("Invalid brightness: {0}. Must be between 0.1 and 3.0")]
    InvalidBrightness(f32),

    #[error("Image dimensions too small after scaling")]
    ImageTooSmall,
}

pub type Result<T> = std::result::Result<T, ArtsciiError>;
