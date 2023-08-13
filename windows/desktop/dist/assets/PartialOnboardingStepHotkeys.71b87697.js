import { _ as _export_sfc, o as openBlock, c as createElementBlock, a as createBaseVNode, t as toDisplayString, n as normalizeClass, x as withDirectives, y as vModelText, v as resolveComponent, F as Fragment, d as renderList, i as createBlock, z as pushScopeId, B as popScopeId } from "./index.45e9362d.js";
const HotkeyEditor_vue_vue_type_style_index_0_scoped_8fe87b09_lang = "";
const _sfc_main$1 = {
  props: {
    hotkey: Object,
    layoutSize: String
  },
  data() {
    return {
      hotkeyValue: null,
      hotkeyFieldEmptyValue: null
    };
  },
  async created() {
    this.hotkeyValue = await window.hotkeysService.getHotkey(this.hotkey.id);
  },
  methods: {
    async onKeydown(keyPressEvent) {
      keyPressEvent.preventDefault();
      const { altKey, ctrlKey, shiftKey, key, code, keyCode } = keyPressEvent;
      this.isKeyChosen = false;
      this.hotkeyValue = null;
      if (altKey) {
        this.hotkeyValue = "Alt + ";
      }
      if (ctrlKey) {
        this.hotkeyValue = `${this.hotkeyValue || ""}Ctrl + `;
      }
      if (shiftKey) {
        this.hotkeyValue = `${this.hotkeyValue || ""}Shift + `;
      }
      if (keyCode >= 48 && keyCode <= 57 || keyCode >= 65 && keyCode <= 90) {
        this.hotkeyValue = `${this.hotkeyValue || ""}${String.fromCharCode(
          keyCode
        )}`;
        this.isKeyChosen = true;
      }
      if (keyCode >= 112 && keyCode <= 123 || keyCode >= 96 && keyCode <= 105 || [8, 9, 144, 145, 106, 107, 109, 110, 111, 144, 45, 46, 20, 192].indexOf(
        keyCode
      ) !== -1) {
        this.hotkeyValue = `${this.hotkeyValue || ""}${code}`;
        this.isKeyChosen = true;
      }
      if (keyCode >= 33 && keyCode <= 40) {
        this.hotkeyValue = `${this.hotkeyValue || ""}${key}`;
        this.isKeyChosen = true;
      }
      if (keyCode === 13) {
        this.hotkeyValue = `${this.hotkeyValue || ""}Enter`;
        this.isKeyChosen = true;
      }
      if (this.isKeyChosen) {
        this.isFailedToAssignHotkey = !await window.hotkeysService.assignHotkey({
          name: this.hotkey.id,
          virtualKey: keyCode,
          modifiers: {
            alt: altKey,
            ctrl: ctrlKey,
            shift: shiftKey
          }
        });
        if (!this.isFailedToAssignHotkey) {
          this.hotkeyFieldEmptyValue = this.hotkeyValue;
          this.hotkeyFieldEmptyValue = null;
          keyPressEvent.target.blur();
        }
      }
    },
    onKeyup() {
      if (this.isKeyChosen) {
        if (!this.isFailedToAssignHotkey) {
          this.hotkeyFieldEmptyValue = this.hotkeyValue;
          this.hotkeyFieldEmptyValue = null;
        } else {
          this.hotkeyValue = "Hotkey taken choose another";
          this.isKeyChosen = false;
        }
      } else if (!this.isFailedToAssignHotkey) {
        this.hotkeyValue = "Choose Key";
      }
    },
    onFocus() {
      this.isKeyChosen = false;
      this.oldHotkeyValue = this.hotkeyValue;
      this.hotkeyValue = "Choose Key";
    },
    onFocusLost() {
      if (!this.isKeyChosen) {
        this.hotkeyValue = this.oldHotkeyValue;
      }
    }
  }
};
const _hoisted_1$1 = { class: "flex-row" };
const _hoisted_2 = ["placeholder"];
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$1, [
    createBaseVNode("div", {
      class: normalizeClass(["hkTxt flex-column justify-center", $props.layoutSize])
    }, toDisplayString($props.hotkey.name), 3),
    withDirectives(createBaseVNode("input", {
      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.hotkeyFieldEmptyValue = $event),
      placeholder: $data.hotkeyValue,
      class: normalizeClass(["inp", $props.layoutSize]),
      onKeydown: _cache[1] || (_cache[1] = ($event) => $options.onKeydown($event)),
      onKeyup: _cache[2] || (_cache[2] = (...args) => $options.onKeyup && $options.onKeyup(...args)),
      onFocus: _cache[3] || (_cache[3] = (...args) => $options.onFocus && $options.onFocus(...args)),
      onFocusout: _cache[4] || (_cache[4] = (...args) => $options.onFocusLost && $options.onFocusLost(...args))
    }, null, 42, _hoisted_2), [
      [vModelText, $data.hotkeyFieldEmptyValue]
    ])
  ]);
}
const HotkeyEditor = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__scopeId", "data-v-8fe87b09"]]);
const PartialOnboardingStepHotkeys_vue_vue_type_style_index_0_scoped_accd408a_lang = "";
const _sfc_main = {
  components: { HotkeyEditor },
  props: {
    hotkeys: Object,
    layoutSize: String
  }
};
const _withScopeId = (n) => (pushScopeId("data-v-accd408a"), n = n(), popScopeId(), n);
const _hoisted_1 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("div", { class: "hkTitle" }, "Hotkeys", -1));
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_HotkeyEditor = resolveComponent("HotkeyEditor");
  return openBlock(), createElementBlock(Fragment, null, [
    _hoisted_1,
    (openBlock(true), createElementBlock(Fragment, null, renderList($props.hotkeys, (hotkey) => {
      return openBlock(), createBlock(_component_HotkeyEditor, {
        key: hotkey.id,
        "layout-size": $props.layoutSize,
        hotkey
      }, null, 8, ["layout-size", "hotkey"]);
    }), 128))
  ], 64);
}
const PartialOnboardingStepHotkeys = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-accd408a"]]);
export {
  PartialOnboardingStepHotkeys as P
};
