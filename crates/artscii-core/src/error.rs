use thiserror::Error;

/// Errors that can occur during ArtSCII operations.
///
/// This is the shared error type used across the workspace. Individual
/// crates wrap it with their own error enums (e.g. [`ArtsciiImgError`]
/// in `artscii-img`).
///
/// [`ArtsciiImgError`]: https://docs.rs/artscii-img/2.0.0/artscii_img/error/enum.ArtsciiImgError.html
#[derive(Error, Debug)]
pub enum ArtsciiError {
    /// Wraps a standard I/O error (file read failures, etc.).
    #[error("Failed to read file: {0}")]
    FileRead(#[from] std::io::Error),

    /// The provided resolution was outside the valid range (0.01–1.0).
    #[error("Invalid resolution: {0}. Must be between 0.01 and 1.0")]
    InvalidResolution(f32),

    /// The provided contrast was outside the valid range (0.1–3.0).
    #[error("Invalid contrast: {0}. Must be between 0.1 and 3.0")]
    InvalidContrast(f32),

    /// The provided brightness was outside the valid range (0.1–3.0).
    #[error("Invalid brightness: {0}. Must be between 0.1 and 3.0")]
    InvalidBrightness(f32),

    /// After scaling, the resulting image dimensions are too small
    /// (width or height became 0). Increase the resolution.
    #[error("Image dimensions too small after scaling")]
    ImageTooSmall,
}

/// Convenience alias for results that use [`ArtsciiError`].
pub type Result<T> = std::result::Result<T, ArtsciiError>;
