import { _ as _export_sfc, L as LerCoin, K as AsyncButton, U as UtilsService, k as kStores, H as kMetrics, v as resolveComponent, o as openBlock, c as createElementBlock, a as createBaseVNode, b as createCommentVNode, n as normalizeClass, D as normalizeStyle, t as toDisplayString, h as createVNode, J as createTextVNode, w as withCtx, M as Countdown, i as createBlock, F as Fragment, d as renderList, N as v4, O as filter, P as groupBy, Q as each, R as sortBy } from "./index.45e9362d.js";
const StoreItem_vue_vue_type_style_index_0_lang = "";
const _sfc_main$2 = {
  components: { LerCoin, AsyncButton },
  props: {
    onPricesChange: Function,
    storeItem: Object,
    loadingState: Boolean,
    focusedList: Boolean,
    myTicketsCount: Object
  },
  data() {
    return {
      updatedMyTicketsCount: null
    };
  },
  watch: {
    myTicketsCount: {
      handler: function(newVal, oldVal) {
        console.log("hand");
        if (newVal !== oldVal) {
          this.updatedMyTicketsCount = newVal;
          this.updatePrice();
        }
      },
      deep: true
    }
  },
  async mounted() {
    var _a, _b, _c;
    this.storeItem.origPrice = this.storeItem.price;
    await this.updatePrice();
    this.storeItem.price = (_b = (_a = this.storeItem) == null ? void 0 : _a.expectedPrice) == null ? void 0 : _b.toLocaleString();
    this.storeItem.imageUrl = UtilsService.replaceAssetPathToAbsoluteLocalPath(
      this.storeItem.imageUrl
    );
    if ((_c = this.storeItem.extraData) == null ? void 0 : _c.rewardImageUrl) {
      this.storeItem.extraData.rewardImageUrl = UtilsService.replaceAssetPathToAbsoluteLocalPath(
        this.storeItem.extraData.rewardImageUrl
      );
    }
  },
  methods: {
    async updatePrice() {
      var _a, _b;
      console.log("updatePrice");
      const getUpdatedPriceForTickets = (inTicketPrice, ticketsCount2) => {
        var _a2, _b2;
        let ticketPrice = Number(inTicketPrice);
        const factor = ((_b2 = (_a2 = window.main) == null ? void 0 : _a2.getVars()) == null ? void 0 : _b2.ticketPriceFactor) || 1.25;
        ticketPrice = Math.floor(ticketPrice * Math.pow(factor, ticketsCount2));
        return ticketPrice;
      };
      const raffleId = this.storeItem.awardReference;
      const ticketsCount = (this.updatedMyTicketsCount || this.myTicketsCount || {})[raffleId] || 0;
      this.storeItem.expectedPrice = getUpdatedPriceForTickets(
        this.storeItem.origPrice,
        ticketsCount
      );
      this.storeItem.price = (_b = (_a = this.storeItem) == null ? void 0 : _a.expectedPrice) == null ? void 0 : _b.toLocaleString();
    },
    async buy() {
      var _a, _b;
      const { stateHolderService } = overwolf.windows.getMainWindow();
      const user = stateHolderService.get(kStores.USER);
      if (!(user == null ? void 0 : user.isEmailVerified)) {
        stateHolderService.set(kStores.MODAL_STATE, true);
        stateHolderService.set(
          kStores.ERROR_MESSAGE,
          "User verification is required"
        );
        return;
      }
      if (((_a = this.storeItem.awardType) == null ? void 0 : _a.toLowerCase()) === "heart") {
        if (user) {
          const maxHearts = user.maxHearts;
          const hearts = user.hearts;
          if (hearts + this.storeItem.awardAmount > maxHearts) {
            stateHolderService.set(
              kStores.ERROR_MESSAGE,
              `Can't purchase ${this.storeItem.title} as the limit is ${maxHearts}`
            );
            return;
          }
        }
      }
      window.main.trackEvent(kMetrics.Store_BuyTicket_Clicked, {
        storeItemId: this.storeItem._id,
        price: this.storeItem.expectedPrice,
        title: this.storeItem.title,
        awardType: this.storeItem.awardType,
        awardReference: this.storeItem.awardReference
      });
      const buyStoreItemResponse = await window.main.buyStoreItem(
        this.storeItem._id,
        this.storeItem.expectedPrice
      );
      if (buyStoreItemResponse) {
        stateHolderService.set(
          kStores.ERROR_MESSAGE,
          ((_b = buyStoreItemResponse.data) == null ? void 0 : _b.errorMessage) || buyStoreItemResponse.errorMessage
        );
        this.updatedMyTicketsCount = await window.main.getMyTicketsCount() || {};
        await this.updatePrice();
        if (this.onPricesChange) {
          this.onPricesChange();
        }
      }
      return buyStoreItemResponse;
    }
  }
};
const _hoisted_1$2 = ["src", "alt"];
const _hoisted_2$1 = { class: "flex-row justify-center discount-label-placeholder" };
const _hoisted_3$1 = {
  key: 0,
  class: "discount-label flex-row justify-center"
};
const _hoisted_4 = { class: "title" };
const _hoisted_5 = { class: "price-label" };
const _hoisted_6 = { class: "flex-row justify-center" };
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
  var _a, _b, _c;
  const _component_LerCoin = resolveComponent("LerCoin");
  const _component_AsyncButton = resolveComponent("AsyncButton");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["d-flex flex-column store-item-wrap", {
      "store-item-wrap-loading-state": $props.loadingState,
      "focused-anim": $props.focusedList
    }])
  }, [
    createBaseVNode("div", {
      class: normalizeClass(["store-item-gray-bg margin-side-auto flex-row justify-center", (_a = $props.storeItem.awardType) == null ? void 0 : _a.toLowerCase()]),
      style: normalizeStyle({
        "background-image": ((_b = $props.storeItem.extraData) == null ? void 0 : _b.rewardImageUrl) ? `url(${(_c = $props.storeItem.extraData) == null ? void 0 : _c.rewardImageUrl})` : "none"
      })
    }, [
      $props.storeItem.imageUrl ? (openBlock(), createElementBlock("img", {
        key: 0,
        src: $props.storeItem.imageUrl,
        alt: $props.storeItem.title
      }, null, 8, _hoisted_1$2)) : createCommentVNode("", true)
    ], 6),
    createBaseVNode("div", _hoisted_2$1, [
      $props.storeItem.discountText ? (openBlock(), createElementBlock("div", _hoisted_3$1, toDisplayString($props.storeItem.discountText), 1)) : createCommentVNode("", true)
    ]),
    createBaseVNode("div", _hoisted_4, toDisplayString($props.storeItem.title), 1),
    createBaseVNode("div", _hoisted_5, [
      createVNode(_component_LerCoin, { class: "small-coin" }),
      createTextVNode(" " + toDisplayString($props.storeItem.price), 1)
    ]),
    createBaseVNode("div", _hoisted_6, [
      createVNode(_component_AsyncButton, {
        class: "btn-buy-tickets btn-main-cta",
        "on-clicked": $options.buy
      }, {
        default: withCtx(() => {
          var _a2, _b2;
          return [
            createTextVNode(toDisplayString(((_a2 = $props.storeItem.awardType) == null ? void 0 : _a2.toLowerCase()) === "heart" ? `ADD ${(_b2 = $props.storeItem.title) == null ? void 0 : _b2.toUpperCase()}` : "GET NOW"), 1)
          ];
        }),
        _: 1
      }, 8, ["on-clicked"])
    ])
  ], 2);
}
const StoreItem = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2]]);
const StoreHorizontalList_vue_vue_type_style_index_0_scoped_10b2741e_lang = "";
const _sfc_main$1 = {
  components: { Countdown, StoreItem },
  props: {
    onPricesChange: Function,
    myTicketsCount: Object,
    storeItems: Array,
    loadingState: Boolean,
    focusedList: Boolean
  }
};
const _hoisted_1$1 = { key: 0 };
const _hoisted_2 = { class: "flex-row justify-space-between padLeft22 top-row-height" };
const _hoisted_3 = { class: "flex-row justify-space-between padLeft22" };
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  var _a, _b, _c, _d, _e;
  const _component_Countdown = resolveComponent("Countdown");
  const _component_StoreItem = resolveComponent("StoreItem");
  return $props.storeItems && $props.storeItems.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_1$1, [
    createBaseVNode("div", _hoisted_2, [
      createBaseVNode("div", {
        class: normalizeClass(["category-title screen-title", { "category-title-loading-state": $props.loadingState }])
      }, toDisplayString((_a = $props.storeItems[0]) == null ? void 0 : _a.category), 3),
      createBaseVNode("div", {
        class: normalizeClass({ "cd-loading-state": $props.loadingState })
      }, [
        ((_c = (_b = $props.storeItems[0]) == null ? void 0 : _b.extraData) == null ? void 0 : _c.drawTime) ? (openBlock(), createBlock(_component_Countdown, {
          key: 0,
          "size-class-name": "drawing-box-size-store-item",
          "until-when": (_e = (_d = $props.storeItems[0]) == null ? void 0 : _d.extraData) == null ? void 0 : _e.drawTime
        }, null, 8, ["until-when"])) : createCommentVNode("", true)
      ], 2)
    ]),
    createBaseVNode("div", _hoisted_3, [
      (openBlock(true), createElementBlock(Fragment, null, renderList($props.storeItems, (storeItem) => {
        return openBlock(), createBlock(_component_StoreItem, {
          key: storeItem._id,
          "store-item": storeItem,
          "loading-state": $props.loadingState,
          "focused-list": $props.focusedList,
          "my-tickets-count": $props.myTicketsCount,
          "on-prices-change": $props.onPricesChange
        }, null, 8, ["store-item", "loading-state", "focused-list", "my-tickets-count", "on-prices-change"]);
      }), 128))
    ])
  ])) : createCommentVNode("", true);
}
const StoreHorizontalList = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__scopeId", "data-v-10b2741e"]]);
const StoreView_vue_vue_type_style_index_0_lang = "";
const _sfc_main = {
  components: { StoreHorizontalList },
  data() {
    return {
      loading: true,
      loadingStartTime: null,
      loadingItems: [
        {
          _id: v4(),
          category: "Consectetur adipiscing elit",
          price: 9999,
          title: "Loading...",
          awardType: "RaffleTicket",
          imageUrl: "./../assets/store-t-1.png",
          awardAmount: 1
        },
        {
          _id: v4(),
          category: "Consectetur adipiscing elit",
          price: 9999,
          title: "Loading...",
          awardType: "RaffleTicket",
          imageUrl: "./../assets/store-t-2.png",
          awardAmount: 3
        },
        {
          _id: v4(),
          category: "Consectetur adipiscing elit",
          price: 9999,
          title: "Loading...",
          awardType: "RaffleTicket",
          imageUrl: "./../assets/store-t-3.png",
          awardAmount: 5
        },
        {
          _id: v4(),
          category: "Lorem ipsum dolor sit amet",
          price: 9999,
          title: "Loading...",
          awardType: "RaffleTicket",
          imageUrl: "./../assets/store-t-1.png",
          awardAmount: 1
        },
        {
          _id: v4(),
          category: "Lorem ipsum dolor sit amet",
          price: 9999,
          title: "Loading...",
          awardType: "RaffleTicket",
          imageUrl: "./../assets/store-t-2.png",
          awardAmount: 3
        },
        {
          _id: v4(),
          category: "Lorem ipsum dolor sit amet",
          price: 9999,
          title: "Loading...",
          awardType: "RaffleTicket",
          imageUrl: "./../assets/store-t-3.png",
          awardAmount: 5
        },
        {
          _id: v4(),
          category: "Sed do eiusmod tempor incididunt",
          price: 9999,
          title: "Loading...",
          awardType: "RaffleTicket",
          imageUrl: "./../assets/store-t-1.png",
          awardAmount: 1
        },
        {
          _id: v4(),
          category: "Sed do eiusmod tempor incididunt",
          price: 9999,
          title: "Loading...",
          awardType: "RaffleTicket",
          imageUrl: "./../assets/store-t-2.png",
          awardAmount: 3
        },
        {
          _id: v4(),
          category: "Sed do eiusmod tempor incididunt",
          price: 9999,
          title: "Loading...",
          awardType: "RaffleTicket",
          imageUrl: "./../assets/store-t-3.png",
          awardAmount: 5
        }
      ],
      storeItemsHorizontalLists: [],
      focusedItemIndex: null,
      perRaffleMyTicketsCount: null
    };
  },
  async created() {
    this.init();
    const storeItemsList = await window.main.getStore();
    this.perRaffleMyTicketsCount = await window.main.getMyTicketsCount() || {};
    window.main.trackEvent(kMetrics.Store_ViewOpened, {});
    this.processDataItems(storeItemsList);
    await this.toggleLoadingOff();
  },
  methods: {
    async onPricesChange() {
      this.perRaffleMyTicketsCount = await window.main.getMyTicketsCount() || {};
    },
    init() {
      this.loading = true;
      this.loadingStartTime = Date.now();
      this.processDataItems(this.loadingItems);
    },
    scrollToElement(itemIdToScrollTo) {
      try {
        const itemIndex = this.storeItemsHorizontalLists.findIndex(
          (item) => {
            var _a;
            return ((_a = item.storeItems[0]) == null ? void 0 : _a.awardReference) === itemIdToScrollTo;
          }
        );
        this.focusedItemIndex = itemIndex;
        const el = this.$el.getElementsByClassName("cStoreHorizontalList")[itemIndex];
        if (el) {
          el.scrollIntoView(true);
          const yourHeight = 25;
          const scrolledY = window.scrollY;
          if (scrolledY) {
            window.scroll(0, scrolledY - yourHeight);
          }
        }
      } catch (err) {
        console.error(`Scrolling Store view error: `, err);
      }
    },
    async toggleLoadingOff() {
      setTimeout(async () => {
        var _a, _b, _c, _d;
        await UtilsService.waitForLoadingToggleOff(this.loadingStartTime);
        this.loading = false;
        if ((_b = (_a = this.$route) == null ? void 0 : _a.params) == null ? void 0 : _b.itemId) {
          this.itemToFocusOn = (_d = (_c = this.$route) == null ? void 0 : _c.params) == null ? void 0 : _d.itemId;
          this.scrollToElement(this.itemToFocusOn);
        }
      }, 0);
    },
    processDataItems(storeItemsList) {
      this.storeItemsHorizontalLists = [];
      const filteredStoreItems = filter(
        storeItemsList,
        (x) => {
          var _a, _b;
          return !((_a = x.extraData) == null ? void 0 : _a.drawTime) || new Date((_b = x.extraData) == null ? void 0 : _b.drawTime).getTime() > getGlobalTime();
        }
      );
      const groupedStoreItems = groupBy(
        filteredStoreItems,
        (storeItem) => storeItem.category
      );
      each(groupedStoreItems, (e, k) => {
        if (e) {
          e = sortBy(e, (x) => x.price);
        }
        this.storeItemsHorizontalLists.push({ _id: k, storeItems: e });
      });
    }
  }
};
const _hoisted_1 = { class: "scrollable-list scrollable" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_StoreHorizontalList = resolveComponent("StoreHorizontalList");
  return openBlock(), createElementBlock("div", _hoisted_1, [
    (openBlock(true), createElementBlock(Fragment, null, renderList($data.storeItemsHorizontalLists, (storeItemsHorizontalList, index) => {
      return openBlock(), createBlock(_component_StoreHorizontalList, {
        key: storeItemsHorizontalList._id,
        class: normalizeClass(["cStoreHorizontalList", index === $data.focusedItemIndex ? "focused" : ""]),
        "store-items": storeItemsHorizontalList.storeItems,
        "loading-state": $data.loading,
        "focused-list": index === $data.focusedItemIndex,
        "my-tickets-count": $data.perRaffleMyTicketsCount,
        "on-prices-change": $options.onPricesChange
      }, null, 8, ["class", "store-items", "loading-state", "focused-list", "my-tickets-count", "on-prices-change"]);
    }), 128))
  ]);
}
const StoreView = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export {
  StoreView as default
};
