# Contributing to ✰ArtSCII✰

## Quick Start

```bash
nix develop
```

## Verify Changes

```bash
nix flake check          # fmt + clippy + tests + docs + web checks
nix fmt -- --ci          # Nix file formatting (not part of flake check)
nix build .#artscii      # CLI at ./result/bin/artscii
nix build .#artscii-web  # static site at ./result
```

> [!IMPORTANT]
> `nix <COMMAND>` only sees files that are included in the flake source, so new
> workspace files must be tracked before it can see them.

---

> [!NOTE]
> `nix build`, `nix build .#default` and `nix build .#artscii` all build the CLI;
> only `.#artscii-web` builds the site. Each invocation replaces the `./result`
> symlink, so don't `cd` into it if you intend to rebuild (the shell keeps the
> old store path).

---

> [!WARNING]
> `nix flake check` runs `cargo fmt --check`, `clippy -D warnings`, the workspace
> tests, `cargo doc`, and clippy + the Trunk build for `artscii-web`, all through
> the flake's `checks` outputs. Nix file formatting is checked separately with
> `nix fmt -- --ci`. CI runs the exact same commands, so a green run locally means
> a green CI run. To apply the fmt changes locally just do `nix fmt`

---

The following are also useful for targeted checks:

```bash
nix develop -c cargo check --workspace
nix develop -c cargo test --workspace
nix develop -c cargo fmt --all --check
nix develop -c cargo clippy --all-targets --workspace -- -D warnings
```

## Flake Structure

The flake is a thin [flake-parts](https://flake.parts/) bootstrap; the logic
lives in focused modules under `nix/`:

- `nix/{packages,checks,devshell,formatter}.nix` — per-system outputs
- `nix/crane.nix`, `nix/wasm-bindgen.nix` — shared build helpers
- `nix/modules/{nixos,home-manager,overlay}.nix` — downstream integrations

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
- Prefer the Nix flake for local development and validation. The Rust toolchain
  is pinned in `rust-toolchain.toml` and shared by `nix develop` and CI.
- Mention any extra commands needed to verify your change.

## Need Help?

Open an issue before a larger refactor if you want to discuss the shape first.
