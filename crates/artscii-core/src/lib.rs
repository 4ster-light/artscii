//! Shared foundation for the ArtSCII workspace.
//!
//! This crate provides the core types that all other ArtSCII crates build on:
//! conversion configuration ([`ConvertConfig`]), dithering algorithms
//! ([`DitheringStrategy`]), and error handling ([`ArtsciiError`]).
//!
//! # Example
//!
//! ```rust
//! use artscii_core::{ConvertConfig, DitheringStrategy};
//!
//! let mut config = ConvertConfig::default();
//! config.resolution = 0.4;
//! config.dithering = DitheringStrategy::Atkinson;
//! config.validate()?;
//! # Ok::<(), artscii_core::ArtsciiError>(())
//! ```

pub mod config;
pub mod error;
pub mod strategy;

pub use config::ConvertConfig;
pub use error::{ArtsciiError, Result};
pub use strategy::DitheringStrategy;
