import { _ as _export_sfc, G as meta, f as kLocalStorageKeys, k as kStores, H as kMetrics, g as kAppStates, o as openBlock, c as createElementBlock, h as createVNode, a as createBaseVNode, b as createCommentVNode, w as withCtx, t as toDisplayString, J as createTextVNode, v as resolveComponent } from "./index.45e9362d.js";
import { k as kRepoKeys } from "./repo-keys.1afcf98d.js";
import { C as ConfirmDialogue } from "./ConfirmDialogue.04c2e212.js";
const SettingsView_vue_vue_type_style_index_0_lang = "";
const _sfc_main = {
  components: { ConfirmDialogue },
  data() {
    return {
      tutorialWasSkipped: null,
      isUserVerified: null
    };
  },
  computed: {
    appName() {
      return meta.name;
    },
    version() {
      return meta.version;
    }
  },
  mounted() {
    this.tutorialWasSkipped = localStorage.getItem(kLocalStorageKeys.ONBOARDING_SKIPPED) === "true";
    const { stateHolderService } = overwolf.windows.getMainWindow();
    const user = stateHolderService.get(kStores.USER);
    this.isUserVerified = user == null ? void 0 : user.isEmailVerified;
    window.main.trackEvent(kMetrics.Settings_ViewOpened, {});
  },
  methods: {
    async collectLogs() {
      const sysInfo = await overwolf.utils.getSystemInformation((ret) => {
        console.log("ret");
        console.log(ret);
      });
      console.log("Collect logs");
      console.log(`${this.appName}: v${this.version}`);
      console.log(JSON.stringify(sysInfo));
      const ok = this.$refs.confirmDialogue.show({
        title: "Collect logs",
        message: "The path to the logs folder would be copied to the clipboard. Hit WinKey+R and paste the path to navigate to the folder.",
        okButton: "Copy path",
        cancelButton: "Cancel"
      });
      if (ok) {
        const path = `%AppData%\\..\\Local\\Overwolf\\Log\\Apps\\Learn.Earn.Repeat`;
        overwolf.utils.placeOnClipboard(path);
      }
    },
    async resetAppData() {
      window.main.trackEvent(kMetrics.Settings_ResetAppData_Clicked, {});
      const ok = await this.$refs.confirmDialogue.show({
        title: "Reset app data",
        message: "Be careful, if you are not a verified user you could lose your progress. Consider consulting with the support team before proceeding.",
        okButton: "Reset and relaunch the app",
        cancelButton: "Cancel"
      });
      if (ok) {
        window.main.trackEvent(kMetrics.Settings_ResetAppData_Approved, {});
        const { repo } = overwolf.windows.getMainWindow();
        repo.resetAll();
        console.log("Relaunching app");
        overwolf.extensions.relaunch();
      }
    },
    login() {
      window.main.trackEvent(kMetrics.Settings_Login_Clicked, {});
      const { stateHolderService } = overwolf.windows.getMainWindow();
      const user = stateHolderService.get(kStores.USER);
      if (!(user == null ? void 0 : user.isEmailVerified)) {
        stateHolderService.set(kStores.MODAL_STATE, true);
        return;
      }
    },
    copyVersionToClipboard() {
      overwolf.utils.placeOnClipboard(this.appName + ": v" + this.version);
      this.$refs.confirmDialogue.show({
        title: "Current version",
        message: `Version ${this.appName + ": v" + this.version} copied to clipboard`,
        cancelButton: "Ok"
      });
    },
    async startTutorial() {
      window.main.trackEvent(kMetrics.Settings_Start_Tutorial, {});
      const ok = await this.$refs.confirmDialogue.show({
        title: "Start tutorial challenge",
        message: "You can practice the first challenge before actually starting a game. The in-game widget would be opened and suggest the challenge.",
        okButton: "Start",
        cancelButton: "Cancel"
      });
      if (!ok) {
        return;
      }
      localStorage.setItem(kLocalStorageKeys.HIDE_ONBOARDING, "true");
      localStorage.setItem(kLocalStorageKeys.ONBOARDING_SKIPPED, "true");
      this.$router.replace("/");
      console.log("startSuggestedTutorial w TUTORIAL_QUIZ_MODE");
      const { setState, repo } = overwolf.windows.getMainWindow();
      repo.set(kRepoKeys.TUTORIAL_QUIZ_MODE, true);
      setState(kAppStates.IN_GAME_QUESTION_SUGGESTION);
    }
  }
};
const _hoisted_1 = { class: "settings padLeft22px" };
const _hoisted_2 = /* @__PURE__ */ createBaseVNode("div", { class: "flex-row padBot10 settingsTitle" }, "Settings", -1);
const _hoisted_3 = { class: "flex-row" };
const _hoisted_4 = { class: "flex-col col" };
const _hoisted_5 = {
  key: 0,
  class: "border pad8 padBot8 padTop8 flex-row txt justify-center"
};
const _hoisted_6 = {
  key: 1,
  class: "border pad8 padBot8 flex-row txt padTop8 justify-center"
};
const _hoisted_7 = { class: "border pad8 padBot8 flex-row txt padTop8 justify-center" };
const _hoisted_8 = /* @__PURE__ */ createBaseVNode("button", { class: "bWidth btn-small btn-secondary-cta" }, " Hotkeys Editor ", -1);
const _hoisted_9 = { class: "flex-col col" };
const _hoisted_10 = { class: "border pad8 padBot8 flex-col txt padTop8" };
const _hoisted_11 = { class: "border pad8 padBot8 flex-col txt padTop8" };
const _hoisted_12 = /* @__PURE__ */ createBaseVNode("div", { class: "border pad8 padBot8 flex-row txt padTop8" }, [
  /* @__PURE__ */ createBaseVNode("span", null, [
    /* @__PURE__ */ createTextVNode(" For any issues, suggestions or feedback please contact us at our "),
    /* @__PURE__ */ createBaseVNode("a", {
      href: "https://discord.gg/pQN6PhQjHM",
      target: "_blank"
    }, "Discord")
  ])
], -1);
const _hoisted_13 = { class: "border pad8 padBot8 flex-row txt padTop8 justify-space-between" };
const _hoisted_14 = { class: "flex-column justify-center" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_confirm_dialogue = resolveComponent("confirm-dialogue");
  const _component_RouterLink = resolveComponent("RouterLink");
  return openBlock(), createElementBlock("div", _hoisted_1, [
    createVNode(_component_confirm_dialogue, { ref: "confirmDialogue" }, null, 512),
    _hoisted_2,
    createBaseVNode("div", _hoisted_3, [
      createBaseVNode("div", _hoisted_4, [
        $data.tutorialWasSkipped ? (openBlock(), createElementBlock("div", _hoisted_5, [
          createBaseVNode("button", {
            class: "bWidth btn btn-main-cta",
            onClick: _cache[0] || (_cache[0] = (...args) => $options.startTutorial && $options.startTutorial(...args))
          }, " Start tutorial challenge ")
        ])) : createCommentVNode("", true),
        !$data.isUserVerified ? (openBlock(), createElementBlock("div", _hoisted_6, [
          createBaseVNode("button", {
            class: "bWidth btn btn-main-cta",
            onClick: _cache[1] || (_cache[1] = ($event) => $options.login())
          }, " Login ")
        ])) : createCommentVNode("", true),
        createBaseVNode("div", _hoisted_7, [
          createVNode(_component_RouterLink, { to: "/hotkeys" }, {
            default: withCtx(() => [
              _hoisted_8
            ]),
            _: 1
          })
        ])
      ]),
      createBaseVNode("div", _hoisted_9, [
        createBaseVNode("div", _hoisted_10, [
          createBaseVNode("button", {
            class: "bWidth btn-small btn-secondary-cta justify-center flex-row margin-auto",
            onClick: _cache[2] || (_cache[2] = (...args) => $options.collectLogs && $options.collectLogs(...args))
          }, " Collect logs ")
        ]),
        createBaseVNode("div", _hoisted_11, [
          createBaseVNode("button", {
            class: "bWidth btn-small btn-secondary-cta justify-center flex-row margin-auto",
            onClick: _cache[3] || (_cache[3] = (...args) => $options.resetAppData && $options.resetAppData(...args))
          }, " Reset app data ")
        ]),
        _hoisted_12,
        createBaseVNode("div", _hoisted_13, [
          createBaseVNode("div", _hoisted_14, " Current version: " + toDisplayString($options.version), 1),
          createBaseVNode("div", null, [
            createBaseVNode("button", {
              class: "btn-small btn-secondary-cta",
              onClick: _cache[4] || (_cache[4] = (...args) => $options.copyVersionToClipboard && $options.copyVersionToClipboard(...args))
            }, " Copy ")
          ])
        ])
      ])
    ])
  ]);
}
const SettingsView = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export {
  SettingsView as default
};
