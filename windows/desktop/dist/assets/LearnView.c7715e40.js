import { _ as _export_sfc, H as kMetrics, o as openBlock, c as createElementBlock, a as createBaseVNode, F as Fragment, d as renderList, x as withDirectives, S as vShow, t as toDisplayString, n as normalizeClass, z as pushScopeId, B as popScopeId, l as hkCancel, h as createVNode, v as resolveComponent } from "./index.45e9362d.js";
const FaqList_vue_vue_type_style_index_0_scoped_dcf3a3c6_lang = "";
const _sfc_main$1 = {
  props: {},
  data() {
    return {
      loading: null,
      faqList: null,
      expandedIndex: null
    };
  },
  async mounted() {
    try {
      this.loading = true;
      const main = overwolf.windows.getMainWindow();
      this.faqList = await main.getFaq();
      this.loading = false;
    } catch (e) {
      console.error(e);
    }
  },
  methods: {
    toggleFaq(index, question) {
      if (this.expandedIndex !== index) {
        this.expandedIndex = index;
        window.main.trackEvent(kMetrics.Faq_Expanded, {
          question
        });
      } else {
        this.expandedIndex = null;
      }
    }
  }
};
const _withScopeId$1 = (n) => (pushScopeId("data-v-dcf3a3c6"), n = n(), popScopeId(), n);
const _hoisted_1$1 = ["onClick"];
const _hoisted_2$1 = { class: "exp" };
const _hoisted_3$1 = { class: "exp" };
const _hoisted_4$1 = { class: "faq-question" };
const _hoisted_5$1 = ["innerHTML"];
const _hoisted_6$1 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ createBaseVNode("div", { class: "height-spacer" }, null, -1));
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["wrapper-bg", { "wrapper-bg-loading-state": $data.loading }])
  }, [
    createBaseVNode("div", {
      class: normalizeClass(["wrapper", { "wrapper-loading-state": $data.loading }])
    }, [
      (openBlock(true), createElementBlock(Fragment, null, renderList($data.faqList, (faq, index) => {
        return openBlock(), createElementBlock("div", { key: index }, [
          createBaseVNode("div", {
            class: "flex-row",
            onClick: ($event) => $options.toggleFaq(index, faq.question)
          }, [
            withDirectives(createBaseVNode("div", _hoisted_2$1, "-", 512), [
              [vShow, $data.expandedIndex === index]
            ]),
            withDirectives(createBaseVNode("div", _hoisted_3$1, "+", 512), [
              [vShow, $data.expandedIndex !== index]
            ]),
            createBaseVNode("div", _hoisted_4$1, toDisplayString(index + 1) + ". " + toDisplayString(faq.question), 1)
          ], 8, _hoisted_1$1),
          withDirectives(createBaseVNode("div", {
            class: "faq-answer",
            innerHTML: _ctx.$sanitize(faq.answer)
          }, null, 8, _hoisted_5$1), [
            [vShow, $data.expandedIndex === index]
          ])
        ]);
      }), 128)),
      _hoisted_6$1
    ], 2)
  ], 2);
}
const FaqList = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__scopeId", "data-v-dcf3a3c6"]]);
const kLearn = [
  {
    title: "Put your knowledge to the test",
    message: "We are doing our best to find the right opportunity for a challenge, such as loading times, waiting in queues, postmortem spectating and more.<br><br><br>You can start the quiz immediately by hitting [%hkLbl%].",
    image: "./../static-assets/learn-ingame.png"
  },
  {
    title: "Collect coins for correct answers",
    message: "A higher level of questions difficulty has greater rewards.",
    image: "./../static-assets/learn-collect.png"
  },
  {
    title: "Buy raffle tickets",
    message: "Having more tickets increases your chances of winning.",
    image: "./../static-assets/learn-tickets.png"
  },
  {
    title: "Claim your prize",
    message: "When won a raffle - claim your prize in the Raffles screen.",
    image: "./../static-assets/learn-raffles.png"
  }
];
const LearnView_vue_vue_type_style_index_0_scoped_5bbabbd6_lang = "";
const _sfc_main = {
  components: { FaqList },
  data() {
    return {
      curSlide: 0,
      totalSlides: 4,
      steps: [],
      kLearn
    };
  },
  mounted() {
    window.main.trackEvent(kMetrics.Learn_ViewOpened, {});
  },
  async created() {
    const hkLbl = await window.hotkeysService.getHotkey(hkCancel);
    this.kLearn = this.kLearn.map((x) => {
      if (x.message) {
        x.message = x.message.replace("%hkLbl%", hkLbl);
      }
      return x;
    });
  }
};
const _withScopeId = (n) => (pushScopeId("data-v-5bbabbd6"), n = n(), popScopeId(), n);
const _hoisted_1 = { class: "learn scrollable" };
const _hoisted_2 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("div", { class: "padBot10 learntitle" }, "How to Learn & Earn", -1));
const _hoisted_3 = { class: "flex-column" };
const _hoisted_4 = { class: "flex-row slides-wrap" };
const _hoisted_5 = { class: "flex-column width100" };
const _hoisted_6 = { class: "flex-row slide-wrap" };
const _hoisted_7 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("div", { class: "bg-bubble" }, null, -1));
const _hoisted_8 = { class: "num-bubble" };
const _hoisted_9 = { class: "slide-title" };
const _hoisted_10 = ["innerHTML"];
const _hoisted_11 = { class: "learn-img" };
const _hoisted_12 = ["src"];
const _hoisted_13 = { class: "flex-row justify-center" };
const _hoisted_14 = ["onClick"];
const _hoisted_15 = { class: "flex-column faq-wrap" };
const _hoisted_16 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("div", { class: "flex-row width100 padBot10 learntitle" }, "F.A.Q.", -1));
const _hoisted_17 = { class: "flex-row width100" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_faq_list = resolveComponent("faq-list");
  return openBlock(), createElementBlock("div", _hoisted_1, [
    _hoisted_2,
    createBaseVNode("div", _hoisted_3, [
      createBaseVNode("div", _hoisted_4, [
        createBaseVNode("div", {
          class: normalizeClass([{ disabled: !($data.curSlide >= 1) }, "nav-arrow-prev clickable"]),
          onClick: _cache[0] || (_cache[0] = ($event) => $data.curSlide >= 1 ? $data.curSlide = $data.curSlide - 1 : null)
        }, null, 2),
        createBaseVNode("div", _hoisted_5, [
          createBaseVNode("div", _hoisted_6, [
            (openBlock(true), createElementBlock(Fragment, null, renderList($data.kLearn, (kSlide, kSlideIndex) => {
              return withDirectives((openBlock(), createElementBlock("div", {
                key: kSlideIndex,
                class: "relative border slide-content"
              }, [
                _hoisted_7,
                createBaseVNode("div", _hoisted_8, toDisplayString(kSlideIndex + 1), 1),
                createBaseVNode("div", _hoisted_9, toDisplayString($data.kLearn[kSlideIndex].title), 1),
                createBaseVNode("div", {
                  class: "slide-message",
                  innerHTML: _ctx.$sanitize($data.kLearn[kSlideIndex].message)
                }, null, 8, _hoisted_10),
                createBaseVNode("div", _hoisted_11, [
                  createBaseVNode("img", {
                    src: $data.kLearn[kSlideIndex].image
                  }, null, 8, _hoisted_12)
                ])
              ])), [
                [vShow, kSlideIndex === $data.curSlide]
              ]);
            }), 128))
          ]),
          createBaseVNode("div", _hoisted_13, [
            (openBlock(), createElementBlock(Fragment, null, renderList(4, (index) => {
              return createBaseVNode("div", {
                key: index,
                class: normalizeClass([$data.curSlide + 1 === index ? "n-page-selected" : "n-page", "d-flex clickable"]),
                style: { "padding-right": "4px" },
                onClick: ($event) => $data.curSlide = index - 1
              }, null, 10, _hoisted_14);
            }), 64))
          ])
        ]),
        createBaseVNode("div", {
          class: normalizeClass([{ disabled: !($data.curSlide < $data.totalSlides - 1) }, "nav-arrow-next clickable"]),
          onClick: _cache[1] || (_cache[1] = ($event) => $data.curSlide < $data.totalSlides - 1 ? $data.curSlide = $data.curSlide + 1 : null)
        }, null, 2)
      ]),
      createBaseVNode("div", _hoisted_15, [
        _hoisted_16,
        createBaseVNode("div", _hoisted_17, [
          createVNode(_component_faq_list)
        ])
      ])
    ])
  ]);
}
const LearnView = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-5bbabbd6"]]);
export {
  LearnView as default
};
