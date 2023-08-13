import { _ as _export_sfc, o as openBlock, c as createElementBlock, C as kTriggers, v as resolveComponent, a as createBaseVNode, t as toDisplayString, F as Fragment, d as renderList, h as createVNode, r as renderSlot, D as normalizeStyle, L as LerCoin, g as kAppStates, E as kWindowNames, G as meta, H as kMetrics, u as kEventKeys, k as kStores, I as kEventOwners, J as createTextVNode, w as withCtx, b as createCommentVNode, n as normalizeClass, i as createBlock } from "./index.45e9362d.js";
import { C as ConfirmDialogue } from "./ConfirmDialogue.04c2e212.js";
const kQuizType = {
  REGULAR: "REGULAR",
  BUY_LIVES: "BUY_LIVES",
  BONUS_FREE: "BONUS_FREE"
};
let debugExtraTime = 0;
const kConsts = {
  baseUrl: "https://brain.learnearnrepeat.com",
  durationMs: {
    suggestion: 60 * 1e3 + debugExtraTime,
    beforeStep2: 0.75 * 1e3,
    step2: 4 * 1e3,
    step4: 10 * 1e3 + debugExtraTime
  }
};
const LerHeart_vue_vue_type_style_index_0_scoped_f7b665a8_lang = "";
const _sfc_main$3 = {
  name: "LerCoin"
};
const _hoisted_1$3 = { class: "lives" };
function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("span", _hoisted_1$3);
}
const LerHeart = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$3], ["__scopeId", "data-v-f7b665a8"]]);
const QuizQuestion_vue_vue_type_style_index_0_scoped_492e6175_lang = "";
const _sfc_main$2 = {
  name: "QuizQuestion",
  props: {
    quizQuestionObject: Object,
    allowPickingAnswer: Boolean,
    gameId: Number,
    selectedAnswer: Number,
    correctAnswer: Number,
    activeSelectedAnswer: Number
  },
  emits: ["answer-selected"],
  data() {
    return {
      wasReported: null
    };
  },
  beforeUpdate() {
    console.log(`QQ quizquestion: `, this.quizQuestionObject);
  },
  mounted() {
    this.kTriggers = kTriggers;
  },
  methods: {
    selectAnswer(answer) {
      if (this.allowPickingAnswer) {
        this.wasReported = answer;
        this.$emit("answer-selected", answer, kTriggers.MOUSE_CLICK);
      }
    }
  }
};
const _hoisted_1$2 = { class: "questionText" };
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_QuizOption = resolveComponent("QuizOption");
  return openBlock(), createElementBlock(Fragment, null, [
    createBaseVNode("div", _hoisted_1$2, toDisplayString($props.quizQuestionObject.question), 1),
    createBaseVNode("div", null, [
      (openBlock(), createElementBlock(Fragment, null, renderList(4, (index) => {
        return createVNode(_component_QuizOption, {
          key: index,
          option: index,
          "allow-picking-answer": $props.allowPickingAnswer,
          "quiz-question-object": $props.quizQuestionObject,
          "select-answer": $options.selectAnswer,
          "was-reported": $data.wasReported,
          "selected-answer": $props.selectedAnswer,
          "correct-answer": $props.correctAnswer,
          "active-answer": $props.activeSelectedAnswer
        }, null, 8, ["option", "allow-picking-answer", "quiz-question-object", "select-answer", "was-reported", "selected-answer", "correct-answer", "active-answer"]);
      }), 64))
    ])
  ], 64);
}
const QuizQuestion = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2], ["__scopeId", "data-v-492e6175"]]);
let getRandomValues;
const rnds8 = new Uint8Array(16);
function rng() {
  if (!getRandomValues) {
    getRandomValues = typeof crypto !== "undefined" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto);
    if (!getRandomValues) {
      throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
    }
  }
  return getRandomValues(rnds8);
}
const byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}
const randomUUID = typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID.bind(crypto);
const native = {
  randomUUID
};
function v4(options, buf, offset) {
  if (native.randomUUID && !buf && !options) {
    return native.randomUUID();
  }
  options = options || {};
  const rnds = options.random || (options.rng || rng)();
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  if (buf) {
    offset = offset || 0;
    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }
    return buf;
  }
  return unsafeStringify(rnds);
}
const RadialProgressBarLer_vue_vue_type_style_index_0_lang = "";
const _sfc_main$1 = {
  props: {
    diameter: {
      type: Number,
      required: false,
      default: 200
    },
    totalSteps: {
      type: Number,
      required: true,
      default: 10
    },
    completedSteps: {
      type: Number,
      required: true,
      default: 0
    },
    startColor: {
      type: String,
      required: false,
      default: "#bbff42"
    },
    stopColor: {
      type: String,
      required: false,
      default: "#429321"
    },
    strokeWidth: {
      type: Number,
      required: false,
      default: 10
    },
    innerStrokeWidth: {
      type: Number,
      required: false,
      default: 10
    },
    strokeLinecap: {
      type: String,
      required: false,
      default: "round"
    },
    animateSpeed: {
      type: Number,
      required: false,
      default: 1e3
    },
    innerStrokeColor: {
      type: String,
      required: false,
      default: "#323232"
    },
    fps: {
      type: Number,
      required: false,
      default: 60
    },
    timingFunc: {
      type: String,
      required: false,
      default: "linear"
    },
    isClockwise: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data() {
    return {
      id: v4(),
      gradient: {
        fx: 0.99,
        fy: 0.5,
        cx: 0.5,
        cy: 0.5,
        r: 0.65
      },
      gradientAnimation: null,
      currentAngle: 0,
      strokeDashoffset: 0
    };
  },
  computed: {
    radius() {
      return this.diameter / 2;
    },
    circumference() {
      return Math.PI * this.innerCircleDiameter;
    },
    stepSize() {
      if (this.totalSteps === 0) {
        return 0;
      }
      return 100 / this.totalSteps;
    },
    finishedPercentage() {
      return this.stepSize * this.completedSteps;
    },
    circleSlice() {
      return 2 * Math.PI / this.totalSteps;
    },
    animateSlice() {
      return this.circleSlice / this.totalPoints;
    },
    innerCircleDiameter() {
      return this.diameter - this.innerStrokeWidth * 2;
    },
    innerCircleRadius() {
      return this.innerCircleDiameter / 2;
    },
    totalPoints() {
      return this.animateSpeed / this.animationIncrements;
    },
    animationIncrements() {
      return 1e3 / this.fps;
    },
    hasGradient() {
      return this.startColor !== this.stopColor;
    },
    containerStyle() {
      return {
        height: `${this.diameter}px`,
        width: `${this.diameter}px`
      };
    },
    progressStyle() {
      return {
        height: `${this.diameter}px`,
        width: `${this.diameter}px`,
        strokeWidth: `${this.strokeWidth}px`,
        strokeDashoffset: this.strokeDashoffset,
        transition: `stroke-dashoffset ${this.animateSpeed}ms ${this.timingFunc}`
      };
    },
    strokeStyle() {
      return {
        height: `${this.diameter}px`,
        width: `${this.diameter}px`,
        strokeWidth: `${this.innerStrokeWidth}px`
      };
    },
    innerCircleStyle() {
      return {
        width: `${this.innerCircleDiameter}px`
      };
    }
  },
  watch: {
    totalSteps() {
      this.changeProgress({ isAnimate: true });
    },
    completedSteps() {
      this.changeProgress({ isAnimate: true });
    },
    diameter() {
      this.changeProgress({ isAnimate: true });
    },
    strokeWidth() {
      this.changeProgress({ isAnimate: true });
    }
  },
  created() {
    this.changeProgress({ isAnimate: false });
  },
  methods: {
    getStopPointsOfCircle(steps) {
      const points = [];
      for (let i = 0; i < steps; i++) {
        const angle = this.circleSlice * i;
        points.push(this.getPointOfCircle(angle));
      }
      return points;
    },
    getPointOfCircle(angle) {
      const radius = 0.5;
      const x = radius + radius * Math.cos(angle);
      const y = radius + radius * Math.sin(angle);
      return { x, y };
    },
    gotoPoint() {
      const point = this.getPointOfCircle(this.currentAngle);
      if (point.x && point.y) {
        this.gradient.fx = point.x;
        this.gradient.fy = point.y;
      }
    },
    direction() {
      if (this.isClockwise) {
        return 1;
      }
      return -1;
    },
    changeProgress({ isAnimate = true }) {
      this.strokeDashoffset = (100 - this.finishedPercentage) / 100 * this.circumference * this.direction();
      if (this.gradientAnimation) {
        clearInterval(this.gradientAnimation);
      }
      if (!isAnimate) {
        this.gotoNextStep();
        return;
      }
      const angleOffset = (this.completedSteps - 1) * this.circleSlice;
      let i = (this.currentAngle - angleOffset) / this.animateSlice;
      const incrementer = Math.abs(i - this.totalPoints) / this.totalPoints;
      const isMoveForward = i < this.totalPoints;
      this.gradientAnimation = setInterval(() => {
        if (isMoveForward && i >= this.totalPoints || !isMoveForward && i < this.totalPoints) {
          clearInterval(this.gradientAnimation);
          return;
        }
        this.currentAngle = angleOffset + this.animateSlice * i;
        this.gotoPoint();
        i += isMoveForward ? incrementer : -incrementer;
      }, this.animationIncrements);
    },
    gotoNextStep() {
      this.currentAngle = this.completedSteps * this.circleSlice;
      this.gotoPoint();
    }
  }
};
const _hoisted_1$1 = ["width", "height"];
const _hoisted_2$1 = ["id", "fx", "fy", "cx", "cy", "r"];
const _hoisted_3$1 = ["stop-color"];
const _hoisted_4$1 = ["stop-color"];
const _hoisted_5$1 = ["r", "cx", "cy", "stroke", "stroke-dasharray", "stroke-linecap"];
const _hoisted_6$1 = ["transform", "r", "cx", "cy", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap"];
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: "radial-progress-container",
    style: normalizeStyle($options.containerStyle)
  }, [
    createBaseVNode("div", {
      class: "radial-progress-inner",
      style: normalizeStyle($options.innerCircleStyle)
    }, [
      renderSlot(_ctx.$slots, "default")
    ], 4),
    (openBlock(), createElementBlock("svg", {
      class: "radial-progress-bar",
      width: $props.diameter,
      height: $props.diameter,
      version: "1.1",
      xmlns: "http://www.w3.org/2000/svg"
    }, [
      createBaseVNode("defs", null, [
        createBaseVNode("radialGradient", {
          id: "radial-gradient" + $data.id,
          fx: $data.gradient.fx,
          fy: $data.gradient.fy,
          cx: $data.gradient.cx,
          cy: $data.gradient.cy,
          r: $data.gradient.r
        }, [
          createBaseVNode("stop", {
            offset: "30%",
            "stop-color": $props.startColor
          }, null, 8, _hoisted_3$1),
          createBaseVNode("stop", {
            offset: "100%",
            "stop-color": $props.stopColor
          }, null, 8, _hoisted_4$1)
        ], 8, _hoisted_2$1)
      ]),
      createBaseVNode("circle", {
        r: $options.innerCircleRadius,
        cx: $options.radius,
        cy: $options.radius,
        fill: "transparent",
        stroke: $props.innerStrokeColor,
        "stroke-dasharray": $options.circumference,
        "stroke-dashoffset": "0",
        "stroke-linecap": $props.strokeLinecap,
        style: normalizeStyle($options.strokeStyle)
      }, null, 12, _hoisted_5$1),
      createBaseVNode("circle", {
        transform: "rotate(270, " + $options.radius + "," + $options.radius + ")",
        r: $options.innerCircleRadius,
        cx: $options.radius,
        cy: $options.radius,
        fill: "transparent",
        stroke: "url(#radial-gradient" + $data.id + ")",
        "stroke-dasharray": $options.circumference,
        "stroke-dashoffset": $options.circumference,
        "stroke-linecap": $props.strokeLinecap,
        style: normalizeStyle($options.progressStyle)
      }, null, 12, _hoisted_6$1)
    ], 8, _hoisted_1$1))
  ], 4);
}
const RadialProgressBarLer = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1]]);
const PlayView_vue_vue_type_style_index_0_lang = "";
const _sfc_main = {
  components: {
    ConfirmDialogue,
    LerHeart,
    RadialProgressBarLer,
    QuizQuestion,
    LerCoin
  },
  props: {
    autoStart: {
      type: Boolean,
      required: false
    }
  },
  data() {
    return {
      currentState: kAppStates.INITIALIZATION,
      kAppStates,
      kWindowNames,
      user: {},
      livesRefillIn: null,
      step: 0,
      errorMessage: null,
      activeSelectedOption: null,
      activeQuiz: null,
      answerPopularDeadline: null,
      step2hideDeadline: null,
      kTriggers,
      acceptChallengeInProgress: false
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
    window.main.trackEvent(kMetrics.PlayScreen_ViewOpened, {});
    const { remoteLog } = window.main;
    this._eventListener = (eventName, eventValue) => {
      remoteLog("_eventListener", eventName, eventValue, Date.now());
      switch (eventName) {
        case kEventKeys.UPDATE_TO_STATE:
          console.log(
            `_eventListener stateUpdated ${eventName}: ${eventValue}`
          );
          break;
        case kEventKeys.STORE_DATA_UPDATE:
          console.log(
            `_eventListener dataUpdated ${eventName}: ${eventValue && JSON.stringify(eventValue)}`
          );
          this.updateData();
          break;
        default:
          console.log(`_eventListener unhandled event: ${eventName}`);
          break;
      }
    };
    this._eventListenerBound = this._eventListener.bind(this);
    const { owEventBus, setState, stateHolderService } = overwolf.windows.getMainWindow();
    this.setState = setState;
    this.owEventBus = owEventBus;
    this.stateHolderService = stateHolderService;
    const curState = this.stateHolderService.get(kStores.STATE);
    this.updateData = () => {
      var _a;
      this.user = this.stateHolderService.get(kStores.USER);
      const clock = this.stateHolderService.get(kStores.CLOCK);
      this.livesRefillIn = ((_a = this.user) == null ? void 0 : _a.nextHeart) ? Number(this.user && this.user.nextHeart) - getGlobalTime() : 0;
      window.clock = clock;
    };
    this.updateToState = () => {
      this.errorMessage = null;
      this.updateData();
    };
    this.listenerKey = this.owEventBus.addOwnedListener(
      kEventOwners.desktopApp,
      this._eventListenerBound
    );
    this.updateToState(curState);
    if (this.autoStart && this.autoStart.toString() === "true") {
      if (this.user && this.user.hearts < 1) {
        console.log("Not enough hearts, suppressing autostart");
        return;
      }
      this.startQuizDesktop();
    }
  },
  unmounted() {
    const { remoteLog } = window.main;
    remoteLog("remove listener", Date.now());
    this.owEventBus.removeListener(this.listenerKey);
  },
  methods: {
    initState() {
      this.errorMessage = null;
      this.step = 1;
      this.activeSelectedOption = null;
      this.activeQuiz = null;
      this.answerPopularDeadline = null;
    },
    playAgain() {
      this.startQuizDesktop();
    },
    async startQuizDesktop() {
      if (this.acceptChallengeInProgress) {
        console.log(
          `${this.TAG} _acceptChallenge ignore action, already in progress;`
        );
        return;
      }
      if (this.user && this.user.hearts < 1) {
        console.log("Not enough hearts, stopping");
        return;
      }
      this.acceptChallengeInProgress = true;
      try {
        this.initState();
        this.activeQuiz = await window.main.acceptChallenge(
          kQuizType.REGULAR,
          true
        );
        if (!this.activeQuiz) {
          console.error(`${this.TAG} _acceptChallenge error no activeQuiz`);
          this.errorMessage = `An error occurred. Please try again later.`;
          if (!await window.main.getOnlineStatus()) {
            this.errorMessage = "No internet connection.";
          }
        }
      } catch (error) {
        console.error(`${this.TAG} _acceptChallenge error: `, error);
        this.errorMessage = `An error occurred. Please try again later.`;
        if (!await window.main.getOnlineStatus()) {
          this.errorMessage = "No internet connection.";
        }
      } finally {
        this.acceptChallengeInProgress = false;
      }
    },
    clock() {
      return window.getGlobalTime();
    },
    async answerChecked(answer, trigger) {
      console.log(`Selected answer: ${answer}`);
      try {
        switch (this.step) {
          case 1: {
            this.activeSelectedOption = answer;
            window.main.trackEvent(kMetrics.Question_AnswerSelected, {
              trigger,
              isDesktop: true,
              questionText: this.activeQuiz.question,
              secondsLeftOnCountDown: Math.round(
                (this.activeQuiz.answerDeadline - getGlobalTime()) / 1e3
              ),
              selectedAnswerText: this.activeQuiz.options[answer - 1]
            });
            this.activeQuiz.answerDeadline = null;
            this.activeQuiz.isAnswered = true;
            const res = await window.main.sendAnswer(
              this.activeQuiz._id,
              answer,
              trigger
            );
            if (!res) {
              this.errorMessage = "Failed to send answer";
              if (!await window.main.getOnlineStatus()) {
                this.errorMessage = "No internet connection.";
              }
              return;
            }
            try {
              this.activeQuiz.answerSentResponse = res;
              this.activeQuiz.bonusReward = Number(res.bonusReward);
              this.activeQuiz.coinsWinning = Number(res.reward);
              this.activeQuiz.selectedAnswer = Number(res.userAnswer);
              this.activeQuiz.correctAnswer = Number(res.correctAnswer);
              const self = this;
              setTimeout(() => {
                if (this.activeQuiz) {
                  self.step2hideDeadline = getGlobalTime() + 10 * 1e3;
                  self.step = 2;
                  window.main.trackEvent(
                    kMetrics.Question_CheckAnswer_ViewOpened,
                    {
                      trigger,
                      questionText: this.activeQuiz.question,
                      selectedAnswerText: this.activeQuiz.options[answer - 1],
                      isDesktop: true,
                      isAnsweredCorrectly: this.activeQuiz.selectedAnswer === this.activeQuiz.correctAnswer,
                      numberOfCoinsRewarded: this.activeQuiz.coinsWinning
                    }
                  );
                }
              }, kConsts.durationMs.beforeStep2);
            } catch (e) {
              console.error(`answerChecked catched error`, e);
            }
            break;
          }
          case 2:
            this.step2hideDeadline = null;
            console.log(
              `answerChecked - unhandled state, at step ${this.step}`
            );
            this.setState(kAppStates.IN_GAME_HIDDEN);
            break;
          case 3: {
            this.answerPopularDeadline = null;
            this.activeQuiz.selectedPopular = Number(answer);
            await window.main.sendPopularAnswer(
              this.activeQuiz._id,
              answer,
              trigger
            );
            this.step = 4;
            this.step4Deadline = getGlobalTime() + kConsts.durationMs.step4;
            break;
          }
          case 4:
            console.log(
              `answerChecked - unhandled state, at step ${this.step}`
            );
            break;
          default:
            console.log(
              `answerChecked - unhandled state, at step ${this.step}`
            );
            break;
        }
      } catch (error) {
        console.error(`${this.TAG} answerChecked error: `, error);
        this.errorMessage = `An error occurred. Please try again later.`;
        if (!await window.main.getOnlineStatus()) {
          this.errorMessage = "No internet connection.";
        }
      }
    },
    async onCountdownEnd() {
      try {
        switch (this.step) {
          case 1:
            this.answerChecked(0, kTriggers.COUNTDOWN_END);
            break;
          case 2:
            this.setState(kAppStates.IN_GAME_HIDDEN, kTriggers.COUNTDOWN_END);
            break;
          case 3:
            this.answerChecked(0, kTriggers.COUNTDOWN_END);
            break;
          case 4:
            this.activeQuiz = null;
            if (this.currentState === kAppStates.IN_NO_EVENTS_GAME_QUESTION) {
              this.setState(kAppStates.IN_NO_EVENTS_GAME_RETRY_PENDING);
            } else {
              this.setState(kAppStates.IN_GAME_HIDDEN);
            }
            break;
        }
      } catch (error) {
        console.error(`${this.TAG} onCountdownEnd error: `, error);
        this.errorMessage = `An error occurred. Please try again later.`;
        if (!await window.main.getOnlineStatus()) {
          this.errorMessage = "No internet connection.";
        }
      }
    }
  }
};
const _hoisted_1 = { class: "padLeft22px" };
const _hoisted_2 = /* @__PURE__ */ createBaseVNode("div", { class: "flex-row padBot10 playTitle" }, "Play trivia", -1);
const _hoisted_3 = {
  key: 0,
  class: "flex-row width100"
};
const _hoisted_4 = { class: "width100 option-row d-flex flex-column" };
const _hoisted_5 = {
  class: "width100 suggestion-text smaller-text flex-row",
  style: { "font-size": "18px" }
};
const _hoisted_6 = { class: "flex-row width100 padTop8" };
const _hoisted_7 = {
  key: 1,
  class: "error-state flex-row width100"
};
const _hoisted_8 = { class: "error-message-text" };
const _hoisted_9 = { class: "flex-row justify-center" };
const _hoisted_10 = {
  key: 0,
  class: "flex-row padTop40",
  style: { "width": "450px" }
};
const _hoisted_11 = { class: "flex flex-column width100" };
const _hoisted_12 = { class: "flex-row justify-center" };
const _hoisted_13 = /* @__PURE__ */ createBaseVNode("div", { class: "flex-row justify-center padVert20" }, "or", -1);
const _hoisted_14 = /* @__PURE__ */ createBaseVNode("div", { class: "flex-row justify-center" }, [
  /* @__PURE__ */ createBaseVNode("span", { style: { "text-align": "center", "margin-right": "22px", "padding": "8px", "width": "320px", "border-radius": "4px", "border-style": "solid", "border-width": "2px", "border-color": "#6723b2" } }, " Start your favorite game and we'll suggest you a trivia during idle times. ")
], -1);
const _hoisted_15 = {
  key: 1,
  class: "width100"
};
const _hoisted_16 = { key: 0 };
const _hoisted_17 = { class: "width100" };
const _hoisted_18 = /* @__PURE__ */ createBaseVNode("span", { class: "radial-counter-bg" }, null, -1);
const _hoisted_19 = { class: "radial-counter-timeleft-label" };
const _hoisted_20 = /* @__PURE__ */ createBaseVNode("span", { class: "radial-counter-unit-label" }, "seconds", -1);
const _hoisted_21 = {
  key: 1,
  class: "error-message-text"
};
const _hoisted_22 = { key: 1 };
const _hoisted_23 = { class: "resultBoxWrap step2Box" };
const _hoisted_24 = { key: 0 };
const _hoisted_25 = /* @__PURE__ */ createBaseVNode("div", { class: "step2ResultBox step2TitlePadding" }, "Good job!", -1);
const _hoisted_26 = { class: "step2ResultBox flex-row" };
const _hoisted_27 = { class: "padLeft4" };
const _hoisted_28 = /* @__PURE__ */ createBaseVNode("div", { class: "step2GrayLbl" }, " Collect your coins in the `collect rewards` screen ", -1);
const _hoisted_29 = { key: 1 };
const _hoisted_30 = /* @__PURE__ */ createBaseVNode("div", { class: "step2ResultBox" }, [
  /* @__PURE__ */ createBaseVNode("div", { class: "wrong-box-front" }, [
    /* @__PURE__ */ createBaseVNode("div", { class: "education-icon" }),
    /* @__PURE__ */ createBaseVNode("div", { class: "box-text" }, " Wrong answers are lessons learned! To help you learn, we\u2019ll quiz you on this again in the future ")
  ])
], -1);
const _hoisted_31 = [
  _hoisted_30
];
const _hoisted_32 = { class: "flex-row justify-center" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_confirm_dialogue = resolveComponent("confirm-dialogue");
  const _component_LerHeart = resolveComponent("LerHeart");
  const _component_vue_countdown = resolveComponent("vue-countdown");
  const _component_RouterLink = resolveComponent("RouterLink");
  const _component_QuizQuestion = resolveComponent("QuizQuestion");
  const _component_RadialProgressBarLer = resolveComponent("RadialProgressBarLer");
  const _component_LerCoin = resolveComponent("LerCoin");
  return openBlock(), createElementBlock("div", _hoisted_1, [
    createVNode(_component_confirm_dialogue, { ref: "confirmDialogue" }, null, 512),
    _hoisted_2,
    !$data.activeQuiz && $data.user && $data.user.hearts < 1 ? (openBlock(), createElementBlock("div", _hoisted_3, [
      createBaseVNode("span", _hoisted_4, [
        createBaseVNode("span", _hoisted_5, [
          createTextVNode(" Cannot start trivia, "),
          createVNode(_component_LerHeart, { class: "heart-padding-playview" }),
          createTextVNode("0 left "),
          createVNode(_component_vue_countdown, { time: $data.livesRefillIn }, {
            default: withCtx(({ hours, minutes }) => [
              createTextVNode(" \xA0| " + toDisplayString(hours) + "h " + toDisplayString(minutes) + "m to refill\xA0", 1)
            ]),
            _: 1
          }, 8, ["time"])
        ]),
        createBaseVNode("span", _hoisted_6, [
          createTextVNode(" To play immediately you can purchase hearts at the\xA0"),
          createVNode(_component_RouterLink, { to: "/store/" }, {
            default: withCtx(() => [
              createTextVNode("Store")
            ]),
            _: 1
          }),
          createTextVNode(". ")
        ])
      ])
    ])) : createCommentVNode("", true),
    $data.errorMessage ? (openBlock(), createElementBlock("div", _hoisted_7, [
      createBaseVNode("div", _hoisted_8, toDisplayString($data.errorMessage), 1)
    ])) : createCommentVNode("", true),
    createBaseVNode("div", _hoisted_9, [
      !$data.activeQuiz && $data.step === 0 ? (openBlock(), createElementBlock("div", _hoisted_10, [
        createBaseVNode("div", _hoisted_11, [
          createBaseVNode("div", _hoisted_12, [
            createBaseVNode("button", {
              class: normalizeClass(["btn-start-now btn-main-cta", { "disabled-btn": $data.user.hearts < 1 }]),
              onClick: _cache[0] || (_cache[0] = (...args) => $options.startQuizDesktop && $options.startQuizDesktop(...args))
            }, " Play now ", 2)
          ]),
          _hoisted_13,
          _hoisted_14
        ])
      ])) : createCommentVNode("", true),
      $data.activeQuiz ? (openBlock(), createElementBlock("div", _hoisted_15, [
        $data.step === 1 ? (openBlock(), createElementBlock("div", _hoisted_16, [
          !!$data.activeQuiz ? (openBlock(), createBlock(_component_QuizQuestion, {
            key: 0,
            "quiz-question-object": $data.activeQuiz,
            "allow-picking-answer": true,
            "active-selected-answer": $data.activeSelectedOption,
            onAnswerSelected: $options.answerChecked
          }, null, 8, ["quiz-question-object", "active-selected-answer", "onAnswerSelected"])) : createCommentVNode("", true),
          createBaseVNode("div", _hoisted_17, [
            $data.activeQuiz && !$data.activeQuiz.isAnswered && $data.activeQuiz.answerDeadline && $data.activeQuiz.answerDeadline ? (openBlock(), createBlock(_component_vue_countdown, {
              key: 0,
              interval: 1e3,
              time: $data.activeQuiz.answerDeadline - $options.clock(),
              class: "",
              style: { "position": "relative", "margin-left": "auto", "margin-right": "auto" },
              onEnd: $options.onCountdownEnd
            }, {
              default: withCtx(({ totalSeconds }) => [
                _hoisted_18,
                createBaseVNode("span", _hoisted_19, toDisplayString(totalSeconds), 1),
                _hoisted_20,
                createVNode(_component_RadialProgressBarLer, {
                  class: "margin-side-auto",
                  diameter: 220,
                  "completed-steps": totalSeconds,
                  "total-steps": $data.activeQuiz.answerDeadlineTotalSeconds,
                  "is-clockwise": true,
                  "start-color": "#FF51E5",
                  "stop-color": "#FF51E5",
                  "inner-stroke-color": "#4E083C",
                  "stroke-width": 10,
                  "inner-stroke-width": 10,
                  "stroke-linecap": "round",
                  "animate-speed": 1e3
                }, null, 8, ["completed-steps", "total-steps"])
              ]),
              _: 1
            }, 8, ["time", "onEnd"])) : createCommentVNode("", true)
          ]),
          !$data.activeQuiz ? (openBlock(), createElementBlock("div", _hoisted_21, " An error occured while presenting the question. Please try again. ")) : createCommentVNode("", true)
        ])) : $data.step === 2 ? (openBlock(), createElementBlock("div", _hoisted_22, [
          !!$data.activeQuiz ? (openBlock(), createBlock(_component_QuizQuestion, {
            key: 0,
            "quiz-question-object": $data.activeQuiz,
            "allow-picking-answer": false,
            "selected-answer": $data.activeQuiz.selectedAnswer,
            "correct-answer": $data.activeQuiz.correctAnswer,
            onAnswerSelected: $options.answerChecked
          }, null, 8, ["quiz-question-object", "selected-answer", "correct-answer", "onAnswerSelected"])) : createCommentVNode("", true),
          createBaseVNode("div", _hoisted_23, [
            $data.activeQuiz && $data.activeQuiz.coinsWinning ? (openBlock(), createElementBlock("span", _hoisted_24, [
              _hoisted_25,
              createBaseVNode("div", _hoisted_26, [
                createTextVNode(" You've earned "),
                createVNode(_component_LerCoin, { class: "earned-coin padLeft4" }),
                createBaseVNode("span", _hoisted_27, toDisplayString($data.activeQuiz.coinsWinning), 1)
              ]),
              _hoisted_28
            ])) : (openBlock(), createElementBlock("span", _hoisted_29, _hoisted_31))
          ]),
          createBaseVNode("div", _hoisted_32, [
            createBaseVNode("div", {
              class: "btn-secondary-cta suggestion-sec",
              onClick: _cache[1] || (_cache[1] = ($event) => $options.playAgain())
            }, " Play again ")
          ])
        ])) : createCommentVNode("", true)
      ])) : createCommentVNode("", true)
    ])
  ]);
}
const PlayView = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export {
  PlayView as default
};
