use thiserror::Error;

use artscii_core::ArtsciiError;

/// Wraps errors from `artscii-core` and adds image-specific errors.
///
/// The [`Core`](ArtsciiImgError::Core) variant transparently forwards any
/// [`ArtsciiError`] (invalid config values, image-too-small, I/O errors).
#[derive(Error, Debug)]
pub enum ArtsciiImgError {
    /// An error from the underlying `artscii-core` crate.
    #[error(transparent)]
    Core(#[from] ArtsciiError),

    /// Failed to decode or load the image file.
    #[error("Failed to load image: {0}")]
    ImageLoad(#[from] image::ImageError),
}

/// Convenience alias for results that use [`ArtsciiImgError`].
pub type Result<T> = std::result::Result<T, ArtsciiImgError>;
