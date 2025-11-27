# 🎨 ✰ArtSCII✰ CLI

A fast, feature-rich command-line tool to convert images to ASCII art.

## Features

- **Multiple dithering algorithms**: Floyd-Steinberg, Atkinson, and Riemersma
- **Color support**: ANSI colors for terminal, RGB for HTML output
- **Multiple output formats**: Terminal, plain text, and styled HTML
- **Image adjustments**: Resolution, contrast, and brightness controls
- **Wide format support**: PNG, JPG, GIF, BMP, WebP, and more

## Installation

### Prebuilt Binaries

Download prebuilt binaries for your platform from the
[latest release](https://github.com/4ster-light/artscii/releases/latest):

- **Linux x86_64**: `artscii-linux-x86_64`
- **Linux ARM64**: `artscii-linux-aarch64`
- **macOS x86_64**: `artscii-macos-x86_64`
- **macOS ARM64**: `artscii-macos-aarch64`
- **Windows x86_64**: `artscii-windows-x86_64.exe`

After downloading, make it executable (on Unix):

```bash
chmod +x artscii-linux-x86_64
./artscii-linux-x86_64
```

### From Cargo

Install from source using Cargo, clone the repository, and on the root of the
project run:

```bash
cargo install --path .
```

### Build Manually

Clone the repository and build:

```bash
cargo build --release # Binary will be at ./target/release/artscii
```

## Usage

### Options

| Flag | Long           | Description                        | Default |
| ---- | -------------- | ---------------------------------- | ------- |
| `-o` | `--output`     | Output file path                   | stdout  |
| `-f` | `--format`     | Output format (terminal/text/html) | auto    |
| `-r` | `--resolution` | Scale factor (0.01-1.0)            | 0.3     |
|      | `--contrast`   | Contrast (0.1-3.0)                 | 1.0     |
| `-b` | `--brightness` | Brightness (0.1-3.0)               | 1.0     |
| `-i` | `--invert`     | Invert character mapping           | false   |
| `-c` | `--color`      | Enable colored output              | false   |
| `-d` | `--dithering`  | Dithering algorithm                | none    |
| `-q` | `--quiet`      | Suppress info messages             | false   |

#### Example Commands

```bash
# Basic usage - display in terminal
artscii image.png

# With colors
artscii image.png -c

# Save as plain text
artscii image.png -o output.txt

# Save as styled HTML with colors
artscii image.png -o output.html -c

# Higher resolution with Atkinson dithering
artscii image.png -r 0.5 -d atkinson

# Adjust contrast and brightness
artscii image.png --contrast 1.5 -b 0.8

# Invert characters (for light backgrounds)
artscii image.png -i

# Quiet mode (only output the art)
artscii image.png -q
```

> And what I think is the best result for the example image:
>
> ```bash
> artscii image.png -c -b 1.5 -r 0.26 -d atkinson -o img.html
> ```

### Dithering Algorithms

- **none**: No dithering (default)
- **floyd-steinberg**: Classic error-diffusion dithering
- **atkinson**: Sharper dithering (preserves more contrast)
- **riemersma**: Space-filling curve dithering

## Sponsor

If you like this project, consider supporting me by buying me a coffee.

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/B0B41HVJUR)
