import { _ as __nuxt_component_0$1 } from './nuxt-link.mjs';
import { _ as _export_sfc, s as serverRenderer_cjs_prodExports, v as vueExports } from './server.mjs';
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

const _imports_0 = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='currentColor'%3e%3cpath%20d='M18.244%202.25h3.308l-7.227%208.26%208.502%2011.24H16.17l-5.214-6.817L4.99%2021.75H1.68l7.73-8.835L1.254%202.25H8.08l4.713%206.231zm-1.161%2017.52h1.833L7.084%204.126H5.117z'%20/%3e%3c/svg%3e";

const _imports_1 = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='currentColor'%3e%3cpath%20d='M12%200C5.374%200%200%205.373%200%2012c0%205.302%203.438%209.8%208.207%2011.387.6.113.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729%201.205.084%201.839%201.237%201.839%201.237%201.07%201.834%202.807%201.304%203.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931%200-1.311.469-2.381%201.236-3.221-.124-.303-.535-1.524.117-3.176%200%200%201.008-.322%203.301%201.23A11.509%2011.509%200%200112%205.803c1.02.005%202.047.138%203.006.404%202.291-1.552%203.297-1.23%203.297-1.23.653%201.653.242%202.874.118%203.176.77.84%201.235%201.911%201.235%203.221%200%204.609-2.807%205.624-5.479%205.921.43.372.823%201.102.823%202.222v3.293c0%20.319.192.694.801.576C20.566%2021.797%2024%2017.3%2024%2012c0-6.627-5.373-12-12-12z'/%3e%3c/svg%3e";

const _sfc_main$2 = {};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs) {
  const _component_NuxtLink = __nuxt_component_0$1;
  _push(`<header${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "bg-mantle border-b border-surface0 py-4 px-6" }, _attrs))}><div class="max-w-7xl mx-auto flex items-center justify-between"><div class="flex items-center"><h1 class="text-2xl font-bold bg-gradient-to-r from-mauve to-blue bg-clip-text text-transparent cursor-pointer"> ✰ArtSCII✰ </h1></div><div class="flex items-center gap-2">`);
  _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
    to: "/video",
    class: "p-2 font-semibold rounded-lg bg-surface0 hover:bg-surface1 transition-colors"
  }, {
    default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Video `);
      } else {
        return [
          vueExports.createTextVNode("Video ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`<span class="text-subtext0 font-black text-2xl">|</span><a href="https://x.com/4ster_light" target="_blank" rel="noopener noreferrer" class="p-2 rounded-lg bg-surface0 hover:bg-surface1 transition-colors" aria-label="Twitter"><img${serverRenderer_cjs_prodExports.ssrRenderAttr("src", _imports_0)} alt="Twitter" class="w-6 h-6 invert-[75%] sepia-[12%] saturate-[500%] hue-rotate-220 brightness-110 contrast-90"></a><a href="https://github.com/4ster-light/artscii" target="_blank" rel="noopener noreferrer" class="p-2 rounded-lg bg-surface0 hover:bg-surface1 transition-colors" aria-label="GitHub"><img${serverRenderer_cjs_prodExports.ssrRenderAttr("src", _imports_1)} alt="GitHub" class="w-6 h-6 invert-[75%] sepia-[12%] saturate-[500%] hue-rotate-220 brightness-110 contrast-90"></a></div></div></header>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Header.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$2]]);

const _sfc_main$1 = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
  _push(`<footer${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "bg-mantle border-t border-surface0 py-3 px-6 text-center text-subtext0 text-sm" }, _attrs))}><p> Built with Vue and Catppuccin Mocha by <span class="text-mauve">✰λster✰</span>, aka David Vivar ${serverRenderer_cjs_prodExports.ssrInterpolate(`• ${(/* @__PURE__ */ new Date()).getFullYear()}`)}</p></footer>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Footer.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1]]);

const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_Header = __nuxt_component_0;
  const _component_Footer = __nuxt_component_1;
  _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "min-h-screen flex flex-col" }, _attrs))}>`);
  _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Header, null, null, _parent));
  serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Footer, null, null, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _default = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { _default as default };
//# sourceMappingURL=default.vue.mjs.map
