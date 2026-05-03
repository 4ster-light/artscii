# ✰ArtSCII✰ CLI (previously [✰ArtSCII✰](https://artscii.deno.dev))

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

### Using Nix

Install into your profile:

```bash
nix profile add github:4ster-light/artscii
```

Or add to your system configuration if using NixOS.

### Cargo

Install from source using Cargo, directly from the repository:

```bash
cargo install --git https://github.com/4ster-light/artscii
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

### Example Commands

```bash
# Basic usage - display in terminal
artscii image.jpg

# With colors
artscii image.jpg -c

# Save as plain text
artscii image.jpg -o output.txt

# Save as styled HTML with colors
artscii image.jpg -o output.html -c

# Higher resolution with Atkinson dithering
artscii image.jpg -r 0.5 -d atkinson

# Adjust contrast and brightness
artscii image.jpg --contrast 1.5 -b 0.8

# Invert characters (for light backgrounds)
artscii image.jpg -i

# Quiet mode (only output the art)
artscii image.jpg -q
```

> And what I think is the best result for the example image in this repo:
>
> ```bash
> artscii image.jpg -c -b 1.5 -r 0.26 -d atkinson -o img.html
> ```

### Dithering Algorithms

- **none**: No dithering (default)
- **floyd-steinberg**: Classic error-diffusion dithering
- **atkinson**: Sharper dithering (preserves more contrast)
- **riemersma**: Space-filling curve dithering

## License

MIT
