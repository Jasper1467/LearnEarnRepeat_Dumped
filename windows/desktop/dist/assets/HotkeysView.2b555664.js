import { _ as _export_sfc, j as hkOk, l as hkCancel, m as hkA1, p as hkA2, q as hkA3, s as hkA4, H as kMetrics, o as openBlock, c as createElementBlock, a as createBaseVNode, h as createVNode, v as resolveComponent } from "./index.45e9362d.js";
import { P as PartialOnboardingStepHotkeys } from "./PartialOnboardingStepHotkeys.71b87697.js";
const HotkeysView_vue_vue_type_style_index_0_scoped_76518f80_lang = "";
const _sfc_main = {
  components: { PartialOnboardingStepHotkeys },
  computed: {
    hotkeys() {
      return [
        {
          name: "Start trivia",
          id: hkOk
        },
        {
          name: "Skip trivia",
          id: hkCancel
        },
        {
          name: "Choose answer 1",
          id: hkA1
        },
        {
          name: "Choose answer 2",
          id: hkA2
        },
        {
          name: "Choose answer 3",
          id: hkA3
        },
        {
          name: "Choose answer 4",
          id: hkA4
        }
      ];
    }
  },
  mounted() {
    window.main.trackEvent(kMetrics.HotkeysEditor_ViewOpened, {});
  }
};
const _hoisted_1 = { class: "wrap" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_PartialOnboardingStepHotkeys = resolveComponent("PartialOnboardingStepHotkeys");
  return openBlock(), createElementBlock("div", _hoisted_1, [
    createBaseVNode("div", null, [
      createVNode(_component_PartialOnboardingStepHotkeys, {
        hotkeys: $options.hotkeys,
        "layout-size": "large"
      }, null, 8, ["hotkeys"])
    ])
  ]);
}
const HotkeysView = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-76518f80"]]);
export {
  HotkeysView as default
};
