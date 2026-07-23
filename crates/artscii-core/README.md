# artscii-core

Shared foundation for the ArtSCII workspace.

> This crate contains the configuration types, error types, and dithering
> algorithms used by the other ArtSCII crates. If you only want to convert an
> image, depend on [`artscii-img`] instead, it re-exports everything from
> `artscii-core`.

[`artscii-img`]: ../artscii-img

## Contents

- [`ConvertConfig`] — resolution, contrast, brightness, inversion, color,
  dithering, with input validation.
- [`DitheringStrategy`] — `None`, `FloydSteinberg`, `Atkinson`, `Riemersma`.
- [`ArtsciiError`] — the shared error type for the workspace.

## Example

```rust
use artscii_core::{ConvertConfig, DitheringStrategy};

let mut config = ConvertConfig::default();
config.resolution = 0.4;
config.dithering = DitheringStrategy::Atkinson;
config.validate()?;
# Ok::<(), artscii_core::ArtsciiError>(())
```

The config is deliberately minimal and free of I/O concerns so it stays
straightforward to construct from a CLI, a web form, or any other front-end.

## Features

| Flag  | Effect                                            |
| ----- | ------------------------------------------------- |
| `cli` | Derives `clap::ValueEnum` on `DitheringStrategy`. |

`cli` is intended for crates that expose dithering as a CLI flag; library users
should leave it disabled.

## License

MIT
