# AGENTS.md

Instructions for AI agents working on this project.

## Build Environment

**Always use `nix develop -c` as a prefix for every cargo command.** The Nix
flake provides all system dependencies (ffmpeg, alsa, libclang) needed to build
the project, regardless of the host OS.

```bash
# Correct
nix develop -c cargo check --workspace
nix develop -c cargo build --release
nix develop -c cargo test --workspace

# Wrong — will fail on systems without all deps installed
cargo check --workspace
```

All quality checks should be run as:

```bash
nix develop -c cargo fmt --all --check
nix develop -c cargo check --workspace
nix develop -c cargo test --workspace
nix develop -c cargo clippy --all-targets --workspace -- -D warnings
```
