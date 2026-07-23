# artscii-web

Browser-based ASCII art converter — runs the ArtSCII pipeline entirely
client-side via WebAssembly, with no server and no upload.

> This crate builds a static single-page application using
> [Leptos](https://leptos.dev/) (CSR mode) and is intended to be deployed as a
> bundle of static files — e.g. to [Deno Deploy](https://deno.com/deploy).

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

Requires the `wasm32-unknown-unknown` target and [Trunk](https://trunkrs.dev/):

```bash
rustup target add wasm32-unknown-unknown
```

### Dev server

Inside the Nix dev shell:

```bash
nix develop -c trunk serve
```

If no Nix available, install Trunk globally:

```bash
cargo install trunk
cd crates/artscii-web
trunk serve
# → http://localhost:8080
```

### Production build

```bash
cd crates/artscii-web
trunk build --release
```

The static bundle lands in `dist`.

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
