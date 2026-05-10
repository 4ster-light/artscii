use thiserror::Error;

use artscii_core::ArtsciiError;

#[derive(Error, Debug)]
pub enum ArtsciiImgError {
    #[error(transparent)]
    Core(#[from] ArtsciiError),

    #[error("Failed to load image: {0}")]
    ImageLoad(#[from] image::ImageError),
}

pub type Result<T> = std::result::Result<T, ArtsciiImgError>;
