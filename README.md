# ✰ArtSCII✰

A workspace with a shared foundation crate, a reusable image-conversion crate, a
CLI binary, and video scaffolding.

## Table of Contents

- [Features](#features)
- [Workspace](#workspace)
- [Using the crate](#using-the-crate)
- [Installation](#installation)
  - [cargo-binstall](#cargo-binstall)
  - [Install script](#install-script)
  - [Prebuilt binaries](#prebuilt-binaries)
  - [Nix](#nix)
  - [Cargo](#cargo)
- [Usage](#usage)
  - [Options](#options)
  - [Example Commands](#example-commands)
  - [Dithering Algorithms](#dithering-algorithms)
- [Building from Source](#building-from-source)
  - [Dependencies](#dependencies)
- [License](#license)

## Features

- **Multiple dithering algorithms**: Floyd-Steinberg, Atkinson, and Riemersma
- **Color support**: ANSI colors for terminal and text output, RGB for HTML
  output
- **Multiple output formats**: Terminal, plain text, colorized text, styled
  HTML, GIF, and MP4
- **Video to ASCII animation**: Convert video to animated ASCII in terminal,
  GIF, or MP4
- **Image adjustments**: Resolution, contrast, and brightness controls
- **Wide format support**: PNG, JPG, GIF, BMP, WebP, and more
- **Browser-based**: Convert images to ASCII art entirely client-side via
  WebAssembly

## Workspace

The project is organized as a Cargo workspace with the following crates:

| Crate                                   | Description                                     | Type          |
| --------------------------------------- | ----------------------------------------------- | ------------- |
| [`artscii-core`](crates/artscii-core)   | Shared config, errors, and dithering strategies | Library       |
| [`artscii-img`](crates/artscii-img)     | Image loading and ASCII conversion              | Library       |
| [`artscii-video`](crates/artscii-video) | Video decoding and ASCII encoding               | Library       |
| [`artscii-web`](crates/artscii-web)     | Browser-based WASM converter                    | Binary (WASM) |
| [`artscii-cli`](crates/artscii-cli)     | Command-line interface                          | Binary        |

The three library crates (`core`, `img`, `video`) are designed to be usable from
other Rust projects. See each crate's README for details.

## Using the crate

Use `artscii-img` from another Rust project as a local path dependency:

```bash
cargo add --git https://github.com/4ster-light/artscii artscii-img
# If you want to lock it to a branch, tag or commit:
cargo add --git https://github.com/4ster-light/artscii --branch main artscii-img
cargo add --git https://github.com/4ster-light/artscii --tag v1.1.0 artscii-img
cargo add --git https://github.com/4ster-light/artscii --rev <commit-sha> artscii-img
```

Or, in `Cargo.toml`:

```toml
[dependencies]
artscii-img = { git = "https://github.com/4ster-light/artscii", branch = "main" }
```

Same applies for `artscii-core` if you want to use the shared types and config,
or `artscii-video`.

The CLI crate builds the `artscii` binary.

## Installation

### cargo-binstall

[cargo-binstall](https://github.com/cargo-bins/cargo-binstall) installs a
prebuilt binary from GitHub Releases. The crate is not published to crates.io,
so point binstall at the repository:

```bash
# Install cargo-binstall once (see its README for a prebuilt installer)
cargo install cargo-binstall

# Install ArtSCII
cargo binstall --git https://github.com/4ster-light/artscii artscii-cli
```

> [!WARNING]
> On **macOS and Windows** this downloads the prebuilt binary. On **Linux** the
> release is a self-contained bundle (binary plus ffmpeg/alsa libraries) that
> binstall cannot unpack into place, so it falls back to building from source;
> use the [install script](#install-script) if you want the bundled binary.

### Install script

Linux and macOS, no Rust toolchain required:

```bash
curl -fsSL https://raw.githubusercontent.com/4ster-light/artscii/main/install.sh | sh
```

Windows (PowerShell):

```powershell
irm https://raw.githubusercontent.com/4ster-light/artscii/main/install.ps1 | iex
```

The script installs into `~/.local/bin`
(`%LOCALAPPDATA%\Programs\artscii` on Windows). Override the destination with
`ARTSCII_INSTALL_DIR` (or `$env:ARTSCII_INSTALL_DIR`), and select a specific
release with `ARTSCII_VERSION` (for example `v2.0.0`).

### Prebuilt binaries

Download the asset for your platform from the
[latest release](https://github.com/4ster-light/artscii/releases/latest):

| Platform       | Asset                          |
| -------------- | ------------------------------ |
| Linux x86_64   | `artscii-linux-x86_64.tar.gz`  |
| Linux ARM64    | `artscii-linux-aarch64.tar.gz` |
| macOS x86_64   | `artscii-macos-x86_64`         |
| macOS ARM64    | `artscii-macos-aarch64`        |
| Windows x86_64 | `artscii-windows-x86_64.exe`   |

Each asset ships with a matching `.sha256` checksum, plus an aggregated
`SHA256SUMS` file. After downloading:

```bash
# Linux (tar.gz with bundled libraries)
tar xzf artscii-linux-x86_64.tar.gz
./artscii --help

# macOS / Windows
chmod +x artscii-macos-x86_64
./artscii-macos-x86_64
```

> [!NOTE]
> Linux tarballs bundle required ffmpeg/alsa libraries — no extra packages
> needed at runtime. macOS and Windows include video support natively.

### Nix

Run without installing:

```bash
nix run github:4ster-light/artscii -- image.jpg
```

Install into your profile:

```bash
nix profile add github:4ster-light/artscii
```

The flake also exposes `overlays.default`, `nixosModules.default`, and
`homeManagerModules.default` for declarative installs.

**NixOS:**

```nix
{
  inputs.artscii.url = "github:4ster-light/artscii";

  outputs =
    { nixpkgs, artscii, ... }:
    {
      nixosConfigurations.myhost = nixpkgs.lib.nixosSystem {
        modules = [
          artscii.nixosModules.default
          { programs.artscii.enable = true; }
        ];
      };
    };
}
```

**home-manager:**

```nix
{
  inputs.artscii.url = "github:4ster-light/artscii";

  outputs =
    { home-manager, artscii, ... }:
    {
      homeConfigurations."user@host" = home-manager.lib.homeManagerConfiguration {
        modules = [
          artscii.homeManagerModules.default
          { programs.artscii.enable = true; }
        ];
      };
    };
}
```

Without the modules you can add the package (or the overlay) directly:

```nix
home.packages = [ inputs.artscii.packages.${pkgs.system}.artscii ];

# ...or use the overlay:
# nixpkgs.overlays = [ inputs.artscii.overlays.default ];
# home.packages = [ pkgs.artscii ];
```

### Cargo

Install the CLI from source (the crate builds the `artscii` binary):

```bash
cargo install --locked --git https://github.com/4ster-light/artscii artscii-cli
```

The `video` feature is enabled by default. Pass `--no-default-features` to skip
`ffmpeg`/audio when you only need image conversion:

```bash
cargo install --locked --no-default-features \
  --git https://github.com/4ster-light/artscii artscii-cli
```

## Usage

### Options

| Flag | Long               | Description                         | Default  |
| ---- | ------------------ | ----------------------------------- | -------- |
| `-o` | `--output`         | Output file path                    | stdout   |
| `-f` | `--format`         | Output format (terminal/text/html)  | auto     |
| `-r` | `--resolution`     | Scale factor (0.01-1.0)             | 0.3      |
|      | `--contrast`       | Contrast (0.1-3.0)                  | 1.0      |
| `-b` | `--brightness`     | Brightness (0.1-3.0)                | 1.0      |
| `-i` | `--invert`         | Invert character mapping            | false    |
| `-c` | `--color`          | Enable colored output               | false    |
| `-d` | `--dithering`      | Dithering algorithm                 | none     |
| `-q` | `--quiet`          | Suppress info messages              | false    |
|      | `--video`          | Enable video mode                   | false    |
|      | `--video-format`   | Video output (terminal/gif/mp4)     | terminal |
|      | `--preserve-audio` | Keep original audio in output files | false    |

### Example Commands

```bash
# Basic usage - display in terminal
artscii image.jpg

# With colors
artscii image.jpg -c

# Save as plain text
artscii image.jpg -o output.txt

# Save ANSI-colored text
artscii image.jpg -c -o output.txt

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

# Play video as ASCII animation in terminal
artscii video.mp4 --video

# Play video in terminal with colors
artscii video.mp4 --video -c

# Export video as animated GIF (colored, higher resolution)
artscii video.mp4 --video --video-format gif -c -r 0.5 -o output.gif

# Export video as MP4 (colored, with original audio)
artscii video.mp4 --video --video-format mp4 -c --preserve-audio -o output.mp4
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

## Building from Source

Building from source requires system libraries for video and audio support.

### Dependencies

| Platform | Build dependencies                                                                                        |
| -------- | --------------------------------------------------------------------------------------------------------- |
| Nix      | `nix develop` (all deps included)                                                                         |
| Fedora   | `ffmpeg-devel alsa-lib-devel clang-devel`                                                                 |
| Debian   | `libavcodec-dev libavformat-dev libavutil-dev libavfilter-dev libswscale-dev libasound2-dev libclang-dev` |
| Arch     | `ffmpeg alsa-lib clang`                                                                                   |
| macOS    | `brew install ffmpeg`                                                                                     |

```bash
# CLI binary at ./result/bin/artscii
nix build .#artscii

# Static WASM site at ./result
nix build .#artscii-web

# Dev shell with the pinned Rust toolchain, trunk, ...
nix develop

# fmt + clippy + tests + docs + web checks
nix flake check

# Nix file formatting
nix fmt -- --ci
```

The Rust toolchain is pinned in `rust-toolchain.toml` and shared by the dev
shell, the Nix builds, and CI. CI (`.github/workflows/ci.yml`) runs the same
`nix flake check` plus `nix fmt -- --ci` on every pull request, so the checks
above are exactly what has to pass. If you are already inside `nix develop`, the
usual `cargo` commands work as-is.

Without Nix, install the dependencies listed above, then:

```bash
cargo build --release
```

## License

MIT
