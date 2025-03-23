import { _ as __nuxt_component_0 } from './nuxt-link.mjs';
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

const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_NuxtLink = __nuxt_component_0;
  _push(`<main${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "flex flex-col items-center justify-center h-[87vh]" }, _attrs))}><h1 class="text-7xl mb-10 font-bold text-transparent bg-clip-text bg-gradient-to-r from-mauve to-blue leading-tight"> ✰ Coming soon ✰ </h1>`);
  _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
    to: "/",
    class: "p-4 font-semibold rounded-lg bg-surface0 hover:bg-surface1 transition-colors duration-150 ease-in-out text-2xl"
  }, {
    default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Back Home →`);
      } else {
        return [
          vueExports.createTextVNode("Back Home →")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</main>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/video.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const video = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { video as default };
//# sourceMappingURL=video.vue.mjs.map
