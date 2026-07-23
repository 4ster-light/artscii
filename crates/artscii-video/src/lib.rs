//! Video-to-ASCII conversion pipeline for ArtSCII.
//!
//! This crate provides video decoding (via `ffmpeg-next`), frame-by-frame
//! ASCII conversion (via [`artscii_img`]), and encoding for terminal playback,
//! animated GIF, or MP4 output.
//!
//! # Quick start
//!
//! ```rust,no_run
//! use artscii_video::{VideoConfig, VideoOutputMode, convert_video, render_video};
//!
//! let mut config = VideoConfig::new("clip.mp4");
//! config.mode = VideoOutputMode::Gif;
//! let conversion = convert_video(&config)?;
//! render_video(&conversion, Some("out.gif".as_ref()))?;
//! # Ok::<(), Box<dyn std::error::Error>>(())
//! ```

pub mod audio;
pub mod config;
pub mod decoder;
pub mod encoder;
pub mod pipeline;

pub use config::{VideoConfig, VideoOutputMode};
pub use pipeline::{FrameConversion, VideoConversion, convert_video, render_video};
