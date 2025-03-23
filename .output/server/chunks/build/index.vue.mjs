import { p as pinia_prodExports, v as vueExports, s as serverRenderer_cjs_prodExports, _ as _export_sfc } from './server.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'node:stream';

const ASCII_CHARS = " .,:;i1tfLCG08@";
const ASCII_CHARS_INVERTED = "@80GCLft1i;:,. ";
function createCanvas(width, height) {
  const canvas = (void 0).createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}
function getPixelBrightness(r, g, b) {
  return Math.round(0.299 * r + 0.587 * g + 0.114 * b);
}
function adjustPixel(value, contrast, brightness) {
  let adjusted = (value - 128) * contrast + 128;
  adjusted = adjusted * brightness;
  return Math.max(0, Math.min(255, adjusted));
}
const processImage = (imageUrl, resolution = 0.3, contrast = 1, brightness = 1, inverted = false, colored = false, ditheringStrategy = null) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      try {
        const width = Math.floor(img.width * resolution);
        const height = Math.floor(img.height * resolution * 0.5);
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }
        console.log(ditheringStrategy);
        ctx.drawImage(img, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height);
        const pixels = imageData.data;
        const chars = inverted ? ASCII_CHARS_INVERTED : ASCII_CHARS;
        const charCount = chars.length - 1;
        const grayscale = new Array(width * height);
        const colors = colored ? new Array(width * height) : [];
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;
            const [r, g, b] = [0, 1, 2].map(
              (i) => adjustPixel(pixels[idx + i], contrast, brightness)
            );
            const pixelBrightness = getPixelBrightness(r, g, b);
            grayscale[y * width + x] = pixelBrightness;
            if (colored) colors[y * width + x] = [r, g, b];
          }
        }
        if (ditheringStrategy) {
          ditheringStrategy.dithering(grayscale, width, height, charCount);
        }
        let result = "";
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const i = y * width + x;
            const value = grayscale[i];
            const charIndex = Math.min(
              chars.length - 1,
              Math.floor(value / 255 * charCount)
            );
            const char = chars[charIndex];
            if (colored) {
              const [r, g, b] = colors[i];
              result += `<span style="color: rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})">${char}</span>`;
            } else {
              result += char;
            }
          }
          result += colored ? "<br>" : "\n";
        }
        resolve(result);
      } catch (error) {
        reject(error);
      }
    };
    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };
    img.src = imageUrl;
  });
};

class AtkinsonDithering {
  dithering(imageArray, width, height, quantizationLevels) {
    const scale = 255 / (quantizationLevels - 1);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = y * width + x;
        const oldPixel = imageArray[i];
        const newPixel = Math.round(oldPixel / scale) * scale;
        imageArray[i] = newPixel;
        const error = oldPixel - newPixel;
        if (x + 1 < width) imageArray[y * width + (x + 1)] += error * 1 / 8;
        if (x + 2 < width) imageArray[y * width + (x + 2)] += error * 1 / 8;
        if (y + 1 < height && x > 0)
          imageArray[(y + 1) * width + (x - 1)] += error * 1 / 8;
        if (y + 1 < height) imageArray[(y + 1) * width + x] += error * 1 / 8;
        if (y + 1 < height && x + 1 < width)
          imageArray[(y + 1) * width + (x + 1)] += error * 1 / 8;
        if (y + 2 < height) imageArray[(y + 2) * width + x] += error * 1 / 8;
      }
    }
    for (let i = 0; i < imageArray.length; i++) {
      imageArray[i] = Math.max(0, Math.min(255, imageArray[i]));
    }
  }
}

class FloydSteinbergDithering {
  dithering(imageArray, width, height, quantizationLevels) {
    const scale = 255 / (quantizationLevels - 1);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = y * width + x;
        const oldPixel = imageArray[i];
        const newPixel = Math.round(oldPixel / scale) * scale;
        imageArray[i] = newPixel;
        const error = oldPixel - newPixel;
        if (x + 1 < width) imageArray[y * width + (x + 1)] += error * 7 / 16;
        if (y + 1 < height && x > 0)
          imageArray[(y + 1) * width + (x - 1)] += error * 3 / 16;
        if (y + 1 < height) imageArray[(y + 1) * width + x] += error * 5 / 16;
        if (y + 1 < height && x + 1 < width)
          imageArray[(y + 1) * width + (x + 1)] += error * 1 / 16;
      }
    }
    for (let i = 0; i < imageArray.length; i++) {
      imageArray[i] = Math.max(0, Math.min(255, imageArray[i]));
    }
  }
}

class RiemersmaDithering {
  dithering(imageArray, width, height, quantizationLevels) {
    const scale = 255 / (quantizationLevels - 1);
    const visited = new Array(height * width).fill(false);
    let error = 0;
    const spiralDirections = [
      [0, 1],
      // right
      [1, 0],
      // down
      [0, -1],
      // left
      [-1, 0],
      // up
      [1, 1],
      // down-right
      [1, -1],
      // down-left
      [-1, -1],
      // up-left
      [-1, 1]
      // up-right
    ];
    let row = 0;
    let col = 0;
    visited[row * width + col] = true;
    for (let i = 0; i < height * width; i++) {
      const idx = row * width + col;
      const oldPixel = imageArray[idx] + error;
      const newPixel = Math.round(oldPixel / scale) * scale;
      error = oldPixel - newPixel;
      imageArray[idx] = newPixel;
      for (const [dr, dc] of spiralDirections) {
        const newRow = row + dr;
        const newCol = col + dc;
        const newIdx = newRow * width + newCol;
        if (newRow >= 0 && newRow < height && newCol >= 0 && newCol < width && !visited[newIdx]) {
          row = newRow;
          col = newCol;
          visited[newIdx] = true;
          break;
        }
      }
    }
    for (let i = 0; i < imageArray.length; i++) {
      imageArray[i] = Math.max(0, Math.min(255, imageArray[i]));
    }
  }
}

const availableStrategies = [
  { value: "none", label: "No Dithering" },
  { value: "atkinson", label: "Atkinson" },
  { value: "floyd-steinberg", label: "Floyd-Steinberg" },
  { value: "riemersma", label: "Riemersma" }
];
function getDitheringStrategy(name) {
  switch (name) {
    case "atkinson":
      return new AtkinsonDithering();
    case "floyd-steinberg":
      return new FloydSteinbergDithering();
    case "riemersma":
      return new RiemersmaDithering();
    case "none":
      return null;
    default:
      return null;
  }
}

const useAsciiStore = pinia_prodExports.defineStore("ascii", {
  state: () => ({
    imageData: null,
    asciiArt: "",
    coloredAscii: false,
    resolution: 0.3,
    contrast: 1,
    brightness: 1,
    inverted: false,
    isProcessing: false,
    ditheringStrategy: "none"
  }),
  actions: {
    async setImage(dataUrl) {
      this.imageData = dataUrl;
      await this.generateAscii();
    },
    async generateAscii() {
      if (!this.imageData) return;
      this.isProcessing = true;
      try {
        const ditheringStrategy = getDitheringStrategy(this.ditheringStrategy);
        this.asciiArt = await processImage(
          this.imageData,
          this.resolution,
          this.contrast,
          this.brightness,
          this.inverted,
          this.coloredAscii,
          ditheringStrategy
        );
      } catch (error) {
        console.error("Error generating ASCII art:", error);
      } finally {
        this.isProcessing = false;
      }
    }
  }
});

const _sfc_main$3 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "ImageUploader",
  __ssrInlineRender: true,
  setup(__props) {
    const store = useAsciiStore();
    vueExports.ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "card p-5" }, _attrs))}><h2 class="text-xl font-semibold mb-4 text-lavender">Upload Image</h2><div class="border-2 border-dashed border-surface2 rounded-lg p-6 text-center cursor-pointer transition-colors hover:border-mauve"><input type="file" class="hidden" accept="image/*">`);
      if (vueExports.unref(store).imageData) {
        _push(`<div class="space-y-4"><img${serverRenderer_cjs_prodExports.ssrRenderAttr("src", vueExports.unref(store).imageData)} alt="Uploaded content" class="max-h-48 mx-auto object-contain rounded-sm"><p class="text-subtext0">Click or drag to replace</p></div>`);
      } else {
        _push(`<div class="py-8 space-y-2"><div class="text-4xl text-mauve mb-2">@</div><p class="text-subtext0">Click to select or drag an image here</p><p class="text-sm text-overlay0">Supports JPG, PNG, GIF, etc.</p></div>`);
      }
      _push(`</div></div>`);
    };
  }
});

const _sfc_main$2 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "SettingsPanel",
  __ssrInlineRender: true,
  setup(__props) {
    const store = useAsciiStore();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "card p-5" }, _attrs))}><h2 class="text-xl font-semibold mb-4 text-lavender">Settings</h2><div class="space-y-6 md:space-y-5"><div><label class="flex items-center justify-between mb-2" for="resolution"><span class="text-subtext0">Resolution</span><span class="text-sm text-overlay1">${serverRenderer_cjs_prodExports.ssrInterpolate(Math.round(vueExports.unref(store).resolution * 100))}% </span></label><input id="resolution" type="range" min="0.1" max="1" step="0.05"${serverRenderer_cjs_prodExports.ssrRenderAttr("value", vueExports.unref(store).resolution)} class="w-full"${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(vueExports.unref(store).isProcessing) ? " disabled" : ""}><p class="text-xs text-overlay0 mt-1"> Higher values create more detailed ASCII art </p></div><div><label class="flex items-center justify-between mb-2" for="contrast"><span class="text-subtext0">Contrast</span><span class="text-sm text-overlay1">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(store).contrast.toFixed(1))}x </span></label><input id="contrast" type="range" min="0.5" max="2" step="0.1"${serverRenderer_cjs_prodExports.ssrRenderAttr("value", vueExports.unref(store).contrast)} class="w-full"${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(vueExports.unref(store).isProcessing) ? " disabled" : ""}></div><div><label class="flex items-center justify-between mb-2" for="brightness"><span class="text-subtext0">Brightness</span><span class="text-sm text-overlay1">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(store).brightness.toFixed(1))}x </span></label><input id="brightness" type="range" min="0.5" max="2" step="0.1"${serverRenderer_cjs_prodExports.ssrRenderAttr("value", vueExports.unref(store).brightness)} class="w-full"${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(vueExports.unref(store).isProcessing) ? " disabled" : ""}></div><div class="flex items-center space-x-3"><input type="checkbox" id="inverted"${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(Array.isArray(vueExports.unref(store).inverted) ? serverRenderer_cjs_prodExports.ssrLooseContain(vueExports.unref(store).inverted, null) : vueExports.unref(store).inverted) ? " checked" : ""} class="checkbox-input"${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(vueExports.unref(store).isProcessing) ? " disabled" : ""}><label for="inverted" class="text-subtext0"> Invert colors </label></div><div class="flex items-center space-x-3"><input type="checkbox" id="colored"${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(Array.isArray(vueExports.unref(store).coloredAscii) ? serverRenderer_cjs_prodExports.ssrLooseContain(vueExports.unref(store).coloredAscii, null) : vueExports.unref(store).coloredAscii) ? " checked" : ""} class="checkbox-input"${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(vueExports.unref(store).isProcessing) ? " disabled" : ""}><label for="colored" class="text-subtext0"> Colored output </label></div><div><label for="dithering" class="text-subtext0">Dithering </label><select id="dithering" class="select-input"${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(vueExports.unref(store).isProcessing) ? " disabled" : ""}><!--[-->`);
      serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(availableStrategies), (option) => {
        _push(`<option${serverRenderer_cjs_prodExports.ssrRenderAttr("value", option.value)}${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(Array.isArray(vueExports.unref(store).ditheringStrategy) ? serverRenderer_cjs_prodExports.ssrLooseContain(vueExports.unref(store).ditheringStrategy, option.value) : serverRenderer_cjs_prodExports.ssrLooseEqual(vueExports.unref(store).ditheringStrategy, option.value)) ? " selected" : ""}>${serverRenderer_cjs_prodExports.ssrInterpolate(option.label)}</option>`);
      });
      _push(`<!--]--></select><p class="text-xs text-overlay0 mt-1"> Dithering can improve the appearance of the ASCII art by reducing banding. </p></div></div></div>`);
    };
  }
});

const _sfc_main$1 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "AsciiOutput",
  __ssrInlineRender: true,
  setup(__props) {
    const store = useAsciiStore();
    vueExports.ref(null);
    const scale = vueExports.ref(1);
    const isFullscreen = vueExports.ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "card h-full flex flex-col" }, _attrs))}><div class="p-5 border-b border-surface0 flex flex-wrap items-center justify-between gap-2"><h2 class="text-xl font-semibold text-lavender">ASCII Output</h2><div class="flex items-center space-x-2"><input type="range" min="0.5" max="2" step="0.1"${serverRenderer_cjs_prodExports.ssrRenderAttr("value", vueExports.unref(scale))} class="w-24" title="Adjust size"${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(!vueExports.unref(store).asciiArt || vueExports.unref(store).isProcessing) ? " disabled" : ""}><button type="button" class="btn"${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(!vueExports.unref(store).asciiArt || vueExports.unref(store).isProcessing) ? " disabled" : ""}${serverRenderer_cjs_prodExports.ssrRenderAttr("title", vueExports.unref(isFullscreen) ? "Exit fullscreen" : "Fullscreen")}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(isFullscreen) ? "Exit" : "Fullscreen")}</button><button type="button" class="btn"${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(!vueExports.unref(store).asciiArt || vueExports.unref(store).isProcessing) ? " disabled" : ""} title="Download as PNG"> PNG </button><button type="button" class="btn"${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(!vueExports.unref(store).asciiArt || vueExports.unref(store).isProcessing) ? " disabled" : ""} title="Download as Text"> TXT </button></div></div><div class="grow p-4 overflow-auto relative">`);
      if (vueExports.unref(store).isProcessing) {
        _push(`<div class="absolute inset-0 bg-base/80 flex items-center justify-center z-10 transition-all duration-300 ease-in-out"><div class="text-mauve text-lg">Processing...</div></div>`);
      } else {
        _push(`<!--[-->`);
        if (vueExports.unref(store).asciiArt) {
          _push(`<div class="ascii-container"><div class="ascii-output transition-all duration-300 ease-in-out" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({
            transform: `scale(${vueExports.unref(scale)})`,
            transformOrigin: "0 0",
            color: vueExports.unref(store).coloredAscii ? void 0 : "var(--text)",
            opacity: vueExports.unref(store).isProcessing ? "0.5" : "1"
          })}">${vueExports.unref(store).asciiArt ?? ""}</div></div>`);
        } else {
          _push(`<div class="h-full flex flex-col items-center justify-center text-center p-6"><div class="text-4xl text-mauve mb-4">@</div><p class="text-subtext0 mb-2">Upload an image to generate the ASCII</p><p class="text-sm text-overlay0">Adjust the settings to customize the output</p></div>`);
        }
        _push(`<!--]-->`);
      }
      _push(`</div></div>`);
    };
  }
});

const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_ImageUploader = _sfc_main$3;
  const _component_SettingsPanel = _sfc_main$2;
  const _component_AsciiOutput = _sfc_main$1;
  _push(`<main${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "grow p-4 md:p-6 max-w-7xl mx-auto w-full" }, _attrs))}><div class="grid grid-cols-1 lg:grid-cols-12 gap-6"><div class="lg:col-span-4 space-y-6">`);
  _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_ImageUploader, null, null, _parent));
  _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_SettingsPanel, null, null, _parent));
  _push(`</div><div class="lg:col-span-8">`);
  _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_AsciiOutput, null, null, _parent));
  _push(`</div></div></main>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { index as default };
//# sourceMappingURL=index.vue.mjs.map
