pub mod converter;
pub mod error;

pub use artscii_core::{ArtsciiError, ConvertConfig, DitheringStrategy};
pub use converter::{AsciiResult, convert_image, load_image};
pub use error::{ArtsciiImgError, Result};
