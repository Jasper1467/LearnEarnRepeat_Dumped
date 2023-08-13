import { _ as _export_sfc, o as openBlock, c as createElementBlock, a as createBaseVNode, t as toDisplayString, b as createCommentVNode, r as renderSlot, F as Fragment, d as renderList, n as normalizeClass, A as AuthenticationFlow, e as ref, k as kStores, f as kLocalStorageKeys, g as kAppStates, h as createVNode, w as withCtx, i as createBlock, j as hkOk, l as hkCancel, m as hkA1, p as hkA2, q as hkA3, s as hkA4, u as kEventKeys, v as resolveComponent } from "./index.45e9362d.js";
import { P as PartialOnboardingStepHotkeys } from "./PartialOnboardingStepHotkeys.71b87697.js";
import { C as ConfirmDialogue } from "./ConfirmDialogue.04c2e212.js";
import { k as kRepoKeys } from "./repo-keys.1afcf98d.js";
const OnboardingStep_vue_vue_type_style_index_0_scoped_845127cd_lang = "";
const _sfc_main$2 = {
  props: {
    stepData: Object
  }
};
const _hoisted_1$2 = { class: "onboarding-step flex-column" };
const _hoisted_2$2 = { class: "flex-row justify-center txtTitle" };
const _hoisted_3$1 = ["innerHTML"];
const _hoisted_4$1 = {
  key: 0,
  class: "flex-row justify-center imgWrap"
};
const _hoisted_5$1 = ["src"];
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$2, [
    createBaseVNode("div", _hoisted_2$2, toDisplayString($props.stepData.mainTitle), 1),
    createBaseVNode("div", {
      class: "flex-row justify-center txtSubTitle",
      innerHTML: _ctx.$sanitize($props.stepData.secondaryTitle)
    }, null, 8, _hoisted_3$1),
    $props.stepData.image ? (openBlock(), createElementBlock("div", _hoisted_4$1, [
      createBaseVNode("img", {
        src: $props.stepData.image
      }, null, 8, _hoisted_5$1)
    ])) : createCommentVNode("", true),
    renderSlot(_ctx.$slots, "default", {}, void 0, true)
  ]);
}
const OnboardingStep = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2], ["__scopeId", "data-v-845127cd"]]);
const PaginationIndicators_vue_vue_type_style_index_0_scoped_4bd972b5_lang = "";
const _sfc_main$1 = {
  props: {
    numberOfSteps: Number,
    currentStepIndex: Number,
    stepsStyles: Array,
    stepsTooltips: Array
  },
  data() {
    const steps = [];
    for (let i = 0; i < this.numberOfSteps; i++) {
      steps.push({ index: i });
    }
    return { steps };
  }
};
const _hoisted_1$1 = { class: "pagination-indicators" };
const _hoisted_2$1 = { class: "flex-row justify-center" };
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$1, [
    createBaseVNode("ul", _hoisted_2$1, [
      (openBlock(true), createElementBlock(Fragment, null, renderList($data.steps, (step) => {
        return openBlock(), createElementBlock("li", {
          key: step.index,
          class: normalizeClass(
            step.index === $props.currentStepIndex ? "page-icon-selected" : "page-icon"
          )
        }, null, 2);
      }), 128))
    ])
  ]);
}
const PaginationIndicators = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__scopeId", "data-v-4bd972b5"]]);
const OnboardingView_vue_vue_type_style_index_0_lang = "";
const authenticationStep = {
  mainTitle: "Create an account",
  secondaryTitle: "Do it now to keep your winnings safe",
  image: "",
  isAuthenticationStep: true
};
const _sfc_main = {
  components: {
    AuthenticationFlow,
    PaginationIndicators,
    OnboardingStep,
    PartialOnboardingStepHotkeys,
    ConfirmDialogue
  },
  setup() {
    const authenticationRef = ref(null);
    return {
      authenticationRef
    };
  },
  data() {
    const steps = [
      {
        mainTitle: "Put your knowledge to the test",
        secondaryTitle: "We'll suggest you a challenge during your game time.<br><br>You can start the quiz immediately by hitting [Alt+X].",
        image: "./../static-assets/o-ingame.png"
      },
      {
        mainTitle: "Collect coins for correct answers",
        secondaryTitle: "Just use some coins to get a raffle ticket",
        image: "./../static-assets/o-collect.png"
      },
      {
        mainTitle: "Buy raffle tickets",
        secondaryTitle: "Having more tickets increases your chances of winning.",
        image: "./../static-assets/o1.png"
      },
      {
        mainTitle: "Claim your prize",
        secondaryTitle: "When won a raffle - claim your prize in the Raffles screen.",
        image: "./../static-assets/o-raffles.png"
      },
      {
        mainTitle: "Show Off Your Brains \n to EARN Coins",
        secondaryTitle: "Check out our hotkeys",
        image: "./../static-assets/o3.png",
        hotkeys: [
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
        ]
      }
    ];
    const { stateHolderService } = overwolf.windows.getMainWindow();
    const user = stateHolderService.get(kStores.USER);
    if (!(user == null ? void 0 : user.isEmailVerified)) {
      steps.push(authenticationStep);
    }
    return {
      steps,
      currentStepIndex: 0
    };
  },
  computed: {
    currentStep() {
      return this.steps[this.currentStepIndex];
    },
    isPrevAvailable() {
      return this.currentStepIndex > 0;
    },
    isNextAvailable() {
      return this.currentStepIndex < this.steps.length - 1;
    },
    currentCTALabelOfAuthenticationStep() {
      var _a;
      return (_a = this.authenticationRef) == null ? void 0 : _a.getCTALabelOfCurrentAuthenticationStep();
    }
  },
  mounted() {
    const _eventListener = (eventName, eventValue) => {
      var _a, _b;
      if (eventName === kEventKeys.STORE_DATA_UPDATE) {
        if ((eventValue == null ? void 0 : eventValue.store) === kStores.USER) {
          if ((_a = window.stateHolderService.get(kStores.USER)) == null ? void 0 : _a.isEmailVerified) {
            if (!((_b = this.currentStep) == null ? void 0 : _b.isAuthenticationStep)) {
              this.steps.splice(this.steps.indexOf(authenticationStep), 1);
            }
          }
        }
      }
    };
    this._storeDataUpdateListenerBound = _eventListener.bind(this);
    const { storeUpdateSubscribe } = overwolf.windows.getMainWindow();
    this.listenerKey = storeUpdateSubscribe(this._storeDataUpdateListenerBound);
    window.main.trackAppLoadingEndedEvent("onboarding");
  },
  unmounted() {
    const { storeUpdateUnsubscribe } = overwolf.windows.getMainWindow();
    storeUpdateUnsubscribe(this.listenerKey);
  },
  methods: {
    async nextStep() {
      var _a;
      if (((_a = this.steps) == null ? void 0 : _a.length) > this.currentStepIndex + 1) {
        this.currentStepIndex += 1;
      }
    },
    async prevStep() {
      var _a;
      if (this.currentStep.isAuthenticationStep) {
        if (this.authenticationRef && !this.authenticationRef.stepBack()) {
          this.currentStepIndex -= 1;
        }
      } else if (((_a = this.steps) == null ? void 0 : _a.length) > 0) {
        this.currentStepIndex -= 1;
      }
    },
    async skipSuggestedTutorial() {
      localStorage.setItem(kLocalStorageKeys.ONBOARDING_SKIPPED, "true");
      localStorage.setItem(kLocalStorageKeys.HIDE_ONBOARDING, "true");
      this.$router.replace("/");
    },
    async startSuggestedTutorial() {
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
      this.$router.replace("/");
      console.log("startSuggestedTutorial w TUTORIAL_QUIZ_MODE");
      const { setState, repo } = overwolf.windows.getMainWindow();
      repo.set(kRepoKeys.TUTORIAL_QUIZ_MODE, true);
      setState(kAppStates.IN_GAME_QUESTION_SUGGESTION);
    }
  }
};
const _hoisted_1 = { class: "onboarding" };
const _hoisted_2 = /* @__PURE__ */ createBaseVNode("div", { class: "imageWrapBackground" }, null, -1);
const _hoisted_3 = { class: "hkWrap" };
const _hoisted_4 = {
  key: 0,
  class: "signupWrap"
};
const _hoisted_5 = { class: "bottom-row flex-column" };
const _hoisted_6 = { class: "pagination flex-row justify-center" };
const _hoisted_7 = { class: "buttons flex-row justify-space-between" };
const _hoisted_8 = ["disabled"];
const _hoisted_9 = { key: 1 };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_confirm_dialogue = resolveComponent("confirm-dialogue");
  const _component_PartialOnboardingStepHotkeys = resolveComponent("PartialOnboardingStepHotkeys");
  const _component_AuthenticationFlow = resolveComponent("AuthenticationFlow");
  const _component_OnboardingStep = resolveComponent("OnboardingStep");
  const _component_PaginationIndicators = resolveComponent("PaginationIndicators");
  return openBlock(), createElementBlock("div", _hoisted_1, [
    createVNode(_component_confirm_dialogue, { ref: "confirmDialogue" }, null, 512),
    _hoisted_2,
    createVNode(_component_OnboardingStep, { "step-data": $options.currentStep }, {
      default: withCtx(() => {
        var _a;
        return [
          createBaseVNode("div", _hoisted_3, [
            ((_a = $options.currentStep.hotkeys) == null ? void 0 : _a.length) > 0 ? (openBlock(), createBlock(_component_PartialOnboardingStepHotkeys, {
              key: 0,
              hotkeys: $options.currentStep.hotkeys
            }, null, 8, ["hotkeys"])) : createCommentVNode("", true)
          ]),
          $options.currentStep.isAuthenticationStep ? (openBlock(), createElementBlock("div", _hoisted_4, [
            createVNode(_component_AuthenticationFlow, {
              ref: "authenticationRef",
              "is-to-hide-internal-submit-buttons": true
            }, null, 512)
          ])) : createCommentVNode("", true)
        ];
      }),
      _: 1
    }, 8, ["step-data"]),
    createBaseVNode("div", _hoisted_5, [
      createBaseVNode("div", _hoisted_6, [
        (openBlock(), createBlock(_component_PaginationIndicators, {
          key: $data.steps.length,
          "number-of-steps": $data.steps.length,
          "current-step-index": $data.currentStepIndex
        }, null, 8, ["number-of-steps", "current-step-index"]))
      ]),
      createBaseVNode("div", _hoisted_7, [
        createBaseVNode("button", {
          class: normalizeClass([{ "disabled-button": $data.currentStepIndex === 0 }, "clickable btn btn-secondary-cta"]),
          disabled: !$options.isPrevAvailable,
          onClick: _cache[0] || (_cache[0] = (...args) => $options.prevStep && $options.prevStep(...args))
        }, " Back ", 10, _hoisted_8),
        $options.isNextAvailable ? (openBlock(), createElementBlock("button", {
          key: 0,
          class: "clickable btn btn-main-cta",
          onClick: _cache[1] || (_cache[1] = (...args) => $options.nextStep && $options.nextStep(...args))
        }, " Next ")) : (openBlock(), createElementBlock("div", _hoisted_9, [
          createBaseVNode("button", {
            class: "btn-label clickable padRight16",
            onClick: _cache[2] || (_cache[2] = (...args) => $options.skipSuggestedTutorial && $options.skipSuggestedTutorial(...args))
          }, " Skip "),
          $options.currentCTALabelOfAuthenticationStep ? (openBlock(), createElementBlock("button", {
            key: 0,
            class: "clickable btn btn-main-cta",
            onClick: _cache[3] || (_cache[3] = (...args) => $setup.authenticationRef.stepNext && $setup.authenticationRef.stepNext(...args))
          }, toDisplayString($options.currentCTALabelOfAuthenticationStep), 1)) : (openBlock(), createElementBlock("button", {
            key: 1,
            class: "clickable btn btn-main-cta",
            onClick: _cache[4] || (_cache[4] = (...args) => $options.startSuggestedTutorial && $options.startSuggestedTutorial(...args))
          }, " Try Now "))
        ]))
      ])
    ])
  ]);
}
const OnboardingView = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export {
  OnboardingView as default
};
