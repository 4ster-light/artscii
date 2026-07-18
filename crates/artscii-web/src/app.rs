use artscii_core::{ConvertConfig, DitheringStrategy};
use artscii_img::{AsciiResult, convert_image};
use leptos::prelude::*;
use wasm_bindgen::JsCast;
use wasm_bindgen_futures::{JsFuture, spawn_local};
use web_sys::{DragEvent, Event, File};

const LOGO: &str = r"   _  ___ _____ ___  ___ ___ ___
  /_\ | _ \_   _/ __|/ __|_ _|_ _|
 / _ \|   / | | \__ \ (__ | | | |
/_/ \_\_|_\ |_| |___/\___|___|___|";

/// Read an uploaded file, decode it, and store the resulting image.
///
/// Uses the `Blob.arrayBuffer()` promise API (the previous implementation
/// used `FileReader.result()` which yields an `ArrayBuffer`, not a
/// `Uint8Array`, so the `dyn_ref` cast silently failed and nothing worked).
fn read_file(
    file: File,
    image: RwSignal<Option<image::DynamicImage>>,
    file_name: RwSignal<Option<String>>,
    thumb_url: RwSignal<Option<String>>,
    error: RwSignal<Option<String>>,
) {
    if !file.type_().starts_with("image/") {
        error.set(Some("unsupported file type — please drop an image".into()));
        return;
    }

    error.set(None);
    file_name.set(Some(file.name()));

    // Thumbnail preview via object URL (revoke the previous one to avoid leaks).
    if let Some(old) = thumb_url.get_untracked() {
        let _ = web_sys::Url::revoke_object_url(&old);
    }
    if let Ok(url) = web_sys::Url::create_object_url_with_blob(&file) {
        thumb_url.set(Some(url));
    }

    spawn_local(async move {
        match JsFuture::from(file.array_buffer()).await {
            Ok(buf) => {
                let bytes = js_sys::Uint8Array::new(&buf).to_vec();
                match image::load_from_memory(&bytes) {
                    Ok(img) => image.set(Some(img)),
                    Err(_) => error.set(Some("couldn't decode that image".into())),
                }
            }
            Err(_) => error.set(Some("couldn't read that file".into())),
        }
    });
}

/// Render the ASCII grid to an HTML fragment.
///
/// The character ramps (` .,:;i1tfLCG08@`) contain no HTML-special
/// characters, so plain mode can be emitted raw.
fn render_fragment(result: &AsciiResult) -> String {
    let mut out = String::with_capacity(result.width * result.height * 4);

    if result.colored {
        for y in 0..result.height {
            for x in 0..result.width {
                let i = y * result.width + x;
                let rgb = result.colors[i];
                out.push_str(&format!(
                    "<span style=\"color:rgb({},{},{})\">{}</span>",
                    rgb[0], rgb[1], rgb[2], result.chars[i]
                ));
            }
            out.push_str("<br>");
        }
    } else {
        for y in 0..result.height {
            for x in 0..result.width {
                out.push(result.chars[y * result.width + x]);
            }
            out.push('\n');
        }
    }

    out
}

/// Trigger a browser download for the given text content.
fn download_file(name: &str, mime: &str, content: &str) {
    let parts = js_sys::Array::new();
    parts.push(&wasm_bindgen::JsValue::from_str(content));

    let bag = web_sys::BlobPropertyBag::new();
    bag.set_type(mime);
    let Ok(blob) = web_sys::Blob::new_with_str_sequence_and_options(&parts, &bag) else {
        return;
    };
    let Ok(url) = web_sys::Url::create_object_url_with_blob(&blob) else {
        return;
    };
    let Some(window) = web_sys::window() else {
        return;
    };
    let Some(document) = window.document() else {
        return;
    };
    let Ok(a) = document.create_element("a") else {
        return;
    };

    let _ = a.set_attribute("href", &url);
    let _ = a.set_attribute("download", name);
    if let Ok(elem) = a.dyn_into::<web_sys::HtmlElement>() {
        elem.click();
    }
    let _ = web_sys::Url::revoke_object_url(&url);
}

#[component]
pub fn App() -> impl IntoView {
    // ── State ────────────────────────────────────────────────────────────
    let image: RwSignal<Option<image::DynamicImage>> = RwSignal::new(None);
    let file_name: RwSignal<Option<String>> = RwSignal::new(None);
    let thumb_url: RwSignal<Option<String>> = RwSignal::new(None);
    let error: RwSignal<Option<String>> = RwSignal::new(None);
    let is_dragging = RwSignal::new(false);
    let copied = RwSignal::new(false);
    let font_size = RwSignal::new(8_u32);

    // Conversion settings
    let resolution = RwSignal::new(0.3_f64);
    let contrast = RwSignal::new(1.0_f64);
    let brightness = RwSignal::new(1.0_f64);
    let inverted = RwSignal::new(false);
    let colored = RwSignal::new(false);
    let dithering = RwSignal::new(DitheringStrategy::None);

    // ── Derived values ───────────────────────────────────────────────────
    // The image is decoded once on upload; the conversion re-runs only when
    // the image or any setting changes.
    let result = Memo::new(move |_| {
        image.with(|img| {
            let img = img.as_ref()?;
            let config = ConvertConfig {
                resolution: resolution.get() as f32,
                contrast: contrast.get() as f32,
                brightness: brightness.get() as f32,
                inverted: inverted.get(),
                colored: colored.get(),
                dithering: dithering.get(),
            };
            convert_image(img, &config).ok()
        })
    });

    let html_output = Memo::new(move |_| result.with(|r| r.as_ref().map(render_fragment)));
    let plain_text = Memo::new(move |_| result.with(|r| r.as_ref().map(|a| a.to_plain_text())));
    let dims = Memo::new(move |_| result.with(|r| r.as_ref().map(|a| (a.width, a.height))));

    // ── File handling ────────────────────────────────────────────────────
    let on_file_change = move |ev: Event| {
        let input = event_target::<web_sys::HtmlInputElement>(&ev);
        if let Some(file) = input.files().and_then(|f| f.get(0)) {
            read_file(file, image, file_name, thumb_url, error);
        }
        // Allow re-selecting the same file.
        input.set_value("");
    };

    let on_drag_over = move |ev: DragEvent| {
        ev.prevent_default();
        is_dragging.set(true);
    };

    let on_drag_leave = move |_: DragEvent| {
        is_dragging.set(false);
    };

    let on_drop = move |ev: DragEvent| {
        ev.prevent_default();
        is_dragging.set(false);
        if let Some(file) = ev
            .data_transfer()
            .and_then(|dt| dt.files())
            .and_then(|f| f.get(0))
        {
            read_file(file, image, file_name, thumb_url, error);
        }
    };

    // ── Actions ──────────────────────────────────────────────────────────
    let copy = move |_| {
        let Some(text) = plain_text.get_untracked() else {
            return;
        };
        spawn_local(async move {
            if let Some(window) = web_sys::window() {
                let _ = JsFuture::from(window.navigator().clipboard().write_text(&text)).await;
                copied.set(true);
                let cb = wasm_bindgen::closure::Closure::once(move || copied.set(false));
                let _ = window.set_timeout_with_callback_and_timeout_and_arguments_0(
                    cb.as_ref().unchecked_ref(),
                    1500,
                );
                cb.forget();
            }
        });
    };

    let save_txt = move |_| {
        if let Some(text) = plain_text.get_untracked() {
            download_file("ascii-art.txt", "text/plain", &text);
        }
    };

    let save_html = move |_| {
        if let Some(html) = result.with(|r| r.as_ref().map(|a| a.to_html())) {
            download_file("ascii-art.html", "text/html", &html);
        }
    };

    let zoom_out = move |_| font_size.update(|v| *v = v.saturating_sub(1).max(4));
    let zoom_in = move |_| font_size.update(|v| *v = (*v + 1).min(16));

    // ── View ─────────────────────────────────────────────────────────────
    view! {
        <div class="app">
            <header class="topbar">
                <pre class="logo" aria-hidden="true">{LOGO}</pre>
                <div class="tagline">
                    <span>"image → ascii"</span>
                    <span class="dim">" · in-browser wasm · "</span>
                    <a
                        href="https://github.com/4ster-light/artscii"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        "[src]"
                    </a>
                </div>
            </header>

            // ── Landing: no image yet ────────────────────────────────────
            <Show when=move || image.with(|i| i.is_none())>
                <section class="hero">
                    <div
                        class=move || {
                            if is_dragging.get() { "drop dragging" } else { "drop" }
                        }
                        on:dragover=on_drag_over
                        on:dragleave=on_drag_leave
                        on:drop=on_drop
                    >
                        <input
                            type="file"
                            id="file-hero"
                            accept="image/*"
                            class="visually-hidden"
                            on:change=on_file_change
                        />
                        <label r#for="file-hero" class="drop-inner">
                            <span class="plus" aria-hidden="true">"+"</span>
                            <span class="drop-title">"drop an image"</span>
                            <span class="drop-sub">
                                "or click to browse — png · jpeg · gif · webp · bmp"
                            </span>
                        </label>
                    </div>
                    <p class="hint">"everything runs locally in your browser — nothing is uploaded"</p>
                </section>
            </Show>

            // ── Workspace: image loaded ──────────────────────────────────
            <Show when=move || image.with(|i| i.is_some())>
                <main class="workspace">
                    <aside class="side">
                        <div class="filebar">
                            <img
                                class="thumb"
                                src=move || thumb_url.get().unwrap_or_default()
                                alt="uploaded source image"
                            />
                            <div class="filemeta">
                                <span class="filename">{move || file_name.get().unwrap_or_default()}</span>
                                <label r#for="file-side" class="change">"[ change ]"</label>
                                <input
                                    type="file"
                                    id="file-side"
                                    accept="image/*"
                                    class="visually-hidden"
                                    on:change=on_file_change
                                />
                            </div>
                        </div>

                        <div class="group">
                            <span class="group-title">"// adjust"</span>

                            <div class="row">
                                <div class="row-head">
                                    <label r#for="res">"resolution"</label>
                                    <span class="val">{move || format!("{:.2}", resolution.get())}</span>
                                </div>
                                <input
                                    id="res"
                                    type="range"
                                    min="0.05"
                                    max="1.0"
                                    step="0.01"
                                    prop:value=move || resolution.get()
                                    on:input=move |ev| {
                                        if let Ok(v) = event_target_value(&ev).parse::<f64>() {
                                            resolution.set(v);
                                        }
                                    }
                                />
                            </div>

                            <div class="row">
                                <div class="row-head">
                                    <label r#for="con">"contrast"</label>
                                    <span class="val">{move || format!("{:.1}", contrast.get())}</span>
                                </div>
                                <input
                                    id="con"
                                    type="range"
                                    min="0.1"
                                    max="3.0"
                                    step="0.1"
                                    prop:value=move || contrast.get()
                                    on:input=move |ev| {
                                        if let Ok(v) = event_target_value(&ev).parse::<f64>() {
                                            contrast.set(v);
                                        }
                                    }
                                />
                            </div>

                            <div class="row">
                                <div class="row-head">
                                    <label r#for="bri">"brightness"</label>
                                    <span class="val">{move || format!("{:.1}", brightness.get())}</span>
                                </div>
                                <input
                                    id="bri"
                                    type="range"
                                    min="0.1"
                                    max="3.0"
                                    step="0.1"
                                    prop:value=move || brightness.get()
                                    on:input=move |ev| {
                                        if let Ok(v) = event_target_value(&ev).parse::<f64>() {
                                            brightness.set(v);
                                        }
                                    }
                                />
                            </div>

                            <div class="row">
                                <div class="row-head">
                                    <label r#for="dither">"dithering"</label>
                                </div>
                                <div class="select-wrap">
                                    <select
                                        id="dither"
                                        prop:value=move || {
                                            match dithering.get() {
                                                DitheringStrategy::None => "none",
                                                DitheringStrategy::FloydSteinberg => "floyd",
                                                DitheringStrategy::Atkinson => "atkinson",
                                                DitheringStrategy::Riemersma => "riemersma",
                                            }
                                        }
                                        on:change=move |ev| {
                                            let v = event_target_value(&ev);
                                            dithering.set(match v.as_str() {
                                                "floyd" => DitheringStrategy::FloydSteinberg,
                                                "atkinson" => DitheringStrategy::Atkinson,
                                                "riemersma" => DitheringStrategy::Riemersma,
                                                _ => DitheringStrategy::None,
                                            });
                                        }
                                    >
                                        <option value="none">"none"</option>
                                        <option value="floyd">"floyd-steinberg"</option>
                                        <option value="atkinson">"atkinson"</option>
                                        <option value="riemersma">"riemersma"</option>
                                    </select>
                                </div>
                            </div>

                            <div class="checks">
                                <label class="check">
                                    <input
                                        type="checkbox"
                                        prop:checked=move || inverted.get()
                                        on:change=move |ev| inverted.set(event_target_checked(&ev))
                                    />
                                    <span class="box" aria-hidden="true"></span>
                                    <span>"invert"</span>
                                </label>
                                <label class="check">
                                    <input
                                        type="checkbox"
                                        prop:checked=move || colored.get()
                                        on:change=move |ev| colored.set(event_target_checked(&ev))
                                    />
                                    <span class="box" aria-hidden="true"></span>
                                    <span>"color"</span>
                                </label>
                            </div>
                        </div>

                        <div class="side-foot">
                            <span class="dims">
                                {move || {
                                    dims.get()
                                        .map(|(w, h)| format!("{w}×{h} chars"))
                                        .unwrap_or_default()
                                }}
                            </span>
                            <div class="actions">
                                <button class="btn" on:click=copy>
                                    {move || if copied.get() { "copied" } else { "copy" }}
                                </button>
                                <button class="btn" on:click=save_txt>"save .txt"</button>
                                <button class="btn" on:click=save_html>"save .html"</button>
                            </div>
                        </div>
                    </aside>

                    <section class="preview">
                        <div class="preview-bar">
                            <span class="dim">"preview"</span>
                            <span class="zoom">
                                <button on:click=zoom_out aria-label="decrease font size">"−"</button>
                                <span class="zoom-val">{move || format!("{}px", font_size.get())}</span>
                                <button on:click=zoom_in aria-label="increase font size">"+"</button>
                            </span>
                        </div>
                        <div class="output-wrap">
                            <pre
                                class="output"
                                style:font-size=move || format!("{}px", font_size.get())
                                inner_html=move || html_output.get().unwrap_or_default()
                            ></pre>
                        </div>
                    </section>
                </main>
            </Show>

            <Show when=move || error.with(|e| e.is_some())>
                <div class="toast" role="alert">
                    {move || error.get().unwrap_or_default()}
                </div>
            </Show>

            <footer class="foot">"artscii v2 · rust × wasm · mit"</footer>
        </div>
    }
}
