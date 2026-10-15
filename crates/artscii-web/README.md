# artscii-web

Browser-based ASCII art converter — runs the ArtSCII pipeline entirely
client-side via WebAssembly, with no server and no upload.

> This crate builds a static single-page application using
> [Leptos](https://leptos.dev/) (CSR mode) and is intended to be deployed as a
> bundle of static files, in this case to Cloudflare pages.

## Features

- **Pure client-side WASM** — nothing leaves the browser.
- **Drag & drop** or file-picker image upload with live source preview.
- **Real-time controls**: resolution, contrast, brightness, dithering (none /
  Floyd-Steinberg / Atkinson / Riemersma), invert, color.
- **Preview zoom** — font-size scrub from 4px to 16px.
- **Export**: copy plain text to clipboard, download as `.txt` or styled
  `.html`.
- **Terminal aesthetic**: FIGlet logo, `[x]`-style checkboxes, `[ copy ]`
  buttons, responsive layout.

## Development

The Nix dev shell provides the `wasm32-unknown-unknown` target, Trunk, wrangler,
and a `wasm-bindgen-cli` pinned to the workspace's `wasm-bindgen` version:

```bash
nix develop
```

If you are not using Nix, install the target and [Trunk](https://trunkrs.dev/)
manually:

```bash
rustup target add wasm32-unknown-unknown
cargo install trunk
```

### Dev server

Inside the Nix dev shell:

```bash
cd crates/artscii-web
nix develop -c trunk serve # → http://localhost:8080
```

If no Nix available, using trunk:

```bash
cd crates/artscii-web
trunk serve # → http://localhost:8080
```

### Production build

Using the provided Nix flake web output (production static bundle at `./result`):

```bash
nix build .#artscii-web
```

If you don't have Nix (static bundle lands in `dist`):

```bash
cd crates/artscii-web
trunk build --release
```

#### Deploy

In order to deploy to Cloudflare pages (`wrangler` is provided in the flake dev shell):

```bash
cd crates/artscii-web
nix develop -c trunk build --release
nix develop -c wrangler pages deploy
```

The static bundle can be deployed anywhere you wish, just that <https://artscii.pages.dev> is the cloudflare pages deployment used publicly.

## Architecture

The SPA depends on its workspace siblings for functionality:

- **`artscii-core`**: `ConvertConfig`, `DitheringStrategy`, validation.
- **`artscii-img`**: image decode + ASCII conversion. The crate is used with
  `default-features = false` so the `colored` / ANSI dependency is omitted — the
  web renderer produces its own colored HTML directly.

The image is decoded once on upload and stored in an
`RwSignal<Option<DynamicImage>>`. Conversion runs inside a `Memo`, so settings
changes re-run only the conversion, never the decode. The rendered fragment,
plain text, and dimensions are each their own derived `Memo`.

## License

MIT
