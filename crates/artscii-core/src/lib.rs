pub mod config;
pub mod error;
pub mod strategy;

pub use config::ConvertConfig;
pub use error::{ArtsciiError, Result};
pub use strategy::DitheringStrategy;
