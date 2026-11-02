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
formatting, clippy, tests, docs, and the web checks in one shot. The Rust
toolchain is pinned in `rust-toolchain.toml` and consumed by both `nix develop`
and CI, so a green local `nix flake check` means a green CI run for the same
commit. Nix file formatting is the one exception: run `nix fmt -- --ci`
locally, which is what CI does instead of a flake check (treefmt fans out across
cores, which is unpleasant on a laptop).

## Workspace Layout

| Crate           | Type | Description                                           |
| --------------- | ---- | ----------------------------------------------------- |
| `artscii-core`  | lib  | Shared config, errors, dithering strategies           |
| `artscii-img`   | lib  | Image loading and ASCII conversion                    |
| `artscii-video` | lib  | Video decoding and ASCII encoding (needs ffmpeg/alsa) |
| `artscii-cli`   | bin  | CLI binary named `artscii` (not `artscii-cli`)        |
| `artscii-web`   | WASM | Leptos CSR SPA built with Trunk                       |

Rust edition is **2024** across all crates. Version, edition, `rust-version`,
authors, license, and repository are single-sourced from `[workspace.package]`
in the root `Cargo.toml`; crates inherit them with `version.workspace = true`
and friends, so a release bump only edits the root manifest. `rust-version` is
**1.88** (the `artscii-video` code uses `Option::as_chunks`, and Leptos needs
the same). `nix/crane.nix` reads those fields straight from the
`[workspace.package]` table with `lib.importTOML`, so the flake never needs a
version bump either.

## Packaging

| Path                                   | What it is                                  |
| -------------------------------------- | ------------------------------------------- |
| `Makefile` (`srpm` target)             | Entry point COPR uses for SCM builds        |
| `packaging/fedora/artscii.spec`        | Fedora/COPR spec (COPR project `4ster-light/artscii`) |
| `packaging/fedora/Makefile`            | Fetches `Source0`, builds the SRPM          |
| `packaging/container/Containerfile`    | Alpine image with full ffmpeg, pushed to GHCR on tags |

The spec builds from source with `--locked` (no vendoring, no bundling), so the
COPR project must keep **"enable internet access during builds"** on: the
crates.io fetch happens during the build. Rebuild the SRPM locally with
`make -C packaging/fedora srpm`, then `copr-cli build 4ster-light/artscii <srpm>`
or `rpmbuild --rebuild` it in a `fedora:44`/`fedora:45` container. The COPR
project is `4ster-light/artscii` (fedora-44/45/rawhide, x86_64 and aarch64).
Those releases, plus Arch, build and run against their stock ffmpeg (MP4 export
works via `libopenh264` on Fedora and `libx264` on Arch).

## Feature Flags

- `artscii-core` has a `cli` feature (adds `clap`). Enabled transitively by
  `artscii-img/cli`.
- `artscii-img/cli` enables `artscii-core/cli` + the `colored` crate for ANSI
  output.
- `artscii-cli` has `video` (decoding, GIF/MP4 export, MP4 audio passthrough)
  and `audio` (terminal playback via cpal, implies `video`) features, both on by
  default. `--no-default-features --features video` builds without cpal/ALSA.
- `artscii-video` exposes the same `audio` feature and depends on `ffmpeg-next`
  with only `codec`, `format`, `software-scaling` and `software-resampling`, so
  libavdevice/libavfilter (and with them ALSA) are never linked.
- `artscii-web` uses `artscii-img` with `default-features = false` to skip the
  `colored`/ANSI dependency.

## Web Crate (artscii-web)

Built with Leptos (CSR mode) and Trunk. The dev shell already includes the
`wasm32-unknown-unknown` target, Trunk, wrangler, and `wasm-bindgen-cli` from
nixpkgs' versioned `wasm-bindgen-cli_0_2_126` attribute (matching the
`wasm-bindgen` version pinned in the web manifest), so no `rustup target add`
is needed.

Dev server:

```bash
nix develop -c trunk serve --open
```

Build the static site:

```bash
nix build .#artscii-web   # output at ./result
```

The web build is isolated from the CLI: `artscii-web` is excluded from the CLI
dependency cache and from the clippy/test/doc checks. It is covered separately
by `checks.web-clippy` (clippy on the wasm target) and `checks.web-build` (the
Trunk build). There are no WASM tests.

## Flake Outputs

| Output                          | Description                                  |
| ------------------------------- | -------------------------------------------- |
| `packages.artscii` / `default`  | CLI binary                                   |
| `packages.artscii-web`          | Static WASM site                             |
| `apps.default`                  | `nix run` entrypoint for the CLI             |
| `checks.*`                      | Quality gates (see below)                    |
| `overlays.default`              | `pkgs.artscii` overlay                       |
| `nixosModules.default`          | `programs.artscii.enable` NixOS module       |
| `homeManagerModules.default`    | `programs.artscii.enable` home-manager module|

The flake is built with [crane](https://github.com/ipetkov/crane) on a pinned
`nixos-26.05` and [rust-overlay](https://github.com/oxalica/rust-overlay).

The `checks` output is what CI runs:

| Check        | What it does                                                 |
| ------------ | ------------------------------------------------------------ |
| `artscii`    | Builds the CLI (`--features video`), same as a release build |
| `fmt`        | `cargo fmt --all -- --check` over the workspace               |
| `clippy`     | `clippy --all-targets -D warnings` (workspace, minus web)     |
| `test`       | `cargo test` (workspace, minus web)                          |
| `doc`        | `cargo doc` with `RUSTDOCFLAGS=--deny warnings`              |
| `web-clippy` | `clippy --all-targets -D warnings` for `artscii-web` (wasm)  |
| `web-build`  | Trunk build of `artscii-web`                                 |

## Continuous Integration

`.github/workflows/ci.yml` runs on pushes to `main`, every pull request, and
manual dispatch. It is a single `ubuntu-latest` job that installs Nix, restores
the Nix store from the GitHub Actions cache, runs `nix flake check
--keep-going`, and then checks Nix formatting with `nix fmt -- --ci`. The flake
check executes exactly the same derivations as `nix flake check` locally.

Why one job instead of one job per check:

- All Rust checks share the `cargoArtifacts` dependency build, so splitting them
  into parallel jobs would compile the workspace once per job.
- `--keep-going` still reports every failing check by name in one run.

`.github/workflows/release.yml` is separate and only runs on `v*` tags; it builds
the CLI natively on Linux/macOS/Windows with `cargo` (not Nix) to produce the
release archives. Linux publishes two assets per architecture: a standalone
binary (`artscii-linux-*`) and `artscii-linux-*.tar.gz`, a self-contained bundle
with the libraries and an `$ORIGIN` rpath that `install.sh` consumes. The
standalone binary is built on Ubuntu 24.04, so it is hard-linked to that
distro's ffmpeg 6 sonames and is *not* wired into `cargo binstall` on Linux;
the bundle is the portable artifact. The `[workspace.package]` version and the
pushed tag must match, and nothing in CI enforces that yet.

## Flake Layout

The flake is assembled with [flake-parts](https://flake.parts/), so every
output lives in a small, single-purpose flake module under `nix/`. The build
side:

| Path                        | Contributes                                          |
| --------------------------- | ---------------------------------------------------- |
| `nix/utils/packages.nix`    | `packages.*` and `apps.*`                            |
| `nix/utils/checks.nix`      | `checks.*` (quality gates)                           |
| `nix/utils/devshell.nix`    | `devShells.default`                                  |
| `nix/utils/formatter.nix`   | `formatter`                                          |
| `nix/crane.nix`             | Shared Crane build context used by the outputs above |

The downstream integration surfaces are grouped in `nix/modules/` (each file
is still a flake-parts module; `overlay.nix` is a Nixpkgs overlay rather than
a NixOS module):

| Path                           | Contributes                          |
| ------------------------------ | ------------------------------------ |
| `nix/modules/nixos.nix`        | `nixosModules.default`               |
| `nix/modules/home-manager.nix` | `homeManagerModules.default`         |
| `nix/modules/overlay.nix`      | `overlays.default` (Nixpkgs overlay) |

`flake.nix` only wires the inputs, the supported `systems`, the
rust-overlay-applied `pkgs`, and the modules above.

## Gotchas

- The container image is built on **Alpine 3.24** and uses `apk`'s dynamically
  linked `rust`/`cargo`, not `rust:alpine`: the rustup toolchain in that image
  is static-musl, and bindgen cannot `dlopen` libclang from a static binary
  ("Dynamic loading not supported"). `LIBCLANG_PATH` must point at
  `/usr/lib/llvm22/lib`, which bindgen does not search on Alpine.
- `nix build` only sees **git-tracked** files. New files must be committed (or
  `git add`-ed) before they're visible to the Nix build. This includes new
  flake/nix files and `rust-toolchain.toml`.
- The video crate tests need ffmpeg/alsa at runtime; Nix provides these.
- `cargo test -p <crate>` runs tests for a single crate (useful when working on
  one library).
- `ci.yml` runs everything through `nix flake check`, so it uses the exact
  toolchain pinned in `rust-toolchain.toml`. The release workflow is the
  exception: it uses `dtolnay/rust-toolchain@stable` so the published binaries
  track current stable, which can differ from the Nix pin.
- Building the workspace (or `artscii-web`) prints a Cargo **future
  incompatibility report** for `proc-macro-error2 v2.0.1`
  (`E0365: extern crate proc_macro is private and cannot be re-exported`). It is
  a transitive Leptos dependency (`rstml -> syn_derive`, plus older
  `leptos_macro`/`reactive_stores_macro`). `proc-macro-error2` 2.0.1 is the
  final release and its upstream repo is archived, so this cannot be fixed by
  updating dependencies. It is compile-time only and does not affect the built
  artifacts; revisit only if a future Rust promotes the lint to a hard error.
