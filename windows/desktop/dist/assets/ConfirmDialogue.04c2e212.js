import { _ as _export_sfc, o as openBlock, i as createBlock, w as withCtx, c as createElementBlock, a as createBaseVNode, r as renderSlot, b as createCommentVNode, T as Transition, v as resolveComponent, t as toDisplayString } from "./index.45e9362d.js";
const PopupModal_vue_vue_type_style_index_0_scoped_35505ae6_lang = "";
const _sfc_main$1 = {
  name: "PopupModal",
  data: () => ({
    isVisible: false
  }),
  methods: {
    open() {
      this.isVisible = true;
    },
    close() {
      this.isVisible = false;
    }
  }
};
const _hoisted_1$1 = {
  key: 0,
  class: "popup-modal"
};
const _hoisted_2$1 = { class: "window" };
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock(Transition, { name: "fade" }, {
    default: withCtx(() => [
      _ctx.isVisible ? (openBlock(), createElementBlock("div", _hoisted_1$1, [
        createBaseVNode("div", _hoisted_2$1, [
          renderSlot(_ctx.$slots, "default", {}, void 0, true)
        ])
      ])) : createCommentVNode("", true)
    ]),
    _: 3
  });
}
const PopupModal = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__scopeId", "data-v-35505ae6"]]);
const ConfirmDialogue_vue_vue_type_style_index_0_scoped_e295dcad_lang = "";
const _sfc_main = {
  name: "ConfirmDialogue",
  components: { PopupModal },
  data: () => ({
    title: void 0,
    message: void 0,
    okButton: void 0,
    cancelButton: "Cancel",
    resolvePromise: void 0,
    rejectPromise: void 0
  }),
  methods: {
    show(opts = {}) {
      this.title = opts.title;
      this.message = opts.message;
      this.okButton = opts.okButton;
      if (opts.cancelButton) {
        this.cancelButton = opts.cancelButton;
      }
      this.$refs.popup.open();
      return new Promise((resolve, reject) => {
        this.resolvePromise = resolve;
        this.rejectPromise = reject;
      });
    },
    _confirm() {
      this.$refs.popup.close();
      this.resolvePromise(true);
    },
    _cancel() {
      this.$refs.popup.close();
      this.resolvePromise(false);
    }
  }
};
const _hoisted_1 = { style: { "margin-top": "0" } };
const _hoisted_2 = { class: "btns" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_popup_modal = resolveComponent("popup-modal");
  return openBlock(), createBlock(_component_popup_modal, { ref: "popup" }, {
    default: withCtx(() => [
      createBaseVNode("h2", _hoisted_1, toDisplayString(_ctx.title), 1),
      createBaseVNode("p", null, toDisplayString(_ctx.message), 1),
      createBaseVNode("div", _hoisted_2, [
        createBaseVNode("button", {
          class: "btn-secondary-cta cdBtn",
          onClick: _cache[0] || (_cache[0] = (...args) => $options._cancel && $options._cancel(...args))
        }, toDisplayString(_ctx.cancelButton), 1),
        _ctx.okButton ? (openBlock(), createElementBlock("button", {
          key: 0,
          class: "btn-main-cta cdBtn",
          onClick: _cache[1] || (_cache[1] = (...args) => $options._confirm && $options._confirm(...args))
        }, toDisplayString(_ctx.okButton), 1)) : createCommentVNode("", true)
      ])
    ]),
    _: 1
  }, 512);
}
const ConfirmDialogue = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e295dcad"]]);
export {
  ConfirmDialogue as C
};
