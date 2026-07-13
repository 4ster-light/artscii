# Contributing to ✰ArtSCII✰

## Quick Start

```bash
nix develop
```

## Verify Changes

```bash
nix flake check
nix build
```

> [!NOTE]
> `nix build` only sees files that are included in the flake source, so new
> workspace files must be tracked before it can see them.

If you are already in the dev shell, these are also useful:

```bash
cargo check --workspace
cargo test --workspace
cargo fmt --all --check
cargo clippy --all-targets --workspace -- -D warnings
```

## Workspace Layout

```txt
crates/artscii-core  # shared config, errors, and dithering strategy
crates/artscii-img   # image loading and ASCII conversion
crates/artscii-cli   # binary CLI
crates/artscii-video # video scaffolding
```

## What To Keep In Mind

- Keep changes focused.
- Update docs when behavior or structure changes.
- Prefer the Nix flake for local development and validation.
- Mention any extra commands needed to verify your change.

## Need Help?

Open an issue before a larger refactor if you want to discuss the shape first.
