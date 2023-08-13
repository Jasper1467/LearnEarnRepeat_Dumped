import { _ as _export_sfc, o as openBlock, c as createElementBlock, r as renderSlot, J as createTextVNode, n as normalizeClass, L as LerCoin, k as kStores, v as resolveComponent, a as createBaseVNode, t as toDisplayString, h as createVNode, i as createBlock, w as withCtx, z as pushScopeId, B as popScopeId, F as Fragment, d as renderList, x as withDirectives, S as vShow, b as createCommentVNode, T as Transition, H as kMetrics, U as UtilsService, u as kEventKeys, g as kAppStates } from "./index.45e9362d.js";
const VButton_vue_vue_type_style_index_0_lang = "";
const _sfc_main$5 = {
  name: "VButton",
  props: {
    onClick: Function,
    time: {
      type: Number,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    isLoading: false,
    hasError: false,
    isSuccess: false
  }),
  computed: {
    computedClasses() {
      return {
        "is-danger": this.hasError,
        "is-success": this.isSuccess,
        "is-loading": this.loadingState
      };
    },
    loadingState() {
      return this.loading || this.isLoading;
    }
  },
  methods: {
    async handleClick(e) {
      try {
        this.isLoading = true;
        await this.onClick(e);
        this.resetDelayed("isSuccess");
      } catch (error) {
        this.resetDelayed("hasError");
      } finally {
        this.isLoading = false;
      }
    },
    resetDelayed(property) {
      this[property] = true;
      if (this.time) {
        setTimeout(() => {
          this[property] = false;
        }, this.time);
      }
    }
  }
};
const _hoisted_1$5 = ["disabled"];
const _hoisted_2$4 = { key: 0 };
const _hoisted_3$4 = { key: 1 };
const _hoisted_4$4 = { key: 2 };
function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("button", {
    class: normalizeClass([$options.computedClasses, "button is-primary"]),
    disabled: $options.loadingState,
    onClick: _cache[0] || (_cache[0] = (...args) => $options.handleClick && $options.handleClick(...args))
  }, [
    $options.loadingState ? (openBlock(), createElementBlock("span", _hoisted_2$4, [
      renderSlot(_ctx.$slots, "loading", {}, () => [
        createTextVNode("Loading...")
      ])
    ])) : _ctx.isSuccess ? (openBlock(), createElementBlock("span", _hoisted_3$4, [
      renderSlot(_ctx.$slots, "success", {}, () => [
        createTextVNode("Sucess!")
      ])
    ])) : _ctx.hasError ? (openBlock(), createElementBlock("span", _hoisted_4$4, [
      renderSlot(_ctx.$slots, "error", {}, () => [
        createTextVNode("Errored")
      ])
    ])) : renderSlot(_ctx.$slots, "default", { key: 3 })
  ], 10, _hoisted_1$5);
}
const VButton = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$5]]);
const CollectButton_vue_vue_type_style_index_0_scoped_77a1d0c5_lang = "";
const _sfc_main$4 = {
  name: "CollectButton",
  components: { VButton, LerCoin },
  props: {
    id: String,
    reward: Number,
    bonus: Number,
    isCollected: Boolean
  },
  emits: ["onCollected"],
  computed: {
    totalReward() {
      return (this.reward || 0) + (this.bonus || 0);
    }
  },
  methods: {
    async clicked() {
      if (!this.isCollected) {
        const { stateHolderService } = overwolf.windows.getMainWindow();
        const user = stateHolderService.get(kStores.USER);
        if (!(user == null ? void 0 : user.isEmailVerified)) {
          stateHolderService.set(kStores.MODAL_STATE, true);
          stateHolderService.set(
            kStores.ERROR_MESSAGE,
            "User verification is required"
          );
          return Promise.reject("");
        }
        const res = await window.main.collectReward(this.id);
        if (res) {
          this.$emit("onCollected", this.id);
        } else {
          throw new Error("Failed to collect reward");
        }
      }
      if (this.isCollected) {
        this.$emit("onCollected", this.id);
      }
    }
  }
};
const _withScopeId$2 = (n) => (pushScopeId("data-v-77a1d0c5"), n = n(), popScopeId(), n);
const _hoisted_1$4 = {
  key: 0,
  class: "collected-state"
};
const _hoisted_2$3 = { class: "flex-row justify-center" };
const _hoisted_3$3 = {
  key: 0,
  class: "flex-row justify-center"
};
const _hoisted_4$3 = {
  key: 1,
  class: "flex-row justify-center"
};
const _hoisted_5$3 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ createBaseVNode("span", { class: "smaller-text" }, "Try again", -1));
function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_LerCoin = resolveComponent("LerCoin");
  const _component_VButton = resolveComponent("VButton");
  return $props.isCollected ? (openBlock(), createElementBlock("div", _hoisted_1$4, [
    createBaseVNode("span", _hoisted_2$3, [
      createTextVNode(" Collected " + toDisplayString($options.totalReward) + " ", 1),
      createVNode(_component_LerCoin, { class: "col-coin" })
    ])
  ])) : (openBlock(), createBlock(_component_VButton, {
    key: 1,
    class: "btn btn-main-cta",
    onClick: $options.clicked
  }, {
    loading: withCtx(() => [
      createTextVNode(" Loading...")
    ]),
    success: withCtx(() => [
      createTextVNode("Awesome! Collected!")
    ]),
    error: withCtx(() => [
      _hoisted_5$3
    ]),
    default: withCtx(() => [
      $options.totalReward ? (openBlock(), createElementBlock("span", _hoisted_3$3, [
        createTextVNode(" Collect "),
        createVNode(_component_LerCoin, { class: "col-coin" }),
        createTextVNode(" " + toDisplayString($options.totalReward), 1)
      ])) : (openBlock(), createElementBlock("span", _hoisted_4$3, " Next "))
    ]),
    _: 1
  }, 8, ["onClick"]));
}
const CollectButton = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$4], ["__scopeId", "data-v-77a1d0c5"]]);
const CollectItem_vue_vue_type_style_index_0_scoped_23112cc0_lang = "";
const _sfc_main$3 = {
  name: "CollectItem",
  components: { CollectButton },
  props: {
    item: Object,
    curItemIndex: Number,
    curPage: Number,
    loadingState: Boolean
  },
  emits: ["onCollected"],
  data() {
    return {
      innerAnimStep: 0,
      timeoutRefs: []
    };
  },
  computed: {
    isShowPercentages() {
      return false;
    },
    isShowWrongBox() {
      return !this.item.fact;
    }
  },
  watch: {
    loadingState: function(newVal, oldVal) {
      if (newVal !== oldVal) {
        console.log("loadingState changed, cur" + this.loadingState);
        this.animateUi();
      }
    },
    curPage: function(newVal, oldVal) {
      if (newVal !== oldVal) {
        console.log("curPage changed, cur" + this.curPage);
        this.animateUi();
      }
    }
  },
  mounted() {
    this.animateUi();
  },
  unmounted() {
    this.clearTimeouts();
  },
  methods: {
    clearTimeouts() {
      while (this.timeoutRefs.length) {
        const t = this.timeoutRefs.pop();
        clearTimeout(t);
      }
    },
    async animateUi() {
      const self = this;
      if (this.loadingState) {
        this.innerAnimStep = 2;
        return;
      }
      if (this.curItemIndex !== this.curPage) {
        this.clearTimeouts();
        return;
      }
      let selectedOption = null;
      try {
        selectedOption = Number(this.item.answer) - 1;
      } catch (e) {
      }
      const correctOption = Number(this.item.correctAnswer) - 1;
      let wrongOption = null;
      if (selectedOption !== correctOption) {
        wrongOption = selectedOption;
      }
      console.log(
        `animateUi; selected ${selectedOption}, correct ${correctOption}, wrong ${wrongOption}`
      );
      self.innerAnimStep = 0;
      let delaysAcc = 0;
      console.log("turn off ALL");
      if (self.$refs.optionRefs) {
        for (let i = 0; i < 4; i++) {
          self.$refs.optionRefs[i].classList.remove(
            "collect-item-circle-selected"
          );
          self.$refs.optionRefs[i].classList.remove(
            "collect-item-circle-correct"
          );
          self.$refs.optionRefs[i].classList.remove(
            "collect-item-circle-wrong"
          );
        }
      }
      function step1() {
        if (selectedOption || selectedOption === 0) {
          self.$refs.optionRefs[selectedOption].classList.add(
            "collect-item-circle-selected"
          );
        }
        self.innerAnimStep++;
      }
      delaysAcc += 100;
      this.timeoutRefs.push(setTimeout(step1, delaysAcc));
      function step2() {
        var _a, _b, _c;
        (_a = self.$refs.optionRefs[selectedOption]) == null ? void 0 : _a.classList.remove(
          "collect-item-circle-selected"
        );
        (_b = self.$refs.optionRefs[correctOption]) == null ? void 0 : _b.classList.add(
          "collect-item-circle-correct"
        );
        if (wrongOption || wrongOption === 0) {
          (_c = self.$refs.optionRefs[wrongOption]) == null ? void 0 : _c.classList.add(
            "collect-item-circle-wrong"
          );
        }
        self.innerAnimStep++;
      }
      delaysAcc += 700;
      this.timeoutRefs.push(setTimeout(step2, delaysAcc));
      function nextStep() {
        self.innerAnimStep++;
      }
      delaysAcc += this.isShowWrongBox ? 250 : 1;
      this.timeoutRefs.push(setTimeout(nextStep, delaysAcc));
      delaysAcc += 100;
      this.timeoutRefs.push(setTimeout(nextStep, delaysAcc));
      delaysAcc += 100;
      this.timeoutRefs.push(setTimeout(nextStep, delaysAcc));
      delaysAcc += 100;
      this.timeoutRefs.push(setTimeout(nextStep, delaysAcc));
    },
    onCollected(itemId) {
      this.$emit("onCollected", itemId);
    }
  }
};
const _withScopeId$1 = (n) => (pushScopeId("data-v-23112cc0"), n = n(), popScopeId(), n);
const _hoisted_1$3 = {
  key: 0,
  class: "flex-column item-wrap",
  style: {}
};
const _hoisted_2$2 = { class: "questionText d-flex flex-row justify-center" };
const _hoisted_3$2 = { class: "flex-column d-flex flex-row justify-center" };
const _hoisted_4$2 = ["data-index"];
const _hoisted_5$2 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ createBaseVNode("div", { class: "collect-item-circle" }, null, -1));
const _hoisted_6$1 = { class: "option-text" };
const _hoisted_7$1 = {
  key: 0,
  class: "your-answer-label"
};
const _hoisted_8$1 = {
  key: 0,
  class: "bottom-big-height-placeholder"
};
const _hoisted_9 = {
  key: 0,
  class: "wrong-box-wrap"
};
const _hoisted_10 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ createBaseVNode("div", { class: "wrong-box" }, null, -1));
const _hoisted_11 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ createBaseVNode("div", { class: "wrong-box-front" }, [
  /* @__PURE__ */ createBaseVNode("div", { class: "education-icon" }),
  /* @__PURE__ */ createBaseVNode("div", { class: "box-text" }, [
    /* @__PURE__ */ createTextVNode(" Wrong answers are lessons learned!"),
    /* @__PURE__ */ createBaseVNode("br"),
    /* @__PURE__ */ createTextVNode(" To help you learn, we\u2019ll quiz you on this again in the future ")
  ])
], -1));
const _hoisted_12 = [
  _hoisted_10,
  _hoisted_11
];
const _hoisted_13 = {
  key: 1,
  class: "bottom-big-height-placeholder"
};
const _hoisted_14 = { class: "fact-box-wrap" };
const _hoisted_15 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ createBaseVNode("div", { class: "fact-box" }, null, -1));
const _hoisted_16 = { class: "fact-box-front flex-column justify-center" };
const _hoisted_17 = { class: "fact-text" };
const _hoisted_18 = ["id"];
const _hoisted_19 = {
  key: 1,
  class: "text"
};
function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_CollectButton = resolveComponent("CollectButton");
  return $props.item && $props.item.question ? (openBlock(), createElementBlock("div", _hoisted_1$3, [
    createBaseVNode("div", _hoisted_2$2, toDisplayString($props.item.question.question), 1),
    createBaseVNode("div", _hoisted_3$2, [
      (openBlock(true), createElementBlock(Fragment, null, renderList($props.item.question.options, (option, index) => {
        return openBlock(), createElementBlock("div", {
          key: index,
          ref_for: true,
          ref: "optionRefs",
          "data-index": index,
          class: "d-flex collect-item-option"
        }, [
          _hoisted_5$2,
          createBaseVNode("div", _hoisted_6$1, toDisplayString(index + 1) + ". " + toDisplayString(option), 1),
          $props.item.answer.toString() === (index + 1).toString() ? withDirectives((openBlock(), createElementBlock("div", _hoisted_7$1, " Your answer ", 512)), [
            [vShow, $data.innerAnimStep >= 1]
          ]) : createCommentVNode("", true)
        ], 8, _hoisted_4$2);
      }), 128))
    ]),
    $options.isShowWrongBox ? (openBlock(), createElementBlock("div", _hoisted_8$1, [
      createVNode(Transition, { name: "fade" }, {
        default: withCtx(() => [
          $options.isShowWrongBox ? withDirectives((openBlock(), createElementBlock("div", _hoisted_9, _hoisted_12, 512)), [
            [vShow, $data.innerAnimStep >= 3]
          ]) : createCommentVNode("", true)
        ]),
        _: 1
      })
    ])) : createCommentVNode("", true),
    $props.item.fact ? withDirectives((openBlock(), createElementBlock("div", _hoisted_13, [
      createVNode(Transition, { name: "fade" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_14, [
            _hoisted_15,
            createBaseVNode("div", _hoisted_16, [
              createBaseVNode("div", _hoisted_17, toDisplayString($props.item.fact), 1)
            ])
          ])
        ]),
        _: 1
      })
    ], 512)), [
      [vShow, $data.innerAnimStep >= 3]
    ]) : createCommentVNode("", true),
    createVNode(Transition, { name: "fade" }, {
      default: withCtx(() => [
        $data.innerAnimStep >= 3 ? (openBlock(), createElementBlock("div", {
          key: 0,
          id: $props.item.id,
          class: "d-flex flex-row justify-center"
        }, [
          createVNode(_component_CollectButton, {
            id: $props.item.id,
            reward: $props.item.reward,
            bonus: $props.item.bonusReward,
            "is-collected": $props.item.collected,
            onOnCollected: $options.onCollected
          }, null, 8, ["id", "reward", "bonus", "is-collected", "onOnCollected"])
        ], 8, _hoisted_18)) : createCommentVNode("", true)
      ]),
      _: 1
    })
  ])) : (openBlock(), createElementBlock("div", _hoisted_19, " Unexpected error occured. Please try again later. "));
}
const CollectItem = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$3], ["__scopeId", "data-v-23112cc0"]]);
const ErrorMessage_vue_vue_type_style_index_0_scoped_bc482364_lang = "";
const _sfc_main$2 = {
  name: "ErrorMessage",
  props: {
    error: Object
  },
  computed: {
    errorMessage() {
      return typeof this.error === "string" ? this.error : this.error.errorMessage || this.error.message || "Error";
    }
  }
};
const _hoisted_1$2 = { class: "errorMessage" };
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("span", _hoisted_1$2, toDisplayString($options.errorMessage), 1);
}
const ErrorMessage = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2], ["__scopeId", "data-v-bc482364"]]);
const CollectEmptyState_vue_vue_type_style_index_0_scoped_583c5923_lang = "";
const _sfc_main$1 = {
  name: "CollectEmptyState"
};
const _withScopeId = (n) => (pushScopeId("data-v-583c5923"), n = n(), popScopeId(), n);
const _hoisted_1$1 = { class: "wrap" };
const _hoisted_2$1 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("div", { class: "flex-row screen-title" }, "Collect Rewards", -1));
const _hoisted_3$1 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("div", { style: { "padding": "20px" } }, null, -1));
const _hoisted_4$1 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("div", { class: "border flex-row txt padTop8" }, [
  /* @__PURE__ */ createTextVNode(" Currently, there are no rewards pending for collection."),
  /* @__PURE__ */ createBaseVNode("br"),
  /* @__PURE__ */ createBaseVNode("br"),
  /* @__PURE__ */ createTextVNode(" Once you have answered some trivia questions, your earnings will appear here for you to claim. ")
], -1));
const _hoisted_5$1 = [
  _hoisted_2$1,
  _hoisted_3$1,
  _hoisted_4$1
];
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$1, _hoisted_5$1);
}
const CollectEmptyState = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__scopeId", "data-v-583c5923"]]);
const CollectView_vue_vue_type_style_index_0_lang = "";
const _sfc_main = {
  components: { ErrorMessage, CollectItem, CollectEmptyState },
  data() {
    return {
      rewardsList: null,
      curPage: null,
      errorMessage: null,
      animationStep: 0,
      loadingState: false,
      loadingStartTime: null
    };
  },
  async mounted() {
    await this.initData();
    window.main.trackEvent(kMetrics.Collect_ViewOpened, {});
    const _eventListener = async (eventName, eventValue) => {
      switch (eventName) {
        case kEventKeys.UPDATE_TO_STATE: {
          console.log(`CollectView _eventListener stateUpdated: ${eventValue}`);
          if (eventValue === kAppStates.DESKTOP_AFTER_GAME) {
            await this.initData();
          }
        }
      }
    };
    let _eventListenerBound = _eventListener.bind(this);
    this.listenerKey = window.main.owEventBus.addListener(_eventListenerBound);
  },
  unmounted() {
    window.main.owEventBus.removeListener(this.listenerKey);
  },
  methods: {
    async toggleLoadingOff() {
      setTimeout(async () => {
        await UtilsService.waitForLoadingToggleOff(this.loadingStartTime);
        this.loadingState = false;
        this.animationStep = 0;
      }, 0);
    },
    showLoading() {
      this.loadingStartTime = Date.now();
      this.loadingState = true;
      this.rewardsList = [
        {
          _id: "_1",
          id: "_1",
          question: {
            _id: "_1",
            question: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
            options: [
              "Ut enim ad minim veniam",
              "Quis nostrud exercitation",
              "Ullamco laboris nisi ut aliquip",
              "Ex ea commodo consequat"
            ]
          },
          percentages: [
            { answer: "1", percent: 0.1 },
            { answer: "2", percent: 0.68 },
            { answer: "3", percent: 0.2 },
            { answer: "4", percent: 0.02 }
          ],
          answer: 2,
          correct: false,
          reward: 0,
          correctAnswer: "4",
          bonusAnswer: 2,
          bonusCorrect: true,
          bonusReward: 0
        }
      ];
      this.navPage(0);
    },
    async initData() {
      this.curPage = null;
      this.errorMessage = null;
      this.animationStep = 0;
      this.showLoading();
      setTimeout(async () => {
        try {
          this.rewardsList = await window.main.getPendingRewards();
          if (this.rewardsList && Array.isArray(this.rewardsList)) {
            this.rewardsList.forEach((item) => {
              var _a;
              item.id = (_a = item.question) == null ? void 0 : _a._id;
            });
          }
          if (this.rewardsList && this.rewardsList.length) {
            this.navPage(0);
          }
        } catch (error) {
          console.error(`${this.TAG} answerChecked error: `, error);
          this.errorMessage = `An error occurred. Please try again later.`;
        }
        await this.toggleLoadingOff();
      }, 0);
    },
    navPage(direction) {
      if (direction === 0) {
        this.curPage = 0;
      }
      this.curPage = this.curPage + direction;
      this.curPage = Math.max(0, this.curPage);
      this.curPage = Math.min(this.rewardsList.length - 1, this.curPage);
    },
    async onItemCollected(itemId) {
      if (this.rewardsList) {
        this.rewardsList.forEach((item) => {
          if (item.id === itemId) {
            item.collected = true;
          }
        });
      }
      if (this.curPage < this.rewardsList.length - 1) {
        this.navPage(1);
      } else {
        this.initData();
      }
    }
  }
};
const _hoisted_1 = { class: "collect scrollable" };
const _hoisted_2 = {
  key: 0,
  class: "error-message"
};
const _hoisted_3 = { key: 1 };
const _hoisted_4 = {
  key: 2,
  class: "d-flex flex-column",
  style: { "height": "100%", "justify-content": "space-between" }
};
const _hoisted_5 = { class: "d-flex collect-page-margin" };
const _hoisted_6 = ["data-index"];
const _hoisted_7 = { class: "d-flex flex-row justify-center" };
const _hoisted_8 = ["onClick"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_ErrorMessage = resolveComponent("ErrorMessage");
  const _component_CollectEmptyState = resolveComponent("CollectEmptyState");
  const _component_CollectItem = resolveComponent("CollectItem");
  return openBlock(), createElementBlock("div", _hoisted_1, [
    $data.errorMessage ? (openBlock(), createElementBlock("div", _hoisted_2, [
      createVNode(_component_ErrorMessage, { error: "errorMessage" })
    ])) : !$data.loadingState && (!$data.rewardsList || !$data.rewardsList.length) ? (openBlock(), createElementBlock("div", _hoisted_3, [
      createVNode(_component_CollectEmptyState)
    ])) : (openBlock(), createElementBlock("div", _hoisted_4, [
      createBaseVNode("div", _hoisted_5, [
        withDirectives(createBaseVNode("div", {
          class: normalizeClass([{ disabled: !($data.curPage > 0 && $data.rewardsList.length > 1) }, "collect-nav-arrow-prev clickable"]),
          onClick: _cache[0] || (_cache[0] = ($event) => $options.navPage(-1))
        }, null, 2), [
          [vShow, !$data.loadingState]
        ]),
        (openBlock(true), createElementBlock(Fragment, null, renderList($data.rewardsList, (reward, index) => {
          return withDirectives((openBlock(), createElementBlock("div", {
            key: reward.id,
            ref_for: true,
            ref: "pagesRefs",
            "data-index": index
          }, [
            createVNode(_component_CollectItem, {
              id: "_ci_" + index,
              class: normalizeClass({ loading: $data.loadingState }),
              "cur-item-index": index,
              "cur-page": $data.curPage,
              item: $data.rewardsList[index],
              "loading-state": $data.loadingState,
              onOnCollected: $options.onItemCollected
            }, null, 8, ["id", "class", "cur-item-index", "cur-page", "item", "loading-state", "onOnCollected"])
          ], 8, _hoisted_6)), [
            [vShow, index === $data.curPage]
          ]);
        }), 128)),
        withDirectives(createBaseVNode("div", {
          class: normalizeClass([{
            disabled: !($data.curPage < $data.rewardsList.length - 1 && $data.rewardsList.length > 1)
          }, "collect-nav-arrow-next clickable"]),
          onClick: _cache[1] || (_cache[1] = ($event) => $options.navPage(1))
        }, null, 2), [
          [vShow, !$data.loadingState]
        ])
      ]),
      createBaseVNode("div", _hoisted_7, [
        (openBlock(true), createElementBlock(Fragment, null, renderList($data.rewardsList, (reward, index) => {
          return openBlock(), createElementBlock("div", {
            key: reward.id,
            class: normalizeClass([$data.curPage === index ? "n-page-selected" : "n-page", "d-flex clickable"]),
            style: { "padding-right": "4px" },
            onClick: ($event) => $data.curPage = index
          }, null, 10, _hoisted_8);
        }), 128))
      ])
    ]))
  ]);
}
const CollectView = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export {
  CollectView as default
};
