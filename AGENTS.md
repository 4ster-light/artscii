# AGENTS.md

Instructions for AI agents working on this project.

## Build Environment

**Always use `nix develop -c` as a prefix for every cargo or trunk command.** The Nix
flake provides all system dependencies (ffmpeg, alsa, libclang) needed to build
the project.

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

The same checks are exposed as flake outputs, so `nix flake check` runs
formatting, clippy, tests, and docs in one shot. The Rust toolchain is pinned in
`rust-toolchain.toml` and consumed by both `nix develop` and CI.

## Workspace Layout

| Crate           | Type | Description                                           |
| --------------- | ---- | ----------------------------------------------------- |
| `artscii-core`  | lib  | Shared config, errors, dithering strategies           |
| `artscii-img`   | lib  | Image loading and ASCII conversion                    |
| `artscii-video` | lib  | Video decoding and ASCII encoding (needs ffmpeg/alsa) |
| `artscii-cli`   | bin  | CLI binary named `artscii` (not `artscii-cli`)        |
| `artscii-web`   | WASM | Leptos CSR SPA built with Trunk                       |

Rust edition is **2024** across all crates.

## Feature Flags

- `artscii-core` has a `cli` feature (adds `clap`). Enabled transitively by
  `artscii-img/cli`.
- `artscii-img/cli` enables `artscii-core/cli` + the `colored` crate for ANSI
  output.
- `artscii-cli` has a `video` feature (default on) that pulls in
  `artscii-video`.
- `artscii-web` uses `artscii-img` with `default-features = false` to skip the
  `colored`/ANSI dependency.

## Web Crate (artscii-web)

Built with Leptos (CSR mode) and Trunk. The dev shell already includes the
`wasm32-unknown-unknown` target, Trunk, wrangler, and a `wasm-bindgen-cli` pinned to
the version in `Cargo.lock`, so no `rustup target add` is needed.

Dev server:

```bash
nix develop -c trunk serve --open
```

Build the static site:

```bash
nix build .#artscii-web   # output at ./result
```

The web build is isolated from the CLI: `artscii-web` is excluded from the CLI
dependency cache and from the clippy/test/doc checks. There are no WASM tests.

## Flake Outputs

| Output                          | Description                                  |
| ------------------------------- | -------------------------------------------- |
| `packages.artscii` / `default`  | CLI binary                                   |
| `packages.artscii-web`          | Static WASM site                             |
| `apps.default`                  | `nix run` entrypoint for the CLI             |
| `checks.{fmt,clippy,test,doc}`  | Quality gates                                |
| `overlays.default`              | `pkgs.artscii` overlay                       |
| `nixosModules.default`          | `programs.artscii.enable` NixOS module       |
| `homeManagerModules.default`    | `programs.artscii.enable` home-manager module|

The flake is built with [crane](https://github.com/ipetkov/crane) on a pinned
`nixos-26.05` and [rust-overlay](https://github.com/oxalica/rust-overlay).

## Gotchas

- `nix build` only sees **git-tracked** files. New files must be committed (or
  `git add`-ed) before they're visible to the Nix build. This includes new
  flake/nix files and `rust-toolchain.toml`.
- The video crate tests need ffmpeg/alsa at runtime; Nix provides these.
- `cargo test -p <crate>` runs tests for a single crate (useful when working on
  one library).
- CI uses `dtolnay/rust-toolchain@stable`; the Nix dev shell and builds use the
  same pin from `rust-toolchain.toml`.
- Building the workspace (or `artscii-web`) prints a Cargo **future
  incompatibility report** for `proc-macro-error2 v2.0.1`
  (`E0365: extern crate proc_macro is private and cannot be re-exported`). It is
  a transitive Leptos dependency (`rstml -> syn_derive`, plus older
  `leptos_macro`/`reactive_stores_macro`). `proc-macro-error2` 2.0.1 is the
  final release and its upstream repo is archived, so this cannot be fixed by
  updating dependencies. It is compile-time only and does not affect the built
  artifacts; revisit only if a future Rust promotes the lint to a hard error.
