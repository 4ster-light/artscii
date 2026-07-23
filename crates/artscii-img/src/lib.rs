//! Image loading and ASCII conversion for ArtSCII.
//!
//! This is the main library entry-point for the workspace. It re-exports
//! the configuration types from [`artscii_core`] so depending on this crate
//! alone is enough for most image-to-ASCII use cases.
//!
//! # Quick start
//!
//! ```rust,no_run
//! use artscii_img::{convert_image, load_image, ConvertConfig};
//!
//! let img = load_image("photo.png".as_ref())?;
//! let result = convert_image(&img, &ConvertConfig::default())?;
//! println!("{}", result.to_plain_text());
//! # Ok::<(), artscii_img::ArtsciiImgError>(())
//! ```

pub mod converter;
pub mod error;

pub use artscii_core::{ArtsciiError, ConvertConfig, DitheringStrategy};
pub use converter::{AsciiResult, convert_image, load_image};
pub use error::{ArtsciiImgError, Result};
