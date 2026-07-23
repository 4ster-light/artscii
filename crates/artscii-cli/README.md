# artscii-cli

Command-line interface for ArtSCII — convert images and videos to ASCII art
directly from your terminal.

> This crate builds the `artscii` binary. For programmatic use see
> [`artscii-img`] and [`artscii-video`].

[`artscii-img`]: ../artscii-img
[`artscii-video`]: ../artscii-video

## Quick start

```bash
# Install from source
cargo install --git https://github.com/4ster-light/artscii artscii-cli --features video

# Convert an image
artscii photo.jpg

# With colours
artscii photo.jpg -c

# Save as HTML
artscii photo.jpg -c -o art.html

# Video to animated GIF
artscii clip.mp4 --video --video-format gif -c -o out.gif
```

See the [repository README](../../README.md) for the full option reference and
more examples.

## Features

| Flag    | Effect                                           | Default |
| ------- | ------------------------------------------------ | ------- |
| `video` | Enable video decoding and encoding (via ffmpeg). | on      |

Disable `video` if you only need image conversion and want to avoid compiling
`ffmpeg-next`:

```bash
cargo install --git https://github.com/4ster-light/artscii artscii-cli --no-default-features
```

## License

MIT
