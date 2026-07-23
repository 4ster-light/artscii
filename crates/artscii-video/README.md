# artscii-video

Convert a video to animated ASCII art — terminal playback, animated GIF, or MP4.

> This crate provides the video conversion pipeline on top of [`artscii-img`].
> It requires system `ffmpeg` libraries at build and run time.

## Contents

- [`VideoConfig`] — input path, output mode (`Terminal`, `Gif`, `Mp4`), optional
  audio preservation, plus the shared [`ConvertConfig`].
- [`convert_video`] — decodes the video frame-by-frame and runs each frame
  through the image converter.
- [`render_video`] — renders a completed conversion to the chosen output.

## Example

```rust
use artscii_video::{VideoConfig, VideoOutputMode, convert_video, render_video};
use artscii_core::DitheringStrategy;

let mut config = VideoConfig::new("clip.mp4".as_ref());
config.mode = VideoOutputMode::Gif;
config.convert.resolution = 0.4;
config.convert.colored = true;
config.convert.dithering = DitheringStrategy::Atkinson;

let conversion = convert_video(&config)?;
render_video(&conversion, Some("out.gif".as_ref()))?;
# Ok::<(), Box<dyn std::error::Error>>(())
```

## Using from another Rust project

```toml
[dependencies]
artscii-video = { git = "https://github.com/4ster-light/artscii" }
```

Refer to the [workspace README](../../README.md) for more details on using the
crates.

### Build dependencies

Video support requires `ffmpeg` development libraries and `clang` for bindgen:

| Platform | Build dependencies                                                                                        |
| -------- | --------------------------------------------------------------------------------------------------------- |
| Nix      | `nix develop` (everything included)                                                                       |
| Fedora   | `ffmpeg-devel alsa-lib-devel clang-devel`                                                                 |
| Debian   | `libavcodec-dev libavformat-dev libavutil-dev libavfilter-dev libswscale-dev libasound2-dev libclang-dev` |
| Arch     | `ffmpeg alsa-lib clang`                                                                                   |
| macOS    | `brew install ffmpeg`                                                                                     |

## License

MIT
