var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_index_ed96434e = __commonJS({
  "assets/index.ed96434e.js"(exports, module) {
    (function polyfill() {
      const relList = document.createElement("link").relList;
      if (relList && relList.supports && relList.supports("modulepreload")) {
        return;
      }
      for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
        processPreload(link);
      }
      new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.type !== "childList") {
            continue;
          }
          for (const node of mutation.addedNodes) {
            if (node.tagName === "LINK" && node.rel === "modulepreload")
              processPreload(node);
          }
        }
      }).observe(document, { childList: true, subtree: true });
      function getFetchOpts(script) {
        const fetchOpts = {};
        if (script.integrity)
          fetchOpts.integrity = script.integrity;
        if (script.referrerpolicy)
          fetchOpts.referrerPolicy = script.referrerpolicy;
        if (script.crossorigin === "use-credentials")
          fetchOpts.credentials = "include";
        else if (script.crossorigin === "anonymous")
          fetchOpts.credentials = "omit";
        else
          fetchOpts.credentials = "same-origin";
        return fetchOpts;
      }
      function processPreload(link) {
        if (link.ep)
          return;
        link.ep = true;
        const fetchOpts = getFetchOpts(link);
        fetch(link.href, fetchOpts);
      }
    })();
    var getGlobalTime$1 = () => {
      let t = Date.now();
      if (window.clock && window.clock.delta) {
        t += window.clock.delta;
      }
      return t;
    };
    window.getGlobalTime = getGlobalTime$1;
    function makeMap(str, expectsLowerCase) {
      const map = /* @__PURE__ */ Object.create(null);
      const list = str.split(",");
      for (let i = 0; i < list.length; i++) {
        map[list[i]] = true;
      }
      return expectsLowerCase ? (val) => !!map[val.toLowerCase()] : (val) => !!map[val];
    }
    function normalizeStyle(value) {
      if (isArray(value)) {
        const res = {};
        for (let i = 0; i < value.length; i++) {
          const item = value[i];
          const normalized = isString$1(item) ? parseStringStyle(item) : normalizeStyle(item);
          if (normalized) {
            for (const key in normalized) {
              res[key] = normalized[key];
            }
          }
        }
        return res;
      } else if (isString$1(value)) {
        return value;
      } else if (isObject(value)) {
        return value;
      }
    }
    const listDelimiterRE = /;(?![^(]*\))/g;
    const propertyDelimiterRE = /:([^]+)/;
    const styleCommentRE = /\/\*.*?\*\//gs;
    function parseStringStyle(cssText) {
      const ret = {};
      cssText.replace(styleCommentRE, "").split(listDelimiterRE).forEach((item) => {
        if (item) {
          const tmp = item.split(propertyDelimiterRE);
          tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
        }
      });
      return ret;
    }
    function normalizeClass(value) {
      let res = "";
      if (isString$1(value)) {
        res = value;
      } else if (isArray(value)) {
        for (let i = 0; i < value.length; i++) {
          const normalized = normalizeClass(value[i]);
          if (normalized) {
            res += normalized + " ";
          }
        }
      } else if (isObject(value)) {
        for (const name in value) {
          if (value[name]) {
            res += name + " ";
          }
        }
      }
      return res.trim();
    }
    const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
    const isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
    function includeBooleanAttr(value) {
      return !!value || value === "";
    }
    const toDisplayString = (val) => {
      return isString$1(val) ? val : val == null ? "" : isArray(val) || isObject(val) && (val.toString === objectToString$1 || !isFunction(val.toString)) ? JSON.stringify(val, replacer, 2) : String(val);
    };
    const replacer = (_key, val) => {
      if (val && val.__v_isRef) {
        return replacer(_key, val.value);
      } else if (isMap(val)) {
        return {
          [`Map(${val.size})`]: [...val.entries()].reduce((entries, [key, val2]) => {
            entries[`${key} =>`] = val2;
            return entries;
          }, {})
        };
      } else if (isSet(val)) {
        return {
          [`Set(${val.size})`]: [...val.values()]
        };
      } else if (isObject(val) && !isArray(val) && !isPlainObject$1(val)) {
        return String(val);
      }
      return val;
    };
    const EMPTY_OBJ = {};
    const EMPTY_ARR = [];
    const NOOP = () => {
    };
    const NO = () => false;
    const onRE = /^on[^a-z]/;
    const isOn = (key) => onRE.test(key);
    const isModelListener = (key) => key.startsWith("onUpdate:");
    const extend = Object.assign;
    const remove = (arr, el) => {
      const i = arr.indexOf(el);
      if (i > -1) {
        arr.splice(i, 1);
      }
    };
    const hasOwnProperty = Object.prototype.hasOwnProperty;
    const hasOwn = (val, key) => hasOwnProperty.call(val, key);
    const isArray = Array.isArray;
    const isMap = (val) => toTypeString(val) === "[object Map]";
    const isSet = (val) => toTypeString(val) === "[object Set]";
    const isFunction = (val) => typeof val === "function";
    const isString$1 = (val) => typeof val === "string";
    const isSymbol = (val) => typeof val === "symbol";
    const isObject = (val) => val !== null && typeof val === "object";
    const isPromise = (val) => {
      return isObject(val) && isFunction(val.then) && isFunction(val.catch);
    };
    const objectToString$1 = Object.prototype.toString;
    const toTypeString = (value) => objectToString$1.call(value);
    const toRawType = (value) => {
      return toTypeString(value).slice(8, -1);
    };
    const isPlainObject$1 = (val) => toTypeString(val) === "[object Object]";
    const isIntegerKey = (key) => isString$1(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
    const isReservedProp = /* @__PURE__ */ makeMap(
      ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
    );
    const cacheStringFunction = (fn) => {
      const cache = /* @__PURE__ */ Object.create(null);
      return (str) => {
        const hit = cache[str];
        return hit || (cache[str] = fn(str));
      };
    };
    const camelizeRE = /-(\w)/g;
    const camelize = cacheStringFunction((str) => {
      return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
    });
    const hyphenateRE = /\B([A-Z])/g;
    const hyphenate = cacheStringFunction((str) => str.replace(hyphenateRE, "-$1").toLowerCase());
    const capitalize = cacheStringFunction((str) => str.charAt(0).toUpperCase() + str.slice(1));
    const toHandlerKey = cacheStringFunction((str) => str ? `on${capitalize(str)}` : ``);
    const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
    const invokeArrayFns = (fns, arg) => {
      for (let i = 0; i < fns.length; i++) {
        fns[i](arg);
      }
    };
    const def = (obj, key, value) => {
      Object.defineProperty(obj, key, {
        configurable: true,
        enumerable: false,
        value
      });
    };
    const toNumber = (val) => {
      const n = parseFloat(val);
      return isNaN(n) ? val : n;
    };
    let _globalThis;
    const getGlobalThis = () => {
      return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
    };
    let activeEffectScope;
    class EffectScope {
      constructor(detached = false) {
        this.detached = detached;
        this.active = true;
        this.effects = [];
        this.cleanups = [];
        this.parent = activeEffectScope;
        if (!detached && activeEffectScope) {
          this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(this) - 1;
        }
      }
      run(fn) {
        if (this.active) {
          const currentEffectScope = activeEffectScope;
          try {
            activeEffectScope = this;
            return fn();
          } finally {
            activeEffectScope = currentEffectScope;
          }
        }
      }
      on() {
        activeEffectScope = this;
      }
      off() {
        activeEffectScope = this.parent;
      }
      stop(fromParent) {
        if (this.active) {
          let i, l;
          for (i = 0, l = this.effects.length; i < l; i++) {
            this.effects[i].stop();
          }
          for (i = 0, l = this.cleanups.length; i < l; i++) {
            this.cleanups[i]();
          }
          if (this.scopes) {
            for (i = 0, l = this.scopes.length; i < l; i++) {
              this.scopes[i].stop(true);
            }
          }
          if (!this.detached && this.parent && !fromParent) {
            const last = this.parent.scopes.pop();
            if (last && last !== this) {
              this.parent.scopes[this.index] = last;
              last.index = this.index;
            }
          }
          this.parent = void 0;
          this.active = false;
        }
      }
    }
    function recordEffectScope(effect, scope = activeEffectScope) {
      if (scope && scope.active) {
        scope.effects.push(effect);
      }
    }
    const createDep = (effects) => {
      const dep = new Set(effects);
      dep.w = 0;
      dep.n = 0;
      return dep;
    };
    const wasTracked = (dep) => (dep.w & trackOpBit) > 0;
    const newTracked = (dep) => (dep.n & trackOpBit) > 0;
    const initDepMarkers = ({ deps }) => {
      if (deps.length) {
        for (let i = 0; i < deps.length; i++) {
          deps[i].w |= trackOpBit;
        }
      }
    };
    const finalizeDepMarkers = (effect) => {
      const { deps } = effect;
      if (deps.length) {
        let ptr = 0;
        for (let i = 0; i < deps.length; i++) {
          const dep = deps[i];
          if (wasTracked(dep) && !newTracked(dep)) {
            dep.delete(effect);
          } else {
            deps[ptr++] = dep;
          }
          dep.w &= ~trackOpBit;
          dep.n &= ~trackOpBit;
        }
        deps.length = ptr;
      }
    };
    const targetMap = /* @__PURE__ */ new WeakMap();
    let effectTrackDepth = 0;
    let trackOpBit = 1;
    const maxMarkerBits = 30;
    let activeEffect;
    const ITERATE_KEY = Symbol("");
    const MAP_KEY_ITERATE_KEY = Symbol("");
    class ReactiveEffect {
      constructor(fn, scheduler = null, scope) {
        this.fn = fn;
        this.scheduler = scheduler;
        this.active = true;
        this.deps = [];
        this.parent = void 0;
        recordEffectScope(this, scope);
      }
      run() {
        if (!this.active) {
          return this.fn();
        }
        let parent = activeEffect;
        let lastShouldTrack = shouldTrack;
        while (parent) {
          if (parent === this) {
            return;
          }
          parent = parent.parent;
        }
        try {
          this.parent = activeEffect;
          activeEffect = this;
          shouldTrack = true;
          trackOpBit = 1 << ++effectTrackDepth;
          if (effectTrackDepth <= maxMarkerBits) {
            initDepMarkers(this);
          } else {
            cleanupEffect(this);
          }
          return this.fn();
        } finally {
          if (effectTrackDepth <= maxMarkerBits) {
            finalizeDepMarkers(this);
          }
          trackOpBit = 1 << --effectTrackDepth;
          activeEffect = this.parent;
          shouldTrack = lastShouldTrack;
          this.parent = void 0;
          if (this.deferStop) {
            this.stop();
          }
        }
      }
      stop() {
        if (activeEffect === this) {
          this.deferStop = true;
        } else if (this.active) {
          cleanupEffect(this);
          if (this.onStop) {
            this.onStop();
          }
          this.active = false;
        }
      }
    }
    function cleanupEffect(effect) {
      const { deps } = effect;
      if (deps.length) {
        for (let i = 0; i < deps.length; i++) {
          deps[i].delete(effect);
        }
        deps.length = 0;
      }
    }
    let shouldTrack = true;
    const trackStack = [];
    function pauseTracking() {
      trackStack.push(shouldTrack);
      shouldTrack = false;
    }
    function resetTracking() {
      const last = trackStack.pop();
      shouldTrack = last === void 0 ? true : last;
    }
    function track(target, type, key) {
      if (shouldTrack && activeEffect) {
        let depsMap = targetMap.get(target);
        if (!depsMap) {
          targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
        }
        let dep = depsMap.get(key);
        if (!dep) {
          depsMap.set(key, dep = createDep());
        }
        trackEffects(dep);
      }
    }
    function trackEffects(dep, debuggerEventExtraInfo) {
      let shouldTrack2 = false;
      if (effectTrackDepth <= maxMarkerBits) {
        if (!newTracked(dep)) {
          dep.n |= trackOpBit;
          shouldTrack2 = !wasTracked(dep);
        }
      } else {
        shouldTrack2 = !dep.has(activeEffect);
      }
      if (shouldTrack2) {
        dep.add(activeEffect);
        activeEffect.deps.push(dep);
      }
    }
    function trigger(target, type, key, newValue, oldValue, oldTarget) {
      const depsMap = targetMap.get(target);
      if (!depsMap) {
        return;
      }
      let deps = [];
      if (type === "clear") {
        deps = [...depsMap.values()];
      } else if (key === "length" && isArray(target)) {
        const newLength = toNumber(newValue);
        depsMap.forEach((dep, key2) => {
          if (key2 === "length" || key2 >= newLength) {
            deps.push(dep);
          }
        });
      } else {
        if (key !== void 0) {
          deps.push(depsMap.get(key));
        }
        switch (type) {
          case "add":
            if (!isArray(target)) {
              deps.push(depsMap.get(ITERATE_KEY));
              if (isMap(target)) {
                deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
              }
            } else if (isIntegerKey(key)) {
              deps.push(depsMap.get("length"));
            }
            break;
          case "delete":
            if (!isArray(target)) {
              deps.push(depsMap.get(ITERATE_KEY));
              if (isMap(target)) {
                deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
              }
            }
            break;
          case "set":
            if (isMap(target)) {
              deps.push(depsMap.get(ITERATE_KEY));
            }
            break;
        }
      }
      if (deps.length === 1) {
        if (deps[0]) {
          {
            triggerEffects(deps[0]);
          }
        }
      } else {
        const effects = [];
        for (const dep of deps) {
          if (dep) {
            effects.push(...dep);
          }
        }
        {
          triggerEffects(createDep(effects));
        }
      }
    }
    function triggerEffects(dep, debuggerEventExtraInfo) {
      const effects = isArray(dep) ? dep : [...dep];
      for (const effect of effects) {
        if (effect.computed) {
          triggerEffect(effect);
        }
      }
      for (const effect of effects) {
        if (!effect.computed) {
          triggerEffect(effect);
        }
      }
    }
    function triggerEffect(effect, debuggerEventExtraInfo) {
      if (effect !== activeEffect || effect.allowRecurse) {
        if (effect.scheduler) {
          effect.scheduler();
        } else {
          effect.run();
        }
      }
    }
    const isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
    const builtInSymbols = new Set(
      /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol)
    );
    const get = /* @__PURE__ */ createGetter();
    const shallowGet = /* @__PURE__ */ createGetter(false, true);
    const readonlyGet = /* @__PURE__ */ createGetter(true);
    const arrayInstrumentations = /* @__PURE__ */ createArrayInstrumentations();
    function createArrayInstrumentations() {
      const instrumentations = {};
      ["includes", "indexOf", "lastIndexOf"].forEach((key) => {
        instrumentations[key] = function(...args) {
          const arr = toRaw(this);
          for (let i = 0, l = this.length; i < l; i++) {
            track(arr, "get", i + "");
          }
          const res = arr[key](...args);
          if (res === -1 || res === false) {
            return arr[key](...args.map(toRaw));
          } else {
            return res;
          }
        };
      });
      ["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
        instrumentations[key] = function(...args) {
          pauseTracking();
          const res = toRaw(this)[key].apply(this, args);
          resetTracking();
          return res;
        };
      });
      return instrumentations;
    }
    function createGetter(isReadonly2 = false, shallow = false) {
      return function get2(target, key, receiver) {
        if (key === "__v_isReactive") {
          return !isReadonly2;
        } else if (key === "__v_isReadonly") {
          return isReadonly2;
        } else if (key === "__v_isShallow") {
          return shallow;
        } else if (key === "__v_raw" && receiver === (isReadonly2 ? shallow ? shallowReadonlyMap : readonlyMap : shallow ? shallowReactiveMap : reactiveMap).get(target)) {
          return target;
        }
        const targetIsArray = isArray(target);
        if (!isReadonly2 && targetIsArray && hasOwn(arrayInstrumentations, key)) {
          return Reflect.get(arrayInstrumentations, key, receiver);
        }
        const res = Reflect.get(target, key, receiver);
        if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
          return res;
        }
        if (!isReadonly2) {
          track(target, "get", key);
        }
        if (shallow) {
          return res;
        }
        if (isRef(res)) {
          return targetIsArray && isIntegerKey(key) ? res : res.value;
        }
        if (isObject(res)) {
          return isReadonly2 ? readonly(res) : reactive(res);
        }
        return res;
      };
    }
    const set = /* @__PURE__ */ createSetter();
    const shallowSet = /* @__PURE__ */ createSetter(true);
    function createSetter(shallow = false) {
      return function set2(target, key, value, receiver) {
        let oldValue = target[key];
        if (isReadonly(oldValue) && isRef(oldValue) && !isRef(value)) {
          return false;
        }
        if (!shallow) {
          if (!isShallow(value) && !isReadonly(value)) {
            oldValue = toRaw(oldValue);
            value = toRaw(value);
          }
          if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
            oldValue.value = value;
            return true;
          }
        }
        const hadKey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
        const result = Reflect.set(target, key, value, receiver);
        if (target === toRaw(receiver)) {
          if (!hadKey) {
            trigger(target, "add", key, value);
          } else if (hasChanged(value, oldValue)) {
            trigger(target, "set", key, value);
          }
        }
        return result;
      };
    }
    function deleteProperty(target, key) {
      const hadKey = hasOwn(target, key);
      target[key];
      const result = Reflect.deleteProperty(target, key);
      if (result && hadKey) {
        trigger(target, "delete", key, void 0);
      }
      return result;
    }
    function has(target, key) {
      const result = Reflect.has(target, key);
      if (!isSymbol(key) || !builtInSymbols.has(key)) {
        track(target, "has", key);
      }
      return result;
    }
    function ownKeys(target) {
      track(target, "iterate", isArray(target) ? "length" : ITERATE_KEY);
      return Reflect.ownKeys(target);
    }
    const mutableHandlers = {
      get,
      set,
      deleteProperty,
      has,
      ownKeys
    };
    const readonlyHandlers = {
      get: readonlyGet,
      set(target, key) {
        return true;
      },
      deleteProperty(target, key) {
        return true;
      }
    };
    const shallowReactiveHandlers = /* @__PURE__ */ extend({}, mutableHandlers, {
      get: shallowGet,
      set: shallowSet
    });
    const toShallow = (value) => value;
    const getProto = (v) => Reflect.getPrototypeOf(v);
    function get$1(target, key, isReadonly2 = false, isShallow2 = false) {
      target = target["__v_raw"];
      const rawTarget = toRaw(target);
      const rawKey = toRaw(key);
      if (!isReadonly2) {
        if (key !== rawKey) {
          track(rawTarget, "get", key);
        }
        track(rawTarget, "get", rawKey);
      }
      const { has: has2 } = getProto(rawTarget);
      const wrap2 = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
      if (has2.call(rawTarget, key)) {
        return wrap2(target.get(key));
      } else if (has2.call(rawTarget, rawKey)) {
        return wrap2(target.get(rawKey));
      } else if (target !== rawTarget) {
        target.get(key);
      }
    }
    function has$1(key, isReadonly2 = false) {
      const target = this["__v_raw"];
      const rawTarget = toRaw(target);
      const rawKey = toRaw(key);
      if (!isReadonly2) {
        if (key !== rawKey) {
          track(rawTarget, "has", key);
        }
        track(rawTarget, "has", rawKey);
      }
      return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
    }
    function size(target, isReadonly2 = false) {
      target = target["__v_raw"];
      !isReadonly2 && track(toRaw(target), "iterate", ITERATE_KEY);
      return Reflect.get(target, "size", target);
    }
    function add(value) {
      value = toRaw(value);
      const target = toRaw(this);
      const proto = getProto(target);
      const hadKey = proto.has.call(target, value);
      if (!hadKey) {
        target.add(value);
        trigger(target, "add", value, value);
      }
      return this;
    }
    function set$1(key, value) {
      value = toRaw(value);
      const target = toRaw(this);
      const { has: has2, get: get2 } = getProto(target);
      let hadKey = has2.call(target, key);
      if (!hadKey) {
        key = toRaw(key);
        hadKey = has2.call(target, key);
      }
      const oldValue = get2.call(target, key);
      target.set(key, value);
      if (!hadKey) {
        trigger(target, "add", key, value);
      } else if (hasChanged(value, oldValue)) {
        trigger(target, "set", key, value);
      }
      return this;
    }
    function deleteEntry(key) {
      const target = toRaw(this);
      const { has: has2, get: get2 } = getProto(target);
      let hadKey = has2.call(target, key);
      if (!hadKey) {
        key = toRaw(key);
        hadKey = has2.call(target, key);
      }
      get2 ? get2.call(target, key) : void 0;
      const result = target.delete(key);
      if (hadKey) {
        trigger(target, "delete", key, void 0);
      }
      return result;
    }
    function clear() {
      const target = toRaw(this);
      const hadItems = target.size !== 0;
      const result = target.clear();
      if (hadItems) {
        trigger(target, "clear", void 0, void 0);
      }
      return result;
    }
    function createForEach(isReadonly2, isShallow2) {
      return function forEach(callback, thisArg) {
        const observed = this;
        const target = observed["__v_raw"];
        const rawTarget = toRaw(target);
        const wrap2 = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
        !isReadonly2 && track(rawTarget, "iterate", ITERATE_KEY);
        return target.forEach((value, key) => {
          return callback.call(thisArg, wrap2(value), wrap2(key), observed);
        });
      };
    }
    function createIterableMethod(method, isReadonly2, isShallow2) {
      return function(...args) {
        const target = this["__v_raw"];
        const rawTarget = toRaw(target);
        const targetIsMap = isMap(rawTarget);
        const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
        const isKeyOnly = method === "keys" && targetIsMap;
        const innerIterator = target[method](...args);
        const wrap2 = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
        !isReadonly2 && track(rawTarget, "iterate", isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY);
        return {
          next() {
            const { value, done } = innerIterator.next();
            return done ? { value, done } : {
              value: isPair ? [wrap2(value[0]), wrap2(value[1])] : wrap2(value),
              done
            };
          },
          [Symbol.iterator]() {
            return this;
          }
        };
      };
    }
    function createReadonlyMethod(type) {
      return function(...args) {
        return type === "delete" ? false : this;
      };
    }
    function createInstrumentations() {
      const mutableInstrumentations2 = {
        get(key) {
          return get$1(this, key);
        },
        get size() {
          return size(this);
        },
        has: has$1,
        add,
        set: set$1,
        delete: deleteEntry,
        clear,
        forEach: createForEach(false, false)
      };
      const shallowInstrumentations2 = {
        get(key) {
          return get$1(this, key, false, true);
        },
        get size() {
          return size(this);
        },
        has: has$1,
        add,
        set: set$1,
        delete: deleteEntry,
        clear,
        forEach: createForEach(false, true)
      };
      const readonlyInstrumentations2 = {
        get(key) {
          return get$1(this, key, true);
        },
        get size() {
          return size(this, true);
        },
        has(key) {
          return has$1.call(this, key, true);
        },
        add: createReadonlyMethod("add"),
        set: createReadonlyMethod("set"),
        delete: createReadonlyMethod("delete"),
        clear: createReadonlyMethod("clear"),
        forEach: createForEach(true, false)
      };
      const shallowReadonlyInstrumentations2 = {
        get(key) {
          return get$1(this, key, true, true);
        },
        get size() {
          return size(this, true);
        },
        has(key) {
          return has$1.call(this, key, true);
        },
        add: createReadonlyMethod("add"),
        set: createReadonlyMethod("set"),
        delete: createReadonlyMethod("delete"),
        clear: createReadonlyMethod("clear"),
        forEach: createForEach(true, true)
      };
      const iteratorMethods = ["keys", "values", "entries", Symbol.iterator];
      iteratorMethods.forEach((method) => {
        mutableInstrumentations2[method] = createIterableMethod(method, false, false);
        readonlyInstrumentations2[method] = createIterableMethod(method, true, false);
        shallowInstrumentations2[method] = createIterableMethod(method, false, true);
        shallowReadonlyInstrumentations2[method] = createIterableMethod(method, true, true);
      });
      return [
        mutableInstrumentations2,
        readonlyInstrumentations2,
        shallowInstrumentations2,
        shallowReadonlyInstrumentations2
      ];
    }
    const [mutableInstrumentations, readonlyInstrumentations, shallowInstrumentations, shallowReadonlyInstrumentations] = /* @__PURE__ */ createInstrumentations();
    function createInstrumentationGetter(isReadonly2, shallow) {
      const instrumentations = shallow ? isReadonly2 ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly2 ? readonlyInstrumentations : mutableInstrumentations;
      return (target, key, receiver) => {
        if (key === "__v_isReactive") {
          return !isReadonly2;
        } else if (key === "__v_isReadonly") {
          return isReadonly2;
        } else if (key === "__v_raw") {
          return target;
        }
        return Reflect.get(hasOwn(instrumentations, key) && key in target ? instrumentations : target, key, receiver);
      };
    }
    const mutableCollectionHandlers = {
      get: /* @__PURE__ */ createInstrumentationGetter(false, false)
    };
    const shallowCollectionHandlers = {
      get: /* @__PURE__ */ createInstrumentationGetter(false, true)
    };
    const readonlyCollectionHandlers = {
      get: /* @__PURE__ */ createInstrumentationGetter(true, false)
    };
    const reactiveMap = /* @__PURE__ */ new WeakMap();
    const shallowReactiveMap = /* @__PURE__ */ new WeakMap();
    const readonlyMap = /* @__PURE__ */ new WeakMap();
    const shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
    function targetTypeMap(rawType) {
      switch (rawType) {
        case "Object":
        case "Array":
          return 1;
        case "Map":
        case "Set":
        case "WeakMap":
        case "WeakSet":
          return 2;
        default:
          return 0;
      }
    }
    function getTargetType(value) {
      return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
    }
    function reactive(target) {
      if (isReadonly(target)) {
        return target;
      }
      return createReactiveObject(target, false, mutableHandlers, mutableCollectionHandlers, reactiveMap);
    }
    function shallowReactive(target) {
      return createReactiveObject(target, false, shallowReactiveHandlers, shallowCollectionHandlers, shallowReactiveMap);
    }
    function readonly(target) {
      return createReactiveObject(target, true, readonlyHandlers, readonlyCollectionHandlers, readonlyMap);
    }
    function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
      if (!isObject(target)) {
        return target;
      }
      if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
        return target;
      }
      const existingProxy = proxyMap.get(target);
      if (existingProxy) {
        return existingProxy;
      }
      const targetType = getTargetType(target);
      if (targetType === 0) {
        return target;
      }
      const proxy = new Proxy(target, targetType === 2 ? collectionHandlers : baseHandlers);
      proxyMap.set(target, proxy);
      return proxy;
    }
    function isReactive(value) {
      if (isReadonly(value)) {
        return isReactive(value["__v_raw"]);
      }
      return !!(value && value["__v_isReactive"]);
    }
    function isReadonly(value) {
      return !!(value && value["__v_isReadonly"]);
    }
    function isShallow(value) {
      return !!(value && value["__v_isShallow"]);
    }
    function isProxy(value) {
      return isReactive(value) || isReadonly(value);
    }
    function toRaw(observed) {
      const raw = observed && observed["__v_raw"];
      return raw ? toRaw(raw) : observed;
    }
    function markRaw(value) {
      def(value, "__v_skip", true);
      return value;
    }
    const toReactive = (value) => isObject(value) ? reactive(value) : value;
    const toReadonly = (value) => isObject(value) ? readonly(value) : value;
    function trackRefValue(ref) {
      if (shouldTrack && activeEffect) {
        ref = toRaw(ref);
        {
          trackEffects(ref.dep || (ref.dep = createDep()));
        }
      }
    }
    function triggerRefValue(ref, newVal) {
      ref = toRaw(ref);
      if (ref.dep) {
        {
          triggerEffects(ref.dep);
        }
      }
    }
    function isRef(r) {
      return !!(r && r.__v_isRef === true);
    }
    function unref(ref) {
      return isRef(ref) ? ref.value : ref;
    }
    const shallowUnwrapHandlers = {
      get: (target, key, receiver) => unref(Reflect.get(target, key, receiver)),
      set: (target, key, value, receiver) => {
        const oldValue = target[key];
        if (isRef(oldValue) && !isRef(value)) {
          oldValue.value = value;
          return true;
        } else {
          return Reflect.set(target, key, value, receiver);
        }
      }
    };
    function proxyRefs(objectWithRefs) {
      return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
    }
    var _a;
    class ComputedRefImpl {
      constructor(getter, _setter, isReadonly2, isSSR) {
        this._setter = _setter;
        this.dep = void 0;
        this.__v_isRef = true;
        this[_a] = false;
        this._dirty = true;
        this.effect = new ReactiveEffect(getter, () => {
          if (!this._dirty) {
            this._dirty = true;
            triggerRefValue(this);
          }
        });
        this.effect.computed = this;
        this.effect.active = this._cacheable = !isSSR;
        this["__v_isReadonly"] = isReadonly2;
      }
      get value() {
        const self2 = toRaw(this);
        trackRefValue(self2);
        if (self2._dirty || !self2._cacheable) {
          self2._dirty = false;
          self2._value = self2.effect.run();
        }
        return self2._value;
      }
      set value(newValue) {
        this._setter(newValue);
      }
    }
    _a = "__v_isReadonly";
    function computed$1(getterOrOptions, debugOptions, isSSR = false) {
      let getter;
      let setter;
      const onlyGetter = isFunction(getterOrOptions);
      if (onlyGetter) {
        getter = getterOrOptions;
        setter = NOOP;
      } else {
        getter = getterOrOptions.get;
        setter = getterOrOptions.set;
      }
      const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter, isSSR);
      return cRef;
    }
    function warn(msg, ...args) {
      return;
    }
    function callWithErrorHandling(fn, instance, type, args) {
      let res;
      try {
        res = args ? fn(...args) : fn();
      } catch (err) {
        handleError(err, instance, type);
      }
      return res;
    }
    function callWithAsyncErrorHandling(fn, instance, type, args) {
      if (isFunction(fn)) {
        const res = callWithErrorHandling(fn, instance, type, args);
        if (res && isPromise(res)) {
          res.catch((err) => {
            handleError(err, instance, type);
          });
        }
        return res;
      }
      const values = [];
      for (let i = 0; i < fn.length; i++) {
        values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
      }
      return values;
    }
    function handleError(err, instance, type, throwInDev = true) {
      const contextVNode = instance ? instance.vnode : null;
      if (instance) {
        let cur = instance.parent;
        const exposedInstance = instance.proxy;
        const errorInfo = type;
        while (cur) {
          const errorCapturedHooks = cur.ec;
          if (errorCapturedHooks) {
            for (let i = 0; i < errorCapturedHooks.length; i++) {
              if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
                return;
              }
            }
          }
          cur = cur.parent;
        }
        const appErrorHandler = instance.appContext.config.errorHandler;
        if (appErrorHandler) {
          callWithErrorHandling(appErrorHandler, null, 10, [err, exposedInstance, errorInfo]);
          return;
        }
      }
      logError(err, type, contextVNode, throwInDev);
    }
    function logError(err, type, contextVNode, throwInDev = true) {
      {
        console.error(err);
      }
    }
    let isFlushing = false;
    let isFlushPending = false;
    const queue = [];
    let flushIndex = 0;
    const pendingPostFlushCbs = [];
    let activePostFlushCbs = null;
    let postFlushIndex = 0;
    const resolvedPromise = /* @__PURE__ */ Promise.resolve();
    let currentFlushPromise = null;
    function nextTick(fn) {
      const p2 = currentFlushPromise || resolvedPromise;
      return fn ? p2.then(this ? fn.bind(this) : fn) : p2;
    }
    function findInsertionIndex(id) {
      let start = flushIndex + 1;
      let end = queue.length;
      while (start < end) {
        const middle = start + end >>> 1;
        const middleJobId = getId(queue[middle]);
        middleJobId < id ? start = middle + 1 : end = middle;
      }
      return start;
    }
    function queueJob(job) {
      if (!queue.length || !queue.includes(job, isFlushing && job.allowRecurse ? flushIndex + 1 : flushIndex)) {
        if (job.id == null) {
          queue.push(job);
        } else {
          queue.splice(findInsertionIndex(job.id), 0, job);
        }
        queueFlush();
      }
    }
    function queueFlush() {
      if (!isFlushing && !isFlushPending) {
        isFlushPending = true;
        currentFlushPromise = resolvedPromise.then(flushJobs);
      }
    }
    function invalidateJob(job) {
      const i = queue.indexOf(job);
      if (i > flushIndex) {
        queue.splice(i, 1);
      }
    }
    function queuePostFlushCb(cb) {
      if (!isArray(cb)) {
        if (!activePostFlushCbs || !activePostFlushCbs.includes(cb, cb.allowRecurse ? postFlushIndex + 1 : postFlushIndex)) {
          pendingPostFlushCbs.push(cb);
        }
      } else {
        pendingPostFlushCbs.push(...cb);
      }
      queueFlush();
    }
    function flushPreFlushCbs(seen, i = isFlushing ? flushIndex + 1 : 0) {
      for (; i < queue.length; i++) {
        const cb = queue[i];
        if (cb && cb.pre) {
          queue.splice(i, 1);
          i--;
          cb();
        }
      }
    }
    function flushPostFlushCbs(seen) {
      if (pendingPostFlushCbs.length) {
        const deduped = [...new Set(pendingPostFlushCbs)];
        pendingPostFlushCbs.length = 0;
        if (activePostFlushCbs) {
          activePostFlushCbs.push(...deduped);
          return;
        }
        activePostFlushCbs = deduped;
        activePostFlushCbs.sort((a, b) => getId(a) - getId(b));
        for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
          activePostFlushCbs[postFlushIndex]();
        }
        activePostFlushCbs = null;
        postFlushIndex = 0;
      }
    }
    const getId = (job) => job.id == null ? Infinity : job.id;
    const comparator = (a, b) => {
      const diff = getId(a) - getId(b);
      if (diff === 0) {
        if (a.pre && !b.pre)
          return -1;
        if (b.pre && !a.pre)
          return 1;
      }
      return diff;
    };
    function flushJobs(seen) {
      isFlushPending = false;
      isFlushing = true;
      queue.sort(comparator);
      const check = NOOP;
      try {
        for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
          const job = queue[flushIndex];
          if (job && job.active !== false) {
            if (false)
              ;
            callWithErrorHandling(job, null, 14);
          }
        }
      } finally {
        flushIndex = 0;
        queue.length = 0;
        flushPostFlushCbs();
        isFlushing = false;
        currentFlushPromise = null;
        if (queue.length || pendingPostFlushCbs.length) {
          flushJobs();
        }
      }
    }
    function emit$1(instance, event, ...rawArgs) {
      if (instance.isUnmounted)
        return;
      const props = instance.vnode.props || EMPTY_OBJ;
      let args = rawArgs;
      const isModelListener2 = event.startsWith("update:");
      const modelArg = isModelListener2 && event.slice(7);
      if (modelArg && modelArg in props) {
        const modifiersKey = `${modelArg === "modelValue" ? "model" : modelArg}Modifiers`;
        const { number, trim } = props[modifiersKey] || EMPTY_OBJ;
        if (trim) {
          args = rawArgs.map((a) => isString$1(a) ? a.trim() : a);
        }
        if (number) {
          args = rawArgs.map(toNumber);
        }
      }
      let handlerName;
      let handler = props[handlerName = toHandlerKey(event)] || props[handlerName = toHandlerKey(camelize(event))];
      if (!handler && isModelListener2) {
        handler = props[handlerName = toHandlerKey(hyphenate(event))];
      }
      if (handler) {
        callWithAsyncErrorHandling(handler, instance, 6, args);
      }
      const onceHandler = props[handlerName + `Once`];
      if (onceHandler) {
        if (!instance.emitted) {
          instance.emitted = {};
        } else if (instance.emitted[handlerName]) {
          return;
        }
        instance.emitted[handlerName] = true;
        callWithAsyncErrorHandling(onceHandler, instance, 6, args);
      }
    }
    function normalizeEmitsOptions(comp, appContext, asMixin = false) {
      const cache = appContext.emitsCache;
      const cached = cache.get(comp);
      if (cached !== void 0) {
        return cached;
      }
      const raw = comp.emits;
      let normalized = {};
      let hasExtends = false;
      if (!isFunction(comp)) {
        const extendEmits = (raw2) => {
          const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
          if (normalizedFromExtend) {
            hasExtends = true;
            extend(normalized, normalizedFromExtend);
          }
        };
        if (!asMixin && appContext.mixins.length) {
          appContext.mixins.forEach(extendEmits);
        }
        if (comp.extends) {
          extendEmits(comp.extends);
        }
        if (comp.mixins) {
          comp.mixins.forEach(extendEmits);
        }
      }
      if (!raw && !hasExtends) {
        if (isObject(comp)) {
          cache.set(comp, null);
        }
        return null;
      }
      if (isArray(raw)) {
        raw.forEach((key) => normalized[key] = null);
      } else {
        extend(normalized, raw);
      }
      if (isObject(comp)) {
        cache.set(comp, normalized);
      }
      return normalized;
    }
    function isEmitListener(options, key) {
      if (!options || !isOn(key)) {
        return false;
      }
      key = key.slice(2).replace(/Once$/, "");
      return hasOwn(options, key[0].toLowerCase() + key.slice(1)) || hasOwn(options, hyphenate(key)) || hasOwn(options, key);
    }
    let currentRenderingInstance = null;
    let currentScopeId = null;
    function setCurrentRenderingInstance(instance) {
      const prev = currentRenderingInstance;
      currentRenderingInstance = instance;
      currentScopeId = instance && instance.type.__scopeId || null;
      return prev;
    }
    function pushScopeId(id) {
      currentScopeId = id;
    }
    function popScopeId() {
      currentScopeId = null;
    }
    function withCtx(fn, ctx = currentRenderingInstance, isNonScopedSlot) {
      if (!ctx)
        return fn;
      if (fn._n) {
        return fn;
      }
      const renderFnWithContext = (...args) => {
        if (renderFnWithContext._d) {
          setBlockTracking(-1);
        }
        const prevInstance = setCurrentRenderingInstance(ctx);
        let res;
        try {
          res = fn(...args);
        } finally {
          setCurrentRenderingInstance(prevInstance);
          if (renderFnWithContext._d) {
            setBlockTracking(1);
          }
        }
        return res;
      };
      renderFnWithContext._n = true;
      renderFnWithContext._c = true;
      renderFnWithContext._d = true;
      return renderFnWithContext;
    }
    function markAttrsAccessed() {
    }
    function renderComponentRoot(instance) {
      const { type: Component, vnode, proxy, withProxy, props, propsOptions: [propsOptions], slots, attrs, emit, render, renderCache, data, setupState, ctx, inheritAttrs } = instance;
      let result;
      let fallthroughAttrs;
      const prev = setCurrentRenderingInstance(instance);
      try {
        if (vnode.shapeFlag & 4) {
          const proxyToUse = withProxy || proxy;
          result = normalizeVNode(render.call(proxyToUse, proxyToUse, renderCache, props, setupState, data, ctx));
          fallthroughAttrs = attrs;
        } else {
          const render2 = Component;
          if (false)
            ;
          result = normalizeVNode(render2.length > 1 ? render2(props, false ? {
            get attrs() {
              markAttrsAccessed();
              return attrs;
            },
            slots,
            emit
          } : { attrs, slots, emit }) : render2(props, null));
          fallthroughAttrs = Component.props ? attrs : getFunctionalFallthrough(attrs);
        }
      } catch (err) {
        blockStack.length = 0;
        handleError(err, instance, 1);
        result = createVNode(Comment);
      }
      let root = result;
      if (fallthroughAttrs && inheritAttrs !== false) {
        const keys = Object.keys(fallthroughAttrs);
        const { shapeFlag } = root;
        if (keys.length) {
          if (shapeFlag & (1 | 6)) {
            if (propsOptions && keys.some(isModelListener)) {
              fallthroughAttrs = filterModelListeners(fallthroughAttrs, propsOptions);
            }
            root = cloneVNode(root, fallthroughAttrs);
          }
        }
      }
      if (vnode.dirs) {
        root = cloneVNode(root);
        root.dirs = root.dirs ? root.dirs.concat(vnode.dirs) : vnode.dirs;
      }
      if (vnode.transition) {
        root.transition = vnode.transition;
      }
      {
        result = root;
      }
      setCurrentRenderingInstance(prev);
      return result;
    }
    const getFunctionalFallthrough = (attrs) => {
      let res;
      for (const key in attrs) {
        if (key === "class" || key === "style" || isOn(key)) {
          (res || (res = {}))[key] = attrs[key];
        }
      }
      return res;
    };
    const filterModelListeners = (attrs, props) => {
      const res = {};
      for (const key in attrs) {
        if (!isModelListener(key) || !(key.slice(9) in props)) {
          res[key] = attrs[key];
        }
      }
      return res;
    };
    function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
      const { props: prevProps, children: prevChildren, component } = prevVNode;
      const { props: nextProps, children: nextChildren, patchFlag } = nextVNode;
      const emits = component.emitsOptions;
      if (nextVNode.dirs || nextVNode.transition) {
        return true;
      }
      if (optimized && patchFlag >= 0) {
        if (patchFlag & 1024) {
          return true;
        }
        if (patchFlag & 16) {
          if (!prevProps) {
            return !!nextProps;
          }
          return hasPropsChanged(prevProps, nextProps, emits);
        } else if (patchFlag & 8) {
          const dynamicProps = nextVNode.dynamicProps;
          for (let i = 0; i < dynamicProps.length; i++) {
            const key = dynamicProps[i];
            if (nextProps[key] !== prevProps[key] && !isEmitListener(emits, key)) {
              return true;
            }
          }
        }
      } else {
        if (prevChildren || nextChildren) {
          if (!nextChildren || !nextChildren.$stable) {
            return true;
          }
        }
        if (prevProps === nextProps) {
          return false;
        }
        if (!prevProps) {
          return !!nextProps;
        }
        if (!nextProps) {
          return true;
        }
        return hasPropsChanged(prevProps, nextProps, emits);
      }
      return false;
    }
    function hasPropsChanged(prevProps, nextProps, emitsOptions) {
      const nextKeys = Object.keys(nextProps);
      if (nextKeys.length !== Object.keys(prevProps).length) {
        return true;
      }
      for (let i = 0; i < nextKeys.length; i++) {
        const key = nextKeys[i];
        if (nextProps[key] !== prevProps[key] && !isEmitListener(emitsOptions, key)) {
          return true;
        }
      }
      return false;
    }
    function updateHOCHostEl({ vnode, parent }, el) {
      while (parent && parent.subTree === vnode) {
        (vnode = parent.vnode).el = el;
        parent = parent.parent;
      }
    }
    const isSuspense = (type) => type.__isSuspense;
    function queueEffectWithSuspense(fn, suspense) {
      if (suspense && suspense.pendingBranch) {
        if (isArray(fn)) {
          suspense.effects.push(...fn);
        } else {
          suspense.effects.push(fn);
        }
      } else {
        queuePostFlushCb(fn);
      }
    }
    function provide(key, value) {
      if (!currentInstance)
        ;
      else {
        let provides = currentInstance.provides;
        const parentProvides = currentInstance.parent && currentInstance.parent.provides;
        if (parentProvides === provides) {
          provides = currentInstance.provides = Object.create(parentProvides);
        }
        provides[key] = value;
      }
    }
    function inject(key, defaultValue, treatDefaultAsFactory = false) {
      const instance = currentInstance || currentRenderingInstance;
      if (instance) {
        const provides = instance.parent == null ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides;
        if (provides && key in provides) {
          return provides[key];
        } else if (arguments.length > 1) {
          return treatDefaultAsFactory && isFunction(defaultValue) ? defaultValue.call(instance.proxy) : defaultValue;
        } else
          ;
      }
    }
    const INITIAL_WATCHER_VALUE = {};
    function watch(source, cb, options) {
      return doWatch(source, cb, options);
    }
    function doWatch(source, cb, { immediate, deep, flush, onTrack, onTrigger } = EMPTY_OBJ) {
      const instance = currentInstance;
      let getter;
      let forceTrigger = false;
      let isMultiSource = false;
      if (isRef(source)) {
        getter = () => source.value;
        forceTrigger = isShallow(source);
      } else if (isReactive(source)) {
        getter = () => source;
        deep = true;
      } else if (isArray(source)) {
        isMultiSource = true;
        forceTrigger = source.some((s) => isReactive(s) || isShallow(s));
        getter = () => source.map((s) => {
          if (isRef(s)) {
            return s.value;
          } else if (isReactive(s)) {
            return traverse(s);
          } else if (isFunction(s)) {
            return callWithErrorHandling(s, instance, 2);
          } else
            ;
        });
      } else if (isFunction(source)) {
        if (cb) {
          getter = () => callWithErrorHandling(source, instance, 2);
        } else {
          getter = () => {
            if (instance && instance.isUnmounted) {
              return;
            }
            if (cleanup) {
              cleanup();
            }
            return callWithAsyncErrorHandling(source, instance, 3, [onCleanup]);
          };
        }
      } else {
        getter = NOOP;
      }
      if (cb && deep) {
        const baseGetter = getter;
        getter = () => traverse(baseGetter());
      }
      let cleanup;
      let onCleanup = (fn) => {
        cleanup = effect.onStop = () => {
          callWithErrorHandling(fn, instance, 4);
        };
      };
      let ssrCleanup;
      if (isInSSRComponentSetup) {
        onCleanup = NOOP;
        if (!cb) {
          getter();
        } else if (immediate) {
          callWithAsyncErrorHandling(cb, instance, 3, [
            getter(),
            isMultiSource ? [] : void 0,
            onCleanup
          ]);
        }
        if (flush === "sync") {
          const ctx = useSSRContext();
          ssrCleanup = ctx.__watcherHandles || (ctx.__watcherHandles = []);
        } else {
          return NOOP;
        }
      }
      let oldValue = isMultiSource ? new Array(source.length).fill(INITIAL_WATCHER_VALUE) : INITIAL_WATCHER_VALUE;
      const job = () => {
        if (!effect.active) {
          return;
        }
        if (cb) {
          const newValue = effect.run();
          if (deep || forceTrigger || (isMultiSource ? newValue.some((v, i) => hasChanged(v, oldValue[i])) : hasChanged(newValue, oldValue)) || false) {
            if (cleanup) {
              cleanup();
            }
            callWithAsyncErrorHandling(cb, instance, 3, [
              newValue,
              oldValue === INITIAL_WATCHER_VALUE ? void 0 : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE ? [] : oldValue,
              onCleanup
            ]);
            oldValue = newValue;
          }
        } else {
          effect.run();
        }
      };
      job.allowRecurse = !!cb;
      let scheduler;
      if (flush === "sync") {
        scheduler = job;
      } else if (flush === "post") {
        scheduler = () => queuePostRenderEffect(job, instance && instance.suspense);
      } else {
        job.pre = true;
        if (instance)
          job.id = instance.uid;
        scheduler = () => queueJob(job);
      }
      const effect = new ReactiveEffect(getter, scheduler);
      if (cb) {
        if (immediate) {
          job();
        } else {
          oldValue = effect.run();
        }
      } else if (flush === "post") {
        queuePostRenderEffect(effect.run.bind(effect), instance && instance.suspense);
      } else {
        effect.run();
      }
      const unwatch = () => {
        effect.stop();
        if (instance && instance.scope) {
          remove(instance.scope.effects, effect);
        }
      };
      if (ssrCleanup)
        ssrCleanup.push(unwatch);
      return unwatch;
    }
    function instanceWatch(source, value, options) {
      const publicThis = this.proxy;
      const getter = isString$1(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
      let cb;
      if (isFunction(value)) {
        cb = value;
      } else {
        cb = value.handler;
        options = value;
      }
      const cur = currentInstance;
      setCurrentInstance(this);
      const res = doWatch(getter, cb.bind(publicThis), options);
      if (cur) {
        setCurrentInstance(cur);
      } else {
        unsetCurrentInstance();
      }
      return res;
    }
    function createPathGetter(ctx, path) {
      const segments = path.split(".");
      return () => {
        let cur = ctx;
        for (let i = 0; i < segments.length && cur; i++) {
          cur = cur[segments[i]];
        }
        return cur;
      };
    }
    function traverse(value, seen) {
      if (!isObject(value) || value["__v_skip"]) {
        return value;
      }
      seen = seen || /* @__PURE__ */ new Set();
      if (seen.has(value)) {
        return value;
      }
      seen.add(value);
      if (isRef(value)) {
        traverse(value.value, seen);
      } else if (isArray(value)) {
        for (let i = 0; i < value.length; i++) {
          traverse(value[i], seen);
        }
      } else if (isSet(value) || isMap(value)) {
        value.forEach((v) => {
          traverse(v, seen);
        });
      } else if (isPlainObject$1(value)) {
        for (const key in value) {
          traverse(value[key], seen);
        }
      }
      return value;
    }
    function useTransitionState() {
      const state = {
        isMounted: false,
        isLeaving: false,
        isUnmounting: false,
        leavingVNodes: /* @__PURE__ */ new Map()
      };
      onMounted(() => {
        state.isMounted = true;
      });
      onBeforeUnmount(() => {
        state.isUnmounting = true;
      });
      return state;
    }
    const TransitionHookValidator = [Function, Array];
    const BaseTransitionImpl = {
      name: `BaseTransition`,
      props: {
        mode: String,
        appear: Boolean,
        persisted: Boolean,
        onBeforeEnter: TransitionHookValidator,
        onEnter: TransitionHookValidator,
        onAfterEnter: TransitionHookValidator,
        onEnterCancelled: TransitionHookValidator,
        onBeforeLeave: TransitionHookValidator,
        onLeave: TransitionHookValidator,
        onAfterLeave: TransitionHookValidator,
        onLeaveCancelled: TransitionHookValidator,
        onBeforeAppear: TransitionHookValidator,
        onAppear: TransitionHookValidator,
        onAfterAppear: TransitionHookValidator,
        onAppearCancelled: TransitionHookValidator
      },
      setup(props, { slots }) {
        const instance = getCurrentInstance();
        const state = useTransitionState();
        let prevTransitionKey;
        return () => {
          const children = slots.default && getTransitionRawChildren(slots.default(), true);
          if (!children || !children.length) {
            return;
          }
          let child = children[0];
          if (children.length > 1) {
            for (const c of children) {
              if (c.type !== Comment) {
                child = c;
                break;
              }
            }
          }
          const rawProps = toRaw(props);
          const { mode } = rawProps;
          if (state.isLeaving) {
            return emptyPlaceholder(child);
          }
          const innerChild = getKeepAliveChild(child);
          if (!innerChild) {
            return emptyPlaceholder(child);
          }
          const enterHooks = resolveTransitionHooks(innerChild, rawProps, state, instance);
          setTransitionHooks(innerChild, enterHooks);
          const oldChild = instance.subTree;
          const oldInnerChild = oldChild && getKeepAliveChild(oldChild);
          let transitionKeyChanged = false;
          const { getTransitionKey } = innerChild.type;
          if (getTransitionKey) {
            const key = getTransitionKey();
            if (prevTransitionKey === void 0) {
              prevTransitionKey = key;
            } else if (key !== prevTransitionKey) {
              prevTransitionKey = key;
              transitionKeyChanged = true;
            }
          }
          if (oldInnerChild && oldInnerChild.type !== Comment && (!isSameVNodeType(innerChild, oldInnerChild) || transitionKeyChanged)) {
            const leavingHooks = resolveTransitionHooks(oldInnerChild, rawProps, state, instance);
            setTransitionHooks(oldInnerChild, leavingHooks);
            if (mode === "out-in") {
              state.isLeaving = true;
              leavingHooks.afterLeave = () => {
                state.isLeaving = false;
                if (instance.update.active !== false) {
                  instance.update();
                }
              };
              return emptyPlaceholder(child);
            } else if (mode === "in-out" && innerChild.type !== Comment) {
              leavingHooks.delayLeave = (el, earlyRemove, delayedLeave) => {
                const leavingVNodesCache = getLeavingNodesForType(state, oldInnerChild);
                leavingVNodesCache[String(oldInnerChild.key)] = oldInnerChild;
                el._leaveCb = () => {
                  earlyRemove();
                  el._leaveCb = void 0;
                  delete enterHooks.delayedLeave;
                };
                enterHooks.delayedLeave = delayedLeave;
              };
            }
          }
          return child;
        };
      }
    };
    const BaseTransition = BaseTransitionImpl;
    function getLeavingNodesForType(state, vnode) {
      const { leavingVNodes } = state;
      let leavingVNodesCache = leavingVNodes.get(vnode.type);
      if (!leavingVNodesCache) {
        leavingVNodesCache = /* @__PURE__ */ Object.create(null);
        leavingVNodes.set(vnode.type, leavingVNodesCache);
      }
      return leavingVNodesCache;
    }
    function resolveTransitionHooks(vnode, props, state, instance) {
      const { appear, mode, persisted = false, onBeforeEnter, onEnter, onAfterEnter, onEnterCancelled, onBeforeLeave, onLeave, onAfterLeave, onLeaveCancelled, onBeforeAppear, onAppear, onAfterAppear, onAppearCancelled } = props;
      const key = String(vnode.key);
      const leavingVNodesCache = getLeavingNodesForType(state, vnode);
      const callHook2 = (hook, args) => {
        hook && callWithAsyncErrorHandling(hook, instance, 9, args);
      };
      const callAsyncHook = (hook, args) => {
        const done = args[1];
        callHook2(hook, args);
        if (isArray(hook)) {
          if (hook.every((hook2) => hook2.length <= 1))
            done();
        } else if (hook.length <= 1) {
          done();
        }
      };
      const hooks = {
        mode,
        persisted,
        beforeEnter(el) {
          let hook = onBeforeEnter;
          if (!state.isMounted) {
            if (appear) {
              hook = onBeforeAppear || onBeforeEnter;
            } else {
              return;
            }
          }
          if (el._leaveCb) {
            el._leaveCb(true);
          }
          const leavingVNode = leavingVNodesCache[key];
          if (leavingVNode && isSameVNodeType(vnode, leavingVNode) && leavingVNode.el._leaveCb) {
            leavingVNode.el._leaveCb();
          }
          callHook2(hook, [el]);
        },
        enter(el) {
          let hook = onEnter;
          let afterHook = onAfterEnter;
          let cancelHook = onEnterCancelled;
          if (!state.isMounted) {
            if (appear) {
              hook = onAppear || onEnter;
              afterHook = onAfterAppear || onAfterEnter;
              cancelHook = onAppearCancelled || onEnterCancelled;
            } else {
              return;
            }
          }
          let called = false;
          const done = el._enterCb = (cancelled) => {
            if (called)
              return;
            called = true;
            if (cancelled) {
              callHook2(cancelHook, [el]);
            } else {
              callHook2(afterHook, [el]);
            }
            if (hooks.delayedLeave) {
              hooks.delayedLeave();
            }
            el._enterCb = void 0;
          };
          if (hook) {
            callAsyncHook(hook, [el, done]);
          } else {
            done();
          }
        },
        leave(el, remove2) {
          const key2 = String(vnode.key);
          if (el._enterCb) {
            el._enterCb(true);
          }
          if (state.isUnmounting) {
            return remove2();
          }
          callHook2(onBeforeLeave, [el]);
          let called = false;
          const done = el._leaveCb = (cancelled) => {
            if (called)
              return;
            called = true;
            remove2();
            if (cancelled) {
              callHook2(onLeaveCancelled, [el]);
            } else {
              callHook2(onAfterLeave, [el]);
            }
            el._leaveCb = void 0;
            if (leavingVNodesCache[key2] === vnode) {
              delete leavingVNodesCache[key2];
            }
          };
          leavingVNodesCache[key2] = vnode;
          if (onLeave) {
            callAsyncHook(onLeave, [el, done]);
          } else {
            done();
          }
        },
        clone(vnode2) {
          return resolveTransitionHooks(vnode2, props, state, instance);
        }
      };
      return hooks;
    }
    function emptyPlaceholder(vnode) {
      if (isKeepAlive(vnode)) {
        vnode = cloneVNode(vnode);
        vnode.children = null;
        return vnode;
      }
    }
    function getKeepAliveChild(vnode) {
      return isKeepAlive(vnode) ? vnode.children ? vnode.children[0] : void 0 : vnode;
    }
    function setTransitionHooks(vnode, hooks) {
      if (vnode.shapeFlag & 6 && vnode.component) {
        setTransitionHooks(vnode.component.subTree, hooks);
      } else if (vnode.shapeFlag & 128) {
        vnode.ssContent.transition = hooks.clone(vnode.ssContent);
        vnode.ssFallback.transition = hooks.clone(vnode.ssFallback);
      } else {
        vnode.transition = hooks;
      }
    }
    function getTransitionRawChildren(children, keepComment = false, parentKey) {
      let ret = [];
      let keyedFragmentCount = 0;
      for (let i = 0; i < children.length; i++) {
        let child = children[i];
        const key = parentKey == null ? child.key : String(parentKey) + String(child.key != null ? child.key : i);
        if (child.type === Fragment) {
          if (child.patchFlag & 128)
            keyedFragmentCount++;
          ret = ret.concat(getTransitionRawChildren(child.children, keepComment, key));
        } else if (keepComment || child.type !== Comment) {
          ret.push(key != null ? cloneVNode(child, { key }) : child);
        }
      }
      if (keyedFragmentCount > 1) {
        for (let i = 0; i < ret.length; i++) {
          ret[i].patchFlag = -2;
        }
      }
      return ret;
    }
    function defineComponent(options) {
      return isFunction(options) ? { setup: options, name: options.name } : options;
    }
    const isAsyncWrapper = (i) => !!i.type.__asyncLoader;
    const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
    function onActivated(hook, target) {
      registerKeepAliveHook(hook, "a", target);
    }
    function onDeactivated(hook, target) {
      registerKeepAliveHook(hook, "da", target);
    }
    function registerKeepAliveHook(hook, type, target = currentInstance) {
      const wrappedHook = hook.__wdc || (hook.__wdc = () => {
        let current = target;
        while (current) {
          if (current.isDeactivated) {
            return;
          }
          current = current.parent;
        }
        return hook();
      });
      injectHook(type, wrappedHook, target);
      if (target) {
        let current = target.parent;
        while (current && current.parent) {
          if (isKeepAlive(current.parent.vnode)) {
            injectToKeepAliveRoot(wrappedHook, type, target, current);
          }
          current = current.parent;
        }
      }
    }
    function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
      const injected = injectHook(type, hook, keepAliveRoot, true);
      onUnmounted(() => {
        remove(keepAliveRoot[type], injected);
      }, target);
    }
    function injectHook(type, hook, target = currentInstance, prepend = false) {
      if (target) {
        const hooks = target[type] || (target[type] = []);
        const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
          if (target.isUnmounted) {
            return;
          }
          pauseTracking();
          setCurrentInstance(target);
          const res = callWithAsyncErrorHandling(hook, target, type, args);
          unsetCurrentInstance();
          resetTracking();
          return res;
        });
        if (prepend) {
          hooks.unshift(wrappedHook);
        } else {
          hooks.push(wrappedHook);
        }
        return wrappedHook;
      }
    }
    const createHook = (lifecycle) => (hook, target = currentInstance) => (!isInSSRComponentSetup || lifecycle === "sp") && injectHook(lifecycle, (...args) => hook(...args), target);
    const onBeforeMount = createHook("bm");
    const onMounted = createHook("m");
    const onBeforeUpdate = createHook("bu");
    const onUpdated = createHook("u");
    const onBeforeUnmount = createHook("bum");
    const onUnmounted = createHook("um");
    const onServerPrefetch = createHook("sp");
    const onRenderTriggered = createHook("rtg");
    const onRenderTracked = createHook("rtc");
    function onErrorCaptured(hook, target = currentInstance) {
      injectHook("ec", hook, target);
    }
    function withDirectives(vnode, directives) {
      const internalInstance = currentRenderingInstance;
      if (internalInstance === null) {
        return vnode;
      }
      const instance = getExposeProxy(internalInstance) || internalInstance.proxy;
      const bindings = vnode.dirs || (vnode.dirs = []);
      for (let i = 0; i < directives.length; i++) {
        let [dir, value, arg, modifiers = EMPTY_OBJ] = directives[i];
        if (dir) {
          if (isFunction(dir)) {
            dir = {
              mounted: dir,
              updated: dir
            };
          }
          if (dir.deep) {
            traverse(value);
          }
          bindings.push({
            dir,
            instance,
            value,
            oldValue: void 0,
            arg,
            modifiers
          });
        }
      }
      return vnode;
    }
    function invokeDirectiveHook(vnode, prevVNode, instance, name) {
      const bindings = vnode.dirs;
      const oldBindings = prevVNode && prevVNode.dirs;
      for (let i = 0; i < bindings.length; i++) {
        const binding = bindings[i];
        if (oldBindings) {
          binding.oldValue = oldBindings[i].value;
        }
        let hook = binding.dir[name];
        if (hook) {
          pauseTracking();
          callWithAsyncErrorHandling(hook, instance, 8, [
            vnode.el,
            binding,
            vnode,
            prevVNode
          ]);
          resetTracking();
        }
      }
    }
    const COMPONENTS = "components";
    function resolveComponent(name, maybeSelfReference) {
      return resolveAsset(COMPONENTS, name, true, maybeSelfReference) || name;
    }
    const NULL_DYNAMIC_COMPONENT = Symbol();
    function resolveAsset(type, name, warnMissing = true, maybeSelfReference = false) {
      const instance = currentRenderingInstance || currentInstance;
      if (instance) {
        const Component = instance.type;
        if (type === COMPONENTS) {
          const selfName = getComponentName(Component, false);
          if (selfName && (selfName === name || selfName === camelize(name) || selfName === capitalize(camelize(name)))) {
            return Component;
          }
        }
        const res = resolve(instance[type] || Component[type], name) || resolve(instance.appContext[type], name);
        if (!res && maybeSelfReference) {
          return Component;
        }
        return res;
      }
    }
    function resolve(registry, name) {
      return registry && (registry[name] || registry[camelize(name)] || registry[capitalize(camelize(name))]);
    }
    function renderList(source, renderItem, cache, index2) {
      let ret;
      const cached = cache && cache[index2];
      if (isArray(source) || isString$1(source)) {
        ret = new Array(source.length);
        for (let i = 0, l = source.length; i < l; i++) {
          ret[i] = renderItem(source[i], i, void 0, cached && cached[i]);
        }
      } else if (typeof source === "number") {
        ret = new Array(source);
        for (let i = 0; i < source; i++) {
          ret[i] = renderItem(i + 1, i, void 0, cached && cached[i]);
        }
      } else if (isObject(source)) {
        if (source[Symbol.iterator]) {
          ret = Array.from(source, (item, i) => renderItem(item, i, void 0, cached && cached[i]));
        } else {
          const keys = Object.keys(source);
          ret = new Array(keys.length);
          for (let i = 0, l = keys.length; i < l; i++) {
            const key = keys[i];
            ret[i] = renderItem(source[key], key, i, cached && cached[i]);
          }
        }
      } else {
        ret = [];
      }
      if (cache) {
        cache[index2] = ret;
      }
      return ret;
    }
    function renderSlot(slots, name, props = {}, fallback, noSlotted) {
      if (currentRenderingInstance.isCE || currentRenderingInstance.parent && isAsyncWrapper(currentRenderingInstance.parent) && currentRenderingInstance.parent.isCE) {
        if (name !== "default")
          props.name = name;
        return createVNode("slot", props, fallback && fallback());
      }
      let slot = slots[name];
      if (slot && slot._c) {
        slot._d = false;
      }
      openBlock();
      const validSlotContent = slot && ensureValidVNode(slot(props));
      const rendered = createBlock(Fragment, {
        key: props.key || validSlotContent && validSlotContent.key || `_${name}`
      }, validSlotContent || (fallback ? fallback() : []), validSlotContent && slots._ === 1 ? 64 : -2);
      if (!noSlotted && rendered.scopeId) {
        rendered.slotScopeIds = [rendered.scopeId + "-s"];
      }
      if (slot && slot._c) {
        slot._d = true;
      }
      return rendered;
    }
    function ensureValidVNode(vnodes) {
      return vnodes.some((child) => {
        if (!isVNode(child))
          return true;
        if (child.type === Comment)
          return false;
        if (child.type === Fragment && !ensureValidVNode(child.children))
          return false;
        return true;
      }) ? vnodes : null;
    }
    const getPublicInstance = (i) => {
      if (!i)
        return null;
      if (isStatefulComponent(i))
        return getExposeProxy(i) || i.proxy;
      return getPublicInstance(i.parent);
    };
    const publicPropertiesMap = /* @__PURE__ */ extend(/* @__PURE__ */ Object.create(null), {
      $: (i) => i,
      $el: (i) => i.vnode.el,
      $data: (i) => i.data,
      $props: (i) => i.props,
      $attrs: (i) => i.attrs,
      $slots: (i) => i.slots,
      $refs: (i) => i.refs,
      $parent: (i) => getPublicInstance(i.parent),
      $root: (i) => getPublicInstance(i.root),
      $emit: (i) => i.emit,
      $options: (i) => resolveMergedOptions(i),
      $forceUpdate: (i) => i.f || (i.f = () => queueJob(i.update)),
      $nextTick: (i) => i.n || (i.n = nextTick.bind(i.proxy)),
      $watch: (i) => instanceWatch.bind(i)
    });
    const hasSetupBinding = (state, key) => state !== EMPTY_OBJ && !state.__isScriptSetup && hasOwn(state, key);
    const PublicInstanceProxyHandlers = {
      get({ _: instance }, key) {
        const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
        let normalizedProps;
        if (key[0] !== "$") {
          const n = accessCache[key];
          if (n !== void 0) {
            switch (n) {
              case 1:
                return setupState[key];
              case 2:
                return data[key];
              case 4:
                return ctx[key];
              case 3:
                return props[key];
            }
          } else if (hasSetupBinding(setupState, key)) {
            accessCache[key] = 1;
            return setupState[key];
          } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
            accessCache[key] = 2;
            return data[key];
          } else if ((normalizedProps = instance.propsOptions[0]) && hasOwn(normalizedProps, key)) {
            accessCache[key] = 3;
            return props[key];
          } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
            accessCache[key] = 4;
            return ctx[key];
          } else if (shouldCacheAccess) {
            accessCache[key] = 0;
          }
        }
        const publicGetter = publicPropertiesMap[key];
        let cssModule, globalProperties;
        if (publicGetter) {
          if (key === "$attrs") {
            track(instance, "get", key);
          }
          return publicGetter(instance);
        } else if ((cssModule = type.__cssModules) && (cssModule = cssModule[key])) {
          return cssModule;
        } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
          accessCache[key] = 4;
          return ctx[key];
        } else if (globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)) {
          {
            return globalProperties[key];
          }
        } else
          ;
      },
      set({ _: instance }, key, value) {
        const { data, setupState, ctx } = instance;
        if (hasSetupBinding(setupState, key)) {
          setupState[key] = value;
          return true;
        } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
          data[key] = value;
          return true;
        } else if (hasOwn(instance.props, key)) {
          return false;
        }
        if (key[0] === "$" && key.slice(1) in instance) {
          return false;
        } else {
          {
            ctx[key] = value;
          }
        }
        return true;
      },
      has({ _: { data, setupState, accessCache, ctx, appContext, propsOptions } }, key) {
        let normalizedProps;
        return !!accessCache[key] || data !== EMPTY_OBJ && hasOwn(data, key) || hasSetupBinding(setupState, key) || (normalizedProps = propsOptions[0]) && hasOwn(normalizedProps, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key);
      },
      defineProperty(target, key, descriptor) {
        if (descriptor.get != null) {
          target._.accessCache[key] = 0;
        } else if (hasOwn(descriptor, "value")) {
          this.set(target, key, descriptor.value, null);
        }
        return Reflect.defineProperty(target, key, descriptor);
      }
    };
    let shouldCacheAccess = true;
    function applyOptions(instance) {
      const options = resolveMergedOptions(instance);
      const publicThis = instance.proxy;
      const ctx = instance.ctx;
      shouldCacheAccess = false;
      if (options.beforeCreate) {
        callHook$1(options.beforeCreate, instance, "bc");
      }
      const {
        data: dataOptions,
        computed: computedOptions,
        methods,
        watch: watchOptions,
        provide: provideOptions,
        inject: injectOptions,
        created,
        beforeMount,
        mounted,
        beforeUpdate,
        updated,
        activated,
        deactivated,
        beforeDestroy,
        beforeUnmount,
        destroyed,
        unmounted,
        render,
        renderTracked,
        renderTriggered,
        errorCaptured,
        serverPrefetch,
        expose,
        inheritAttrs,
        components,
        directives,
        filters
      } = options;
      const checkDuplicateProperties = null;
      if (injectOptions) {
        resolveInjections(injectOptions, ctx, checkDuplicateProperties, instance.appContext.config.unwrapInjectedRef);
      }
      if (methods) {
        for (const key in methods) {
          const methodHandler = methods[key];
          if (isFunction(methodHandler)) {
            {
              ctx[key] = methodHandler.bind(publicThis);
            }
          }
        }
      }
      if (dataOptions) {
        const data = dataOptions.call(publicThis, publicThis);
        if (!isObject(data))
          ;
        else {
          instance.data = reactive(data);
        }
      }
      shouldCacheAccess = true;
      if (computedOptions) {
        for (const key in computedOptions) {
          const opt = computedOptions[key];
          const get2 = isFunction(opt) ? opt.bind(publicThis, publicThis) : isFunction(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
          const set2 = !isFunction(opt) && isFunction(opt.set) ? opt.set.bind(publicThis) : NOOP;
          const c = computed({
            get: get2,
            set: set2
          });
          Object.defineProperty(ctx, key, {
            enumerable: true,
            configurable: true,
            get: () => c.value,
            set: (v) => c.value = v
          });
        }
      }
      if (watchOptions) {
        for (const key in watchOptions) {
          createWatcher(watchOptions[key], ctx, publicThis, key);
        }
      }
      if (provideOptions) {
        const provides = isFunction(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
        Reflect.ownKeys(provides).forEach((key) => {
          provide(key, provides[key]);
        });
      }
      if (created) {
        callHook$1(created, instance, "c");
      }
      function registerLifecycleHook(register, hook) {
        if (isArray(hook)) {
          hook.forEach((_hook) => register(_hook.bind(publicThis)));
        } else if (hook) {
          register(hook.bind(publicThis));
        }
      }
      registerLifecycleHook(onBeforeMount, beforeMount);
      registerLifecycleHook(onMounted, mounted);
      registerLifecycleHook(onBeforeUpdate, beforeUpdate);
      registerLifecycleHook(onUpdated, updated);
      registerLifecycleHook(onActivated, activated);
      registerLifecycleHook(onDeactivated, deactivated);
      registerLifecycleHook(onErrorCaptured, errorCaptured);
      registerLifecycleHook(onRenderTracked, renderTracked);
      registerLifecycleHook(onRenderTriggered, renderTriggered);
      registerLifecycleHook(onBeforeUnmount, beforeUnmount);
      registerLifecycleHook(onUnmounted, unmounted);
      registerLifecycleHook(onServerPrefetch, serverPrefetch);
      if (isArray(expose)) {
        if (expose.length) {
          const exposed = instance.exposed || (instance.exposed = {});
          expose.forEach((key) => {
            Object.defineProperty(exposed, key, {
              get: () => publicThis[key],
              set: (val) => publicThis[key] = val
            });
          });
        } else if (!instance.exposed) {
          instance.exposed = {};
        }
      }
      if (render && instance.render === NOOP) {
        instance.render = render;
      }
      if (inheritAttrs != null) {
        instance.inheritAttrs = inheritAttrs;
      }
      if (components)
        instance.components = components;
      if (directives)
        instance.directives = directives;
    }
    function resolveInjections(injectOptions, ctx, checkDuplicateProperties = NOOP, unwrapRef = false) {
      if (isArray(injectOptions)) {
        injectOptions = normalizeInject(injectOptions);
      }
      for (const key in injectOptions) {
        const opt = injectOptions[key];
        let injected;
        if (isObject(opt)) {
          if ("default" in opt) {
            injected = inject(opt.from || key, opt.default, true);
          } else {
            injected = inject(opt.from || key);
          }
        } else {
          injected = inject(opt);
        }
        if (isRef(injected)) {
          if (unwrapRef) {
            Object.defineProperty(ctx, key, {
              enumerable: true,
              configurable: true,
              get: () => injected.value,
              set: (v) => injected.value = v
            });
          } else {
            ctx[key] = injected;
          }
        } else {
          ctx[key] = injected;
        }
      }
    }
    function callHook$1(hook, instance, type) {
      callWithAsyncErrorHandling(isArray(hook) ? hook.map((h2) => h2.bind(instance.proxy)) : hook.bind(instance.proxy), instance, type);
    }
    function createWatcher(raw, ctx, publicThis, key) {
      const getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
      if (isString$1(raw)) {
        const handler = ctx[raw];
        if (isFunction(handler)) {
          watch(getter, handler);
        }
      } else if (isFunction(raw)) {
        watch(getter, raw.bind(publicThis));
      } else if (isObject(raw)) {
        if (isArray(raw)) {
          raw.forEach((r) => createWatcher(r, ctx, publicThis, key));
        } else {
          const handler = isFunction(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
          if (isFunction(handler)) {
            watch(getter, handler, raw);
          }
        }
      } else
        ;
    }
    function resolveMergedOptions(instance) {
      const base = instance.type;
      const { mixins, extends: extendsOptions } = base;
      const { mixins: globalMixins, optionsCache: cache, config: { optionMergeStrategies } } = instance.appContext;
      const cached = cache.get(base);
      let resolved;
      if (cached) {
        resolved = cached;
      } else if (!globalMixins.length && !mixins && !extendsOptions) {
        {
          resolved = base;
        }
      } else {
        resolved = {};
        if (globalMixins.length) {
          globalMixins.forEach((m) => mergeOptions(resolved, m, optionMergeStrategies, true));
        }
        mergeOptions(resolved, base, optionMergeStrategies);
      }
      if (isObject(base)) {
        cache.set(base, resolved);
      }
      return resolved;
    }
    function mergeOptions(to, from, strats, asMixin = false) {
      const { mixins, extends: extendsOptions } = from;
      if (extendsOptions) {
        mergeOptions(to, extendsOptions, strats, true);
      }
      if (mixins) {
        mixins.forEach((m) => mergeOptions(to, m, strats, true));
      }
      for (const key in from) {
        if (asMixin && key === "expose")
          ;
        else {
          const strat = internalOptionMergeStrats[key] || strats && strats[key];
          to[key] = strat ? strat(to[key], from[key]) : from[key];
        }
      }
      return to;
    }
    const internalOptionMergeStrats = {
      data: mergeDataFn,
      props: mergeObjectOptions,
      emits: mergeObjectOptions,
      methods: mergeObjectOptions,
      computed: mergeObjectOptions,
      beforeCreate: mergeAsArray,
      created: mergeAsArray,
      beforeMount: mergeAsArray,
      mounted: mergeAsArray,
      beforeUpdate: mergeAsArray,
      updated: mergeAsArray,
      beforeDestroy: mergeAsArray,
      beforeUnmount: mergeAsArray,
      destroyed: mergeAsArray,
      unmounted: mergeAsArray,
      activated: mergeAsArray,
      deactivated: mergeAsArray,
      errorCaptured: mergeAsArray,
      serverPrefetch: mergeAsArray,
      components: mergeObjectOptions,
      directives: mergeObjectOptions,
      watch: mergeWatchOptions,
      provide: mergeDataFn,
      inject: mergeInject
    };
    function mergeDataFn(to, from) {
      if (!from) {
        return to;
      }
      if (!to) {
        return from;
      }
      return function mergedDataFn() {
        return extend(isFunction(to) ? to.call(this, this) : to, isFunction(from) ? from.call(this, this) : from);
      };
    }
    function mergeInject(to, from) {
      return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
    }
    function normalizeInject(raw) {
      if (isArray(raw)) {
        const res = {};
        for (let i = 0; i < raw.length; i++) {
          res[raw[i]] = raw[i];
        }
        return res;
      }
      return raw;
    }
    function mergeAsArray(to, from) {
      return to ? [...new Set([].concat(to, from))] : from;
    }
    function mergeObjectOptions(to, from) {
      return to ? extend(extend(/* @__PURE__ */ Object.create(null), to), from) : from;
    }
    function mergeWatchOptions(to, from) {
      if (!to)
        return from;
      if (!from)
        return to;
      const merged = extend(/* @__PURE__ */ Object.create(null), to);
      for (const key in from) {
        merged[key] = mergeAsArray(to[key], from[key]);
      }
      return merged;
    }
    function initProps(instance, rawProps, isStateful, isSSR = false) {
      const props = {};
      const attrs = {};
      def(attrs, InternalObjectKey, 1);
      instance.propsDefaults = /* @__PURE__ */ Object.create(null);
      setFullProps(instance, rawProps, props, attrs);
      for (const key in instance.propsOptions[0]) {
        if (!(key in props)) {
          props[key] = void 0;
        }
      }
      if (isStateful) {
        instance.props = isSSR ? props : shallowReactive(props);
      } else {
        if (!instance.type.props) {
          instance.props = attrs;
        } else {
          instance.props = props;
        }
      }
      instance.attrs = attrs;
    }
    function updateProps(instance, rawProps, rawPrevProps, optimized) {
      const { props, attrs, vnode: { patchFlag } } = instance;
      const rawCurrentProps = toRaw(props);
      const [options] = instance.propsOptions;
      let hasAttrsChanged = false;
      if ((optimized || patchFlag > 0) && !(patchFlag & 16)) {
        if (patchFlag & 8) {
          const propsToUpdate = instance.vnode.dynamicProps;
          for (let i = 0; i < propsToUpdate.length; i++) {
            let key = propsToUpdate[i];
            if (isEmitListener(instance.emitsOptions, key)) {
              continue;
            }
            const value = rawProps[key];
            if (options) {
              if (hasOwn(attrs, key)) {
                if (value !== attrs[key]) {
                  attrs[key] = value;
                  hasAttrsChanged = true;
                }
              } else {
                const camelizedKey = camelize(key);
                props[camelizedKey] = resolvePropValue(options, rawCurrentProps, camelizedKey, value, instance, false);
              }
            } else {
              if (value !== attrs[key]) {
                attrs[key] = value;
                hasAttrsChanged = true;
              }
            }
          }
        }
      } else {
        if (setFullProps(instance, rawProps, props, attrs)) {
          hasAttrsChanged = true;
        }
        let kebabKey;
        for (const key in rawCurrentProps) {
          if (!rawProps || !hasOwn(rawProps, key) && ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey))) {
            if (options) {
              if (rawPrevProps && (rawPrevProps[key] !== void 0 || rawPrevProps[kebabKey] !== void 0)) {
                props[key] = resolvePropValue(options, rawCurrentProps, key, void 0, instance, true);
              }
            } else {
              delete props[key];
            }
          }
        }
        if (attrs !== rawCurrentProps) {
          for (const key in attrs) {
            if (!rawProps || !hasOwn(rawProps, key) && true) {
              delete attrs[key];
              hasAttrsChanged = true;
            }
          }
        }
      }
      if (hasAttrsChanged) {
        trigger(instance, "set", "$attrs");
      }
    }
    function setFullProps(instance, rawProps, props, attrs) {
      const [options, needCastKeys] = instance.propsOptions;
      let hasAttrsChanged = false;
      let rawCastValues;
      if (rawProps) {
        for (let key in rawProps) {
          if (isReservedProp(key)) {
            continue;
          }
          const value = rawProps[key];
          let camelKey;
          if (options && hasOwn(options, camelKey = camelize(key))) {
            if (!needCastKeys || !needCastKeys.includes(camelKey)) {
              props[camelKey] = value;
            } else {
              (rawCastValues || (rawCastValues = {}))[camelKey] = value;
            }
          } else if (!isEmitListener(instance.emitsOptions, key)) {
            if (!(key in attrs) || value !== attrs[key]) {
              attrs[key] = value;
              hasAttrsChanged = true;
            }
          }
        }
      }
      if (needCastKeys) {
        const rawCurrentProps = toRaw(props);
        const castValues = rawCastValues || EMPTY_OBJ;
        for (let i = 0; i < needCastKeys.length; i++) {
          const key = needCastKeys[i];
          props[key] = resolvePropValue(options, rawCurrentProps, key, castValues[key], instance, !hasOwn(castValues, key));
        }
      }
      return hasAttrsChanged;
    }
    function resolvePropValue(options, props, key, value, instance, isAbsent) {
      const opt = options[key];
      if (opt != null) {
        const hasDefault = hasOwn(opt, "default");
        if (hasDefault && value === void 0) {
          const defaultValue = opt.default;
          if (opt.type !== Function && isFunction(defaultValue)) {
            const { propsDefaults } = instance;
            if (key in propsDefaults) {
              value = propsDefaults[key];
            } else {
              setCurrentInstance(instance);
              value = propsDefaults[key] = defaultValue.call(null, props);
              unsetCurrentInstance();
            }
          } else {
            value = defaultValue;
          }
        }
        if (opt[0]) {
          if (isAbsent && !hasDefault) {
            value = false;
          } else if (opt[1] && (value === "" || value === hyphenate(key))) {
            value = true;
          }
        }
      }
      return value;
    }
    function normalizePropsOptions(comp, appContext, asMixin = false) {
      const cache = appContext.propsCache;
      const cached = cache.get(comp);
      if (cached) {
        return cached;
      }
      const raw = comp.props;
      const normalized = {};
      const needCastKeys = [];
      let hasExtends = false;
      if (!isFunction(comp)) {
        const extendProps = (raw2) => {
          hasExtends = true;
          const [props, keys] = normalizePropsOptions(raw2, appContext, true);
          extend(normalized, props);
          if (keys)
            needCastKeys.push(...keys);
        };
        if (!asMixin && appContext.mixins.length) {
          appContext.mixins.forEach(extendProps);
        }
        if (comp.extends) {
          extendProps(comp.extends);
        }
        if (comp.mixins) {
          comp.mixins.forEach(extendProps);
        }
      }
      if (!raw && !hasExtends) {
        if (isObject(comp)) {
          cache.set(comp, EMPTY_ARR);
        }
        return EMPTY_ARR;
      }
      if (isArray(raw)) {
        for (let i = 0; i < raw.length; i++) {
          const normalizedKey = camelize(raw[i]);
          if (validatePropName(normalizedKey)) {
            normalized[normalizedKey] = EMPTY_OBJ;
          }
        }
      } else if (raw) {
        for (const key in raw) {
          const normalizedKey = camelize(key);
          if (validatePropName(normalizedKey)) {
            const opt = raw[key];
            const prop = normalized[normalizedKey] = isArray(opt) || isFunction(opt) ? { type: opt } : Object.assign({}, opt);
            if (prop) {
              const booleanIndex = getTypeIndex(Boolean, prop.type);
              const stringIndex = getTypeIndex(String, prop.type);
              prop[0] = booleanIndex > -1;
              prop[1] = stringIndex < 0 || booleanIndex < stringIndex;
              if (booleanIndex > -1 || hasOwn(prop, "default")) {
                needCastKeys.push(normalizedKey);
              }
            }
          }
        }
      }
      const res = [normalized, needCastKeys];
      if (isObject(comp)) {
        cache.set(comp, res);
      }
      return res;
    }
    function validatePropName(key) {
      if (key[0] !== "$") {
        return true;
      }
      return false;
    }
    function getType(ctor) {
      const match = ctor && ctor.toString().match(/^\s*function (\w+)/);
      return match ? match[1] : ctor === null ? "null" : "";
    }
    function isSameType(a, b) {
      return getType(a) === getType(b);
    }
    function getTypeIndex(type, expectedTypes) {
      if (isArray(expectedTypes)) {
        return expectedTypes.findIndex((t) => isSameType(t, type));
      } else if (isFunction(expectedTypes)) {
        return isSameType(expectedTypes, type) ? 0 : -1;
      }
      return -1;
    }
    const isInternalKey = (key) => key[0] === "_" || key === "$stable";
    const normalizeSlotValue = (value) => isArray(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];
    const normalizeSlot = (key, rawSlot, ctx) => {
      if (rawSlot._n) {
        return rawSlot;
      }
      const normalized = withCtx((...args) => {
        if (false)
          ;
        return normalizeSlotValue(rawSlot(...args));
      }, ctx);
      normalized._c = false;
      return normalized;
    };
    const normalizeObjectSlots = (rawSlots, slots, instance) => {
      const ctx = rawSlots._ctx;
      for (const key in rawSlots) {
        if (isInternalKey(key))
          continue;
        const value = rawSlots[key];
        if (isFunction(value)) {
          slots[key] = normalizeSlot(key, value, ctx);
        } else if (value != null) {
          const normalized = normalizeSlotValue(value);
          slots[key] = () => normalized;
        }
      }
    };
    const normalizeVNodeSlots = (instance, children) => {
      const normalized = normalizeSlotValue(children);
      instance.slots.default = () => normalized;
    };
    const initSlots = (instance, children) => {
      if (instance.vnode.shapeFlag & 32) {
        const type = children._;
        if (type) {
          instance.slots = toRaw(children);
          def(children, "_", type);
        } else {
          normalizeObjectSlots(children, instance.slots = {});
        }
      } else {
        instance.slots = {};
        if (children) {
          normalizeVNodeSlots(instance, children);
        }
      }
      def(instance.slots, InternalObjectKey, 1);
    };
    const updateSlots = (instance, children, optimized) => {
      const { vnode, slots } = instance;
      let needDeletionCheck = true;
      let deletionComparisonTarget = EMPTY_OBJ;
      if (vnode.shapeFlag & 32) {
        const type = children._;
        if (type) {
          if (optimized && type === 1) {
            needDeletionCheck = false;
          } else {
            extend(slots, children);
            if (!optimized && type === 1) {
              delete slots._;
            }
          }
        } else {
          needDeletionCheck = !children.$stable;
          normalizeObjectSlots(children, slots);
        }
        deletionComparisonTarget = children;
      } else if (children) {
        normalizeVNodeSlots(instance, children);
        deletionComparisonTarget = { default: 1 };
      }
      if (needDeletionCheck) {
        for (const key in slots) {
          if (!isInternalKey(key) && !(key in deletionComparisonTarget)) {
            delete slots[key];
          }
        }
      }
    };
    function createAppContext() {
      return {
        app: null,
        config: {
          isNativeTag: NO,
          performance: false,
          globalProperties: {},
          optionMergeStrategies: {},
          errorHandler: void 0,
          warnHandler: void 0,
          compilerOptions: {}
        },
        mixins: [],
        components: {},
        directives: {},
        provides: /* @__PURE__ */ Object.create(null),
        optionsCache: /* @__PURE__ */ new WeakMap(),
        propsCache: /* @__PURE__ */ new WeakMap(),
        emitsCache: /* @__PURE__ */ new WeakMap()
      };
    }
    let uid = 0;
    function createAppAPI(render, hydrate) {
      return function createApp2(rootComponent, rootProps = null) {
        if (!isFunction(rootComponent)) {
          rootComponent = Object.assign({}, rootComponent);
        }
        if (rootProps != null && !isObject(rootProps)) {
          rootProps = null;
        }
        const context = createAppContext();
        const installedPlugins = /* @__PURE__ */ new Set();
        let isMounted = false;
        const app2 = context.app = {
          _uid: uid++,
          _component: rootComponent,
          _props: rootProps,
          _container: null,
          _context: context,
          _instance: null,
          version,
          get config() {
            return context.config;
          },
          set config(v) {
          },
          use(plugin, ...options) {
            if (installedPlugins.has(plugin))
              ;
            else if (plugin && isFunction(plugin.install)) {
              installedPlugins.add(plugin);
              plugin.install(app2, ...options);
            } else if (isFunction(plugin)) {
              installedPlugins.add(plugin);
              plugin(app2, ...options);
            } else
              ;
            return app2;
          },
          mixin(mixin) {
            {
              if (!context.mixins.includes(mixin)) {
                context.mixins.push(mixin);
              }
            }
            return app2;
          },
          component(name, component) {
            if (!component) {
              return context.components[name];
            }
            context.components[name] = component;
            return app2;
          },
          directive(name, directive) {
            if (!directive) {
              return context.directives[name];
            }
            context.directives[name] = directive;
            return app2;
          },
          mount(rootContainer, isHydrate, isSVG) {
            if (!isMounted) {
              const vnode = createVNode(rootComponent, rootProps);
              vnode.appContext = context;
              if (isHydrate && hydrate) {
                hydrate(vnode, rootContainer);
              } else {
                render(vnode, rootContainer, isSVG);
              }
              isMounted = true;
              app2._container = rootContainer;
              rootContainer.__vue_app__ = app2;
              return getExposeProxy(vnode.component) || vnode.component.proxy;
            }
          },
          unmount() {
            if (isMounted) {
              render(null, app2._container);
              delete app2._container.__vue_app__;
            }
          },
          provide(key, value) {
            context.provides[key] = value;
            return app2;
          }
        };
        return app2;
      };
    }
    function setRef(rawRef, oldRawRef, parentSuspense, vnode, isUnmount = false) {
      if (isArray(rawRef)) {
        rawRef.forEach((r, i) => setRef(r, oldRawRef && (isArray(oldRawRef) ? oldRawRef[i] : oldRawRef), parentSuspense, vnode, isUnmount));
        return;
      }
      if (isAsyncWrapper(vnode) && !isUnmount) {
        return;
      }
      const refValue = vnode.shapeFlag & 4 ? getExposeProxy(vnode.component) || vnode.component.proxy : vnode.el;
      const value = isUnmount ? null : refValue;
      const { i: owner, r: ref } = rawRef;
      const oldRef = oldRawRef && oldRawRef.r;
      const refs = owner.refs === EMPTY_OBJ ? owner.refs = {} : owner.refs;
      const setupState = owner.setupState;
      if (oldRef != null && oldRef !== ref) {
        if (isString$1(oldRef)) {
          refs[oldRef] = null;
          if (hasOwn(setupState, oldRef)) {
            setupState[oldRef] = null;
          }
        } else if (isRef(oldRef)) {
          oldRef.value = null;
        }
      }
      if (isFunction(ref)) {
        callWithErrorHandling(ref, owner, 12, [value, refs]);
      } else {
        const _isString = isString$1(ref);
        const _isRef = isRef(ref);
        if (_isString || _isRef) {
          const doSet = () => {
            if (rawRef.f) {
              const existing = _isString ? hasOwn(setupState, ref) ? setupState[ref] : refs[ref] : ref.value;
              if (isUnmount) {
                isArray(existing) && remove(existing, refValue);
              } else {
                if (!isArray(existing)) {
                  if (_isString) {
                    refs[ref] = [refValue];
                    if (hasOwn(setupState, ref)) {
                      setupState[ref] = refs[ref];
                    }
                  } else {
                    ref.value = [refValue];
                    if (rawRef.k)
                      refs[rawRef.k] = ref.value;
                  }
                } else if (!existing.includes(refValue)) {
                  existing.push(refValue);
                }
              }
            } else if (_isString) {
              refs[ref] = value;
              if (hasOwn(setupState, ref)) {
                setupState[ref] = value;
              }
            } else if (_isRef) {
              ref.value = value;
              if (rawRef.k)
                refs[rawRef.k] = value;
            } else
              ;
          };
          if (value) {
            doSet.id = -1;
            queuePostRenderEffect(doSet, parentSuspense);
          } else {
            doSet();
          }
        }
      }
    }
    const queuePostRenderEffect = queueEffectWithSuspense;
    function createRenderer(options) {
      return baseCreateRenderer(options);
    }
    function baseCreateRenderer(options, createHydrationFns) {
      const target = getGlobalThis();
      target.__VUE__ = true;
      const { insert: hostInsert, remove: hostRemove, patchProp: hostPatchProp, createElement: hostCreateElement, createText: hostCreateText, createComment: hostCreateComment, setText: hostSetText, setElementText: hostSetElementText, parentNode: hostParentNode, nextSibling: hostNextSibling, setScopeId: hostSetScopeId = NOOP, insertStaticContent: hostInsertStaticContent } = options;
      const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, isSVG = false, slotScopeIds = null, optimized = !!n2.dynamicChildren) => {
        if (n1 === n2) {
          return;
        }
        if (n1 && !isSameVNodeType(n1, n2)) {
          anchor = getNextHostNode(n1);
          unmount(n1, parentComponent, parentSuspense, true);
          n1 = null;
        }
        if (n2.patchFlag === -2) {
          optimized = false;
          n2.dynamicChildren = null;
        }
        const { type, ref, shapeFlag } = n2;
        switch (type) {
          case Text:
            processText(n1, n2, container, anchor);
            break;
          case Comment:
            processCommentNode(n1, n2, container, anchor);
            break;
          case Static:
            if (n1 == null) {
              mountStaticNode(n2, container, anchor, isSVG);
            }
            break;
          case Fragment:
            processFragment(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
            break;
          default:
            if (shapeFlag & 1) {
              processElement(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
            } else if (shapeFlag & 6) {
              processComponent(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
            } else if (shapeFlag & 64) {
              type.process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, internals);
            } else if (shapeFlag & 128) {
              type.process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, internals);
            } else
              ;
        }
        if (ref != null && parentComponent) {
          setRef(ref, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
        }
      };
      const processText = (n1, n2, container, anchor) => {
        if (n1 == null) {
          hostInsert(n2.el = hostCreateText(n2.children), container, anchor);
        } else {
          const el = n2.el = n1.el;
          if (n2.children !== n1.children) {
            hostSetText(el, n2.children);
          }
        }
      };
      const processCommentNode = (n1, n2, container, anchor) => {
        if (n1 == null) {
          hostInsert(n2.el = hostCreateComment(n2.children || ""), container, anchor);
        } else {
          n2.el = n1.el;
        }
      };
      const mountStaticNode = (n2, container, anchor, isSVG) => {
        [n2.el, n2.anchor] = hostInsertStaticContent(n2.children, container, anchor, isSVG, n2.el, n2.anchor);
      };
      const moveStaticNode = ({ el, anchor }, container, nextSibling) => {
        let next;
        while (el && el !== anchor) {
          next = hostNextSibling(el);
          hostInsert(el, container, nextSibling);
          el = next;
        }
        hostInsert(anchor, container, nextSibling);
      };
      const removeStaticNode = ({ el, anchor }) => {
        let next;
        while (el && el !== anchor) {
          next = hostNextSibling(el);
          hostRemove(el);
          el = next;
        }
        hostRemove(anchor);
      };
      const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
        isSVG = isSVG || n2.type === "svg";
        if (n1 == null) {
          mountElement(n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else {
          patchElement(n1, n2, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        }
      };
      const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
        let el;
        let vnodeHook;
        const { type, props, shapeFlag, transition, dirs } = vnode;
        el = vnode.el = hostCreateElement(vnode.type, isSVG, props && props.is, props);
        if (shapeFlag & 8) {
          hostSetElementText(el, vnode.children);
        } else if (shapeFlag & 16) {
          mountChildren(vnode.children, el, null, parentComponent, parentSuspense, isSVG && type !== "foreignObject", slotScopeIds, optimized);
        }
        if (dirs) {
          invokeDirectiveHook(vnode, null, parentComponent, "created");
        }
        if (props) {
          for (const key in props) {
            if (key !== "value" && !isReservedProp(key)) {
              hostPatchProp(el, key, null, props[key], isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
            }
          }
          if ("value" in props) {
            hostPatchProp(el, "value", null, props.value);
          }
          if (vnodeHook = props.onVnodeBeforeMount) {
            invokeVNodeHook(vnodeHook, parentComponent, vnode);
          }
        }
        setScopeId(el, vnode, vnode.scopeId, slotScopeIds, parentComponent);
        if (dirs) {
          invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
        }
        const needCallTransitionHooks = (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;
        if (needCallTransitionHooks) {
          transition.beforeEnter(el);
        }
        hostInsert(el, container, anchor);
        if ((vnodeHook = props && props.onVnodeMounted) || needCallTransitionHooks || dirs) {
          queuePostRenderEffect(() => {
            vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
            needCallTransitionHooks && transition.enter(el);
            dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
          }, parentSuspense);
        }
      };
      const setScopeId = (el, vnode, scopeId, slotScopeIds, parentComponent) => {
        if (scopeId) {
          hostSetScopeId(el, scopeId);
        }
        if (slotScopeIds) {
          for (let i = 0; i < slotScopeIds.length; i++) {
            hostSetScopeId(el, slotScopeIds[i]);
          }
        }
        if (parentComponent) {
          let subTree = parentComponent.subTree;
          if (vnode === subTree) {
            const parentVNode = parentComponent.vnode;
            setScopeId(el, parentVNode, parentVNode.scopeId, parentVNode.slotScopeIds, parentComponent.parent);
          }
        }
      };
      const mountChildren = (children, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, start = 0) => {
        for (let i = start; i < children.length; i++) {
          const child = children[i] = optimized ? cloneIfMounted(children[i]) : normalizeVNode(children[i]);
          patch(null, child, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        }
      };
      const patchElement = (n1, n2, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
        const el = n2.el = n1.el;
        let { patchFlag, dynamicChildren, dirs } = n2;
        patchFlag |= n1.patchFlag & 16;
        const oldProps = n1.props || EMPTY_OBJ;
        const newProps = n2.props || EMPTY_OBJ;
        let vnodeHook;
        parentComponent && toggleRecurse(parentComponent, false);
        if (vnodeHook = newProps.onVnodeBeforeUpdate) {
          invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
        }
        if (dirs) {
          invokeDirectiveHook(n2, n1, parentComponent, "beforeUpdate");
        }
        parentComponent && toggleRecurse(parentComponent, true);
        const areChildrenSVG = isSVG && n2.type !== "foreignObject";
        if (dynamicChildren) {
          patchBlockChildren(n1.dynamicChildren, dynamicChildren, el, parentComponent, parentSuspense, areChildrenSVG, slotScopeIds);
        } else if (!optimized) {
          patchChildren(n1, n2, el, null, parentComponent, parentSuspense, areChildrenSVG, slotScopeIds, false);
        }
        if (patchFlag > 0) {
          if (patchFlag & 16) {
            patchProps(el, n2, oldProps, newProps, parentComponent, parentSuspense, isSVG);
          } else {
            if (patchFlag & 2) {
              if (oldProps.class !== newProps.class) {
                hostPatchProp(el, "class", null, newProps.class, isSVG);
              }
            }
            if (patchFlag & 4) {
              hostPatchProp(el, "style", oldProps.style, newProps.style, isSVG);
            }
            if (patchFlag & 8) {
              const propsToUpdate = n2.dynamicProps;
              for (let i = 0; i < propsToUpdate.length; i++) {
                const key = propsToUpdate[i];
                const prev = oldProps[key];
                const next = newProps[key];
                if (next !== prev || key === "value") {
                  hostPatchProp(el, key, prev, next, isSVG, n1.children, parentComponent, parentSuspense, unmountChildren);
                }
              }
            }
          }
          if (patchFlag & 1) {
            if (n1.children !== n2.children) {
              hostSetElementText(el, n2.children);
            }
          }
        } else if (!optimized && dynamicChildren == null) {
          patchProps(el, n2, oldProps, newProps, parentComponent, parentSuspense, isSVG);
        }
        if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
          queuePostRenderEffect(() => {
            vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
            dirs && invokeDirectiveHook(n2, n1, parentComponent, "updated");
          }, parentSuspense);
        }
      };
      const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, isSVG, slotScopeIds) => {
        for (let i = 0; i < newChildren.length; i++) {
          const oldVNode = oldChildren[i];
          const newVNode = newChildren[i];
          const container = oldVNode.el && (oldVNode.type === Fragment || !isSameVNodeType(oldVNode, newVNode) || oldVNode.shapeFlag & (6 | 64)) ? hostParentNode(oldVNode.el) : fallbackContainer;
          patch(oldVNode, newVNode, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, true);
        }
      };
      const patchProps = (el, vnode, oldProps, newProps, parentComponent, parentSuspense, isSVG) => {
        if (oldProps !== newProps) {
          if (oldProps !== EMPTY_OBJ) {
            for (const key in oldProps) {
              if (!isReservedProp(key) && !(key in newProps)) {
                hostPatchProp(el, key, oldProps[key], null, isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
              }
            }
          }
          for (const key in newProps) {
            if (isReservedProp(key))
              continue;
            const next = newProps[key];
            const prev = oldProps[key];
            if (next !== prev && key !== "value") {
              hostPatchProp(el, key, prev, next, isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
            }
          }
          if ("value" in newProps) {
            hostPatchProp(el, "value", oldProps.value, newProps.value);
          }
        }
      };
      const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
        const fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText("");
        const fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText("");
        let { patchFlag, dynamicChildren, slotScopeIds: fragmentSlotScopeIds } = n2;
        if (fragmentSlotScopeIds) {
          slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
        }
        if (n1 == null) {
          hostInsert(fragmentStartAnchor, container, anchor);
          hostInsert(fragmentEndAnchor, container, anchor);
          mountChildren(n2.children, container, fragmentEndAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else {
          if (patchFlag > 0 && patchFlag & 64 && dynamicChildren && n1.dynamicChildren) {
            patchBlockChildren(n1.dynamicChildren, dynamicChildren, container, parentComponent, parentSuspense, isSVG, slotScopeIds);
            if (n2.key != null || parentComponent && n2 === parentComponent.subTree) {
              traverseStaticChildren(n1, n2, true);
            }
          } else {
            patchChildren(n1, n2, container, fragmentEndAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
          }
        }
      };
      const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
        n2.slotScopeIds = slotScopeIds;
        if (n1 == null) {
          if (n2.shapeFlag & 512) {
            parentComponent.ctx.activate(n2, container, anchor, isSVG, optimized);
          } else {
            mountComponent(n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
          }
        } else {
          updateComponent(n1, n2, optimized);
        }
      };
      const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
        const instance = initialVNode.component = createComponentInstance(initialVNode, parentComponent, parentSuspense);
        if (isKeepAlive(initialVNode)) {
          instance.ctx.renderer = internals;
        }
        {
          setupComponent(instance);
        }
        if (instance.asyncDep) {
          parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect);
          if (!initialVNode.el) {
            const placeholder = instance.subTree = createVNode(Comment);
            processCommentNode(null, placeholder, container, anchor);
          }
          return;
        }
        setupRenderEffect(instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized);
      };
      const updateComponent = (n1, n2, optimized) => {
        const instance = n2.component = n1.component;
        if (shouldUpdateComponent(n1, n2, optimized)) {
          if (instance.asyncDep && !instance.asyncResolved) {
            updateComponentPreRender(instance, n2, optimized);
            return;
          } else {
            instance.next = n2;
            invalidateJob(instance.update);
            instance.update();
          }
        } else {
          n2.el = n1.el;
          instance.vnode = n2;
        }
      };
      const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized) => {
        const componentUpdateFn = () => {
          if (!instance.isMounted) {
            let vnodeHook;
            const { el, props } = initialVNode;
            const { bm, m, parent } = instance;
            const isAsyncWrapperVNode = isAsyncWrapper(initialVNode);
            toggleRecurse(instance, false);
            if (bm) {
              invokeArrayFns(bm);
            }
            if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeBeforeMount)) {
              invokeVNodeHook(vnodeHook, parent, initialVNode);
            }
            toggleRecurse(instance, true);
            if (el && hydrateNode) {
              const hydrateSubTree = () => {
                instance.subTree = renderComponentRoot(instance);
                hydrateNode(el, instance.subTree, instance, parentSuspense, null);
              };
              if (isAsyncWrapperVNode) {
                initialVNode.type.__asyncLoader().then(
                  () => !instance.isUnmounted && hydrateSubTree()
                );
              } else {
                hydrateSubTree();
              }
            } else {
              const subTree = instance.subTree = renderComponentRoot(instance);
              patch(null, subTree, container, anchor, instance, parentSuspense, isSVG);
              initialVNode.el = subTree.el;
            }
            if (m) {
              queuePostRenderEffect(m, parentSuspense);
            }
            if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeMounted)) {
              const scopedInitialVNode = initialVNode;
              queuePostRenderEffect(() => invokeVNodeHook(vnodeHook, parent, scopedInitialVNode), parentSuspense);
            }
            if (initialVNode.shapeFlag & 256 || parent && isAsyncWrapper(parent.vnode) && parent.vnode.shapeFlag & 256) {
              instance.a && queuePostRenderEffect(instance.a, parentSuspense);
            }
            instance.isMounted = true;
            initialVNode = container = anchor = null;
          } else {
            let { next, bu, u, parent, vnode } = instance;
            let originNext = next;
            let vnodeHook;
            toggleRecurse(instance, false);
            if (next) {
              next.el = vnode.el;
              updateComponentPreRender(instance, next, optimized);
            } else {
              next = vnode;
            }
            if (bu) {
              invokeArrayFns(bu);
            }
            if (vnodeHook = next.props && next.props.onVnodeBeforeUpdate) {
              invokeVNodeHook(vnodeHook, parent, next, vnode);
            }
            toggleRecurse(instance, true);
            const nextTree = renderComponentRoot(instance);
            const prevTree = instance.subTree;
            instance.subTree = nextTree;
            patch(
              prevTree,
              nextTree,
              hostParentNode(prevTree.el),
              getNextHostNode(prevTree),
              instance,
              parentSuspense,
              isSVG
            );
            next.el = nextTree.el;
            if (originNext === null) {
              updateHOCHostEl(instance, nextTree.el);
            }
            if (u) {
              queuePostRenderEffect(u, parentSuspense);
            }
            if (vnodeHook = next.props && next.props.onVnodeUpdated) {
              queuePostRenderEffect(() => invokeVNodeHook(vnodeHook, parent, next, vnode), parentSuspense);
            }
          }
        };
        const effect = instance.effect = new ReactiveEffect(
          componentUpdateFn,
          () => queueJob(update),
          instance.scope
        );
        const update = instance.update = () => effect.run();
        update.id = instance.uid;
        toggleRecurse(instance, true);
        update();
      };
      const updateComponentPreRender = (instance, nextVNode, optimized) => {
        nextVNode.component = instance;
        const prevProps = instance.vnode.props;
        instance.vnode = nextVNode;
        instance.next = null;
        updateProps(instance, nextVNode.props, prevProps, optimized);
        updateSlots(instance, nextVNode.children, optimized);
        pauseTracking();
        flushPreFlushCbs();
        resetTracking();
      };
      const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized = false) => {
        const c1 = n1 && n1.children;
        const prevShapeFlag = n1 ? n1.shapeFlag : 0;
        const c2 = n2.children;
        const { patchFlag, shapeFlag } = n2;
        if (patchFlag > 0) {
          if (patchFlag & 128) {
            patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
            return;
          } else if (patchFlag & 256) {
            patchUnkeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
            return;
          }
        }
        if (shapeFlag & 8) {
          if (prevShapeFlag & 16) {
            unmountChildren(c1, parentComponent, parentSuspense);
          }
          if (c2 !== c1) {
            hostSetElementText(container, c2);
          }
        } else {
          if (prevShapeFlag & 16) {
            if (shapeFlag & 16) {
              patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
            } else {
              unmountChildren(c1, parentComponent, parentSuspense, true);
            }
          } else {
            if (prevShapeFlag & 8) {
              hostSetElementText(container, "");
            }
            if (shapeFlag & 16) {
              mountChildren(c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
            }
          }
        }
      };
      const patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
        c1 = c1 || EMPTY_ARR;
        c2 = c2 || EMPTY_ARR;
        const oldLength = c1.length;
        const newLength = c2.length;
        const commonLength = Math.min(oldLength, newLength);
        let i;
        for (i = 0; i < commonLength; i++) {
          const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
          patch(c1[i], nextChild, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        }
        if (oldLength > newLength) {
          unmountChildren(c1, parentComponent, parentSuspense, true, false, commonLength);
        } else {
          mountChildren(c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, commonLength);
        }
      };
      const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
        let i = 0;
        const l2 = c2.length;
        let e1 = c1.length - 1;
        let e2 = l2 - 1;
        while (i <= e1 && i <= e2) {
          const n1 = c1[i];
          const n2 = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
          if (isSameVNodeType(n1, n2)) {
            patch(n1, n2, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
          } else {
            break;
          }
          i++;
        }
        while (i <= e1 && i <= e2) {
          const n1 = c1[e1];
          const n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);
          if (isSameVNodeType(n1, n2)) {
            patch(n1, n2, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
          } else {
            break;
          }
          e1--;
          e2--;
        }
        if (i > e1) {
          if (i <= e2) {
            const nextPos = e2 + 1;
            const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
            while (i <= e2) {
              patch(null, c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]), container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
              i++;
            }
          }
        } else if (i > e2) {
          while (i <= e1) {
            unmount(c1[i], parentComponent, parentSuspense, true);
            i++;
          }
        } else {
          const s1 = i;
          const s2 = i;
          const keyToNewIndexMap = /* @__PURE__ */ new Map();
          for (i = s2; i <= e2; i++) {
            const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
            if (nextChild.key != null) {
              keyToNewIndexMap.set(nextChild.key, i);
            }
          }
          let j;
          let patched = 0;
          const toBePatched = e2 - s2 + 1;
          let moved = false;
          let maxNewIndexSoFar = 0;
          const newIndexToOldIndexMap = new Array(toBePatched);
          for (i = 0; i < toBePatched; i++)
            newIndexToOldIndexMap[i] = 0;
          for (i = s1; i <= e1; i++) {
            const prevChild = c1[i];
            if (patched >= toBePatched) {
              unmount(prevChild, parentComponent, parentSuspense, true);
              continue;
            }
            let newIndex;
            if (prevChild.key != null) {
              newIndex = keyToNewIndexMap.get(prevChild.key);
            } else {
              for (j = s2; j <= e2; j++) {
                if (newIndexToOldIndexMap[j - s2] === 0 && isSameVNodeType(prevChild, c2[j])) {
                  newIndex = j;
                  break;
                }
              }
            }
            if (newIndex === void 0) {
              unmount(prevChild, parentComponent, parentSuspense, true);
            } else {
              newIndexToOldIndexMap[newIndex - s2] = i + 1;
              if (newIndex >= maxNewIndexSoFar) {
                maxNewIndexSoFar = newIndex;
              } else {
                moved = true;
              }
              patch(prevChild, c2[newIndex], container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
              patched++;
            }
          }
          const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : EMPTY_ARR;
          j = increasingNewIndexSequence.length - 1;
          for (i = toBePatched - 1; i >= 0; i--) {
            const nextIndex = s2 + i;
            const nextChild = c2[nextIndex];
            const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : parentAnchor;
            if (newIndexToOldIndexMap[i] === 0) {
              patch(null, nextChild, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
            } else if (moved) {
              if (j < 0 || i !== increasingNewIndexSequence[j]) {
                move(nextChild, container, anchor, 2);
              } else {
                j--;
              }
            }
          }
        }
      };
      const move = (vnode, container, anchor, moveType, parentSuspense = null) => {
        const { el, type, transition, children, shapeFlag } = vnode;
        if (shapeFlag & 6) {
          move(vnode.component.subTree, container, anchor, moveType);
          return;
        }
        if (shapeFlag & 128) {
          vnode.suspense.move(container, anchor, moveType);
          return;
        }
        if (shapeFlag & 64) {
          type.move(vnode, container, anchor, internals);
          return;
        }
        if (type === Fragment) {
          hostInsert(el, container, anchor);
          for (let i = 0; i < children.length; i++) {
            move(children[i], container, anchor, moveType);
          }
          hostInsert(vnode.anchor, container, anchor);
          return;
        }
        if (type === Static) {
          moveStaticNode(vnode, container, anchor);
          return;
        }
        const needTransition = moveType !== 2 && shapeFlag & 1 && transition;
        if (needTransition) {
          if (moveType === 0) {
            transition.beforeEnter(el);
            hostInsert(el, container, anchor);
            queuePostRenderEffect(() => transition.enter(el), parentSuspense);
          } else {
            const { leave, delayLeave, afterLeave } = transition;
            const remove3 = () => hostInsert(el, container, anchor);
            const performLeave = () => {
              leave(el, () => {
                remove3();
                afterLeave && afterLeave();
              });
            };
            if (delayLeave) {
              delayLeave(el, remove3, performLeave);
            } else {
              performLeave();
            }
          }
        } else {
          hostInsert(el, container, anchor);
        }
      };
      const unmount = (vnode, parentComponent, parentSuspense, doRemove = false, optimized = false) => {
        const { type, props, ref, children, dynamicChildren, shapeFlag, patchFlag, dirs } = vnode;
        if (ref != null) {
          setRef(ref, null, parentSuspense, vnode, true);
        }
        if (shapeFlag & 256) {
          parentComponent.ctx.deactivate(vnode);
          return;
        }
        const shouldInvokeDirs = shapeFlag & 1 && dirs;
        const shouldInvokeVnodeHook = !isAsyncWrapper(vnode);
        let vnodeHook;
        if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeBeforeUnmount)) {
          invokeVNodeHook(vnodeHook, parentComponent, vnode);
        }
        if (shapeFlag & 6) {
          unmountComponent(vnode.component, parentSuspense, doRemove);
        } else {
          if (shapeFlag & 128) {
            vnode.suspense.unmount(parentSuspense, doRemove);
            return;
          }
          if (shouldInvokeDirs) {
            invokeDirectiveHook(vnode, null, parentComponent, "beforeUnmount");
          }
          if (shapeFlag & 64) {
            vnode.type.remove(vnode, parentComponent, parentSuspense, optimized, internals, doRemove);
          } else if (dynamicChildren && (type !== Fragment || patchFlag > 0 && patchFlag & 64)) {
            unmountChildren(dynamicChildren, parentComponent, parentSuspense, false, true);
          } else if (type === Fragment && patchFlag & (128 | 256) || !optimized && shapeFlag & 16) {
            unmountChildren(children, parentComponent, parentSuspense);
          }
          if (doRemove) {
            remove2(vnode);
          }
        }
        if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs) {
          queuePostRenderEffect(() => {
            vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
            shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, "unmounted");
          }, parentSuspense);
        }
      };
      const remove2 = (vnode) => {
        const { type, el, anchor, transition } = vnode;
        if (type === Fragment) {
          {
            removeFragment(el, anchor);
          }
          return;
        }
        if (type === Static) {
          removeStaticNode(vnode);
          return;
        }
        const performRemove = () => {
          hostRemove(el);
          if (transition && !transition.persisted && transition.afterLeave) {
            transition.afterLeave();
          }
        };
        if (vnode.shapeFlag & 1 && transition && !transition.persisted) {
          const { leave, delayLeave } = transition;
          const performLeave = () => leave(el, performRemove);
          if (delayLeave) {
            delayLeave(vnode.el, performRemove, performLeave);
          } else {
            performLeave();
          }
        } else {
          performRemove();
        }
      };
      const removeFragment = (cur, end) => {
        let next;
        while (cur !== end) {
          next = hostNextSibling(cur);
          hostRemove(cur);
          cur = next;
        }
        hostRemove(end);
      };
      const unmountComponent = (instance, parentSuspense, doRemove) => {
        const { bum, scope, update, subTree, um } = instance;
        if (bum) {
          invokeArrayFns(bum);
        }
        scope.stop();
        if (update) {
          update.active = false;
          unmount(subTree, instance, parentSuspense, doRemove);
        }
        if (um) {
          queuePostRenderEffect(um, parentSuspense);
        }
        queuePostRenderEffect(() => {
          instance.isUnmounted = true;
        }, parentSuspense);
        if (parentSuspense && parentSuspense.pendingBranch && !parentSuspense.isUnmounted && instance.asyncDep && !instance.asyncResolved && instance.suspenseId === parentSuspense.pendingId) {
          parentSuspense.deps--;
          if (parentSuspense.deps === 0) {
            parentSuspense.resolve();
          }
        }
      };
      const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, optimized = false, start = 0) => {
        for (let i = start; i < children.length; i++) {
          unmount(children[i], parentComponent, parentSuspense, doRemove, optimized);
        }
      };
      const getNextHostNode = (vnode) => {
        if (vnode.shapeFlag & 6) {
          return getNextHostNode(vnode.component.subTree);
        }
        if (vnode.shapeFlag & 128) {
          return vnode.suspense.next();
        }
        return hostNextSibling(vnode.anchor || vnode.el);
      };
      const render = (vnode, container, isSVG) => {
        if (vnode == null) {
          if (container._vnode) {
            unmount(container._vnode, null, null, true);
          }
        } else {
          patch(container._vnode || null, vnode, container, null, null, null, isSVG);
        }
        flushPreFlushCbs();
        flushPostFlushCbs();
        container._vnode = vnode;
      };
      const internals = {
        p: patch,
        um: unmount,
        m: move,
        r: remove2,
        mt: mountComponent,
        mc: mountChildren,
        pc: patchChildren,
        pbc: patchBlockChildren,
        n: getNextHostNode,
        o: options
      };
      let hydrate;
      let hydrateNode;
      if (createHydrationFns) {
        [hydrate, hydrateNode] = createHydrationFns(internals);
      }
      return {
        render,
        hydrate,
        createApp: createAppAPI(render, hydrate)
      };
    }
    function toggleRecurse({ effect, update }, allowed) {
      effect.allowRecurse = update.allowRecurse = allowed;
    }
    function traverseStaticChildren(n1, n2, shallow = false) {
      const ch1 = n1.children;
      const ch2 = n2.children;
      if (isArray(ch1) && isArray(ch2)) {
        for (let i = 0; i < ch1.length; i++) {
          const c1 = ch1[i];
          let c2 = ch2[i];
          if (c2.shapeFlag & 1 && !c2.dynamicChildren) {
            if (c2.patchFlag <= 0 || c2.patchFlag === 32) {
              c2 = ch2[i] = cloneIfMounted(ch2[i]);
              c2.el = c1.el;
            }
            if (!shallow)
              traverseStaticChildren(c1, c2);
          }
          if (c2.type === Text) {
            c2.el = c1.el;
          }
        }
      }
    }
    function getSequence(arr) {
      const p2 = arr.slice();
      const result = [0];
      let i, j, u, v, c;
      const len = arr.length;
      for (i = 0; i < len; i++) {
        const arrI = arr[i];
        if (arrI !== 0) {
          j = result[result.length - 1];
          if (arr[j] < arrI) {
            p2[i] = j;
            result.push(i);
            continue;
          }
          u = 0;
          v = result.length - 1;
          while (u < v) {
            c = u + v >> 1;
            if (arr[result[c]] < arrI) {
              u = c + 1;
            } else {
              v = c;
            }
          }
          if (arrI < arr[result[u]]) {
            if (u > 0) {
              p2[i] = result[u - 1];
            }
            result[u] = i;
          }
        }
      }
      u = result.length;
      v = result[u - 1];
      while (u-- > 0) {
        result[u] = v;
        v = p2[v];
      }
      return result;
    }
    const isTeleport = (type) => type.__isTeleport;
    const Fragment = Symbol(void 0);
    const Text = Symbol(void 0);
    const Comment = Symbol(void 0);
    const Static = Symbol(void 0);
    const blockStack = [];
    let currentBlock = null;
    function openBlock(disableTracking = false) {
      blockStack.push(currentBlock = disableTracking ? null : []);
    }
    function closeBlock() {
      blockStack.pop();
      currentBlock = blockStack[blockStack.length - 1] || null;
    }
    let isBlockTreeEnabled = 1;
    function setBlockTracking(value) {
      isBlockTreeEnabled += value;
    }
    function setupBlock(vnode) {
      vnode.dynamicChildren = isBlockTreeEnabled > 0 ? currentBlock || EMPTY_ARR : null;
      closeBlock();
      if (isBlockTreeEnabled > 0 && currentBlock) {
        currentBlock.push(vnode);
      }
      return vnode;
    }
    function createElementBlock(type, props, children, patchFlag, dynamicProps, shapeFlag) {
      return setupBlock(createBaseVNode(type, props, children, patchFlag, dynamicProps, shapeFlag, true));
    }
    function createBlock(type, props, children, patchFlag, dynamicProps) {
      return setupBlock(createVNode(type, props, children, patchFlag, dynamicProps, true));
    }
    function isVNode(value) {
      return value ? value.__v_isVNode === true : false;
    }
    function isSameVNodeType(n1, n2) {
      return n1.type === n2.type && n1.key === n2.key;
    }
    const InternalObjectKey = `__vInternal`;
    const normalizeKey = ({ key }) => key != null ? key : null;
    const normalizeRef = ({ ref, ref_key, ref_for }) => {
      return ref != null ? isString$1(ref) || isRef(ref) || isFunction(ref) ? { i: currentRenderingInstance, r: ref, k: ref_key, f: !!ref_for } : ref : null;
    };
    function createBaseVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, shapeFlag = type === Fragment ? 0 : 1, isBlockNode = false, needFullChildrenNormalization = false) {
      const vnode = {
        __v_isVNode: true,
        __v_skip: true,
        type,
        props,
        key: props && normalizeKey(props),
        ref: props && normalizeRef(props),
        scopeId: currentScopeId,
        slotScopeIds: null,
        children,
        component: null,
        suspense: null,
        ssContent: null,
        ssFallback: null,
        dirs: null,
        transition: null,
        el: null,
        anchor: null,
        target: null,
        targetAnchor: null,
        staticCount: 0,
        shapeFlag,
        patchFlag,
        dynamicProps,
        dynamicChildren: null,
        appContext: null,
        ctx: currentRenderingInstance
      };
      if (needFullChildrenNormalization) {
        normalizeChildren(vnode, children);
        if (shapeFlag & 128) {
          type.normalize(vnode);
        }
      } else if (children) {
        vnode.shapeFlag |= isString$1(children) ? 8 : 16;
      }
      if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock && (vnode.patchFlag > 0 || shapeFlag & 6) && vnode.patchFlag !== 32) {
        currentBlock.push(vnode);
      }
      return vnode;
    }
    const createVNode = _createVNode;
    function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
      if (!type || type === NULL_DYNAMIC_COMPONENT) {
        type = Comment;
      }
      if (isVNode(type)) {
        const cloned = cloneVNode(type, props, true);
        if (children) {
          normalizeChildren(cloned, children);
        }
        if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock) {
          if (cloned.shapeFlag & 6) {
            currentBlock[currentBlock.indexOf(type)] = cloned;
          } else {
            currentBlock.push(cloned);
          }
        }
        cloned.patchFlag |= -2;
        return cloned;
      }
      if (isClassComponent(type)) {
        type = type.__vccOpts;
      }
      if (props) {
        props = guardReactiveProps(props);
        let { class: klass, style } = props;
        if (klass && !isString$1(klass)) {
          props.class = normalizeClass(klass);
        }
        if (isObject(style)) {
          if (isProxy(style) && !isArray(style)) {
            style = extend({}, style);
          }
          props.style = normalizeStyle(style);
        }
      }
      const shapeFlag = isString$1(type) ? 1 : isSuspense(type) ? 128 : isTeleport(type) ? 64 : isObject(type) ? 4 : isFunction(type) ? 2 : 0;
      return createBaseVNode(type, props, children, patchFlag, dynamicProps, shapeFlag, isBlockNode, true);
    }
    function guardReactiveProps(props) {
      if (!props)
        return null;
      return isProxy(props) || InternalObjectKey in props ? extend({}, props) : props;
    }
    function cloneVNode(vnode, extraProps, mergeRef = false) {
      const { props, ref, patchFlag, children } = vnode;
      const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
      const cloned = {
        __v_isVNode: true,
        __v_skip: true,
        type: vnode.type,
        props: mergedProps,
        key: mergedProps && normalizeKey(mergedProps),
        ref: extraProps && extraProps.ref ? mergeRef && ref ? isArray(ref) ? ref.concat(normalizeRef(extraProps)) : [ref, normalizeRef(extraProps)] : normalizeRef(extraProps) : ref,
        scopeId: vnode.scopeId,
        slotScopeIds: vnode.slotScopeIds,
        children,
        target: vnode.target,
        targetAnchor: vnode.targetAnchor,
        staticCount: vnode.staticCount,
        shapeFlag: vnode.shapeFlag,
        patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 ? 16 : patchFlag | 16 : patchFlag,
        dynamicProps: vnode.dynamicProps,
        dynamicChildren: vnode.dynamicChildren,
        appContext: vnode.appContext,
        dirs: vnode.dirs,
        transition: vnode.transition,
        component: vnode.component,
        suspense: vnode.suspense,
        ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
        ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
        el: vnode.el,
        anchor: vnode.anchor,
        ctx: vnode.ctx
      };
      return cloned;
    }
    function createTextVNode(text = " ", flag = 0) {
      return createVNode(Text, null, text, flag);
    }
    function createCommentVNode(text = "", asBlock = false) {
      return asBlock ? (openBlock(), createBlock(Comment, null, text)) : createVNode(Comment, null, text);
    }
    function normalizeVNode(child) {
      if (child == null || typeof child === "boolean") {
        return createVNode(Comment);
      } else if (isArray(child)) {
        return createVNode(
          Fragment,
          null,
          child.slice()
        );
      } else if (typeof child === "object") {
        return cloneIfMounted(child);
      } else {
        return createVNode(Text, null, String(child));
      }
    }
    function cloneIfMounted(child) {
      return child.el === null && child.patchFlag !== -1 || child.memo ? child : cloneVNode(child);
    }
    function normalizeChildren(vnode, children) {
      let type = 0;
      const { shapeFlag } = vnode;
      if (children == null) {
        children = null;
      } else if (isArray(children)) {
        type = 16;
      } else if (typeof children === "object") {
        if (shapeFlag & (1 | 64)) {
          const slot = children.default;
          if (slot) {
            slot._c && (slot._d = false);
            normalizeChildren(vnode, slot());
            slot._c && (slot._d = true);
          }
          return;
        } else {
          type = 32;
          const slotFlag = children._;
          if (!slotFlag && !(InternalObjectKey in children)) {
            children._ctx = currentRenderingInstance;
          } else if (slotFlag === 3 && currentRenderingInstance) {
            if (currentRenderingInstance.slots._ === 1) {
              children._ = 1;
            } else {
              children._ = 2;
              vnode.patchFlag |= 1024;
            }
          }
        }
      } else if (isFunction(children)) {
        children = { default: children, _ctx: currentRenderingInstance };
        type = 32;
      } else {
        children = String(children);
        if (shapeFlag & 64) {
          type = 16;
          children = [createTextVNode(children)];
        } else {
          type = 8;
        }
      }
      vnode.children = children;
      vnode.shapeFlag |= type;
    }
    function mergeProps(...args) {
      const ret = {};
      for (let i = 0; i < args.length; i++) {
        const toMerge = args[i];
        for (const key in toMerge) {
          if (key === "class") {
            if (ret.class !== toMerge.class) {
              ret.class = normalizeClass([ret.class, toMerge.class]);
            }
          } else if (key === "style") {
            ret.style = normalizeStyle([ret.style, toMerge.style]);
          } else if (isOn(key)) {
            const existing = ret[key];
            const incoming = toMerge[key];
            if (incoming && existing !== incoming && !(isArray(existing) && existing.includes(incoming))) {
              ret[key] = existing ? [].concat(existing, incoming) : incoming;
            }
          } else if (key !== "") {
            ret[key] = toMerge[key];
          }
        }
      }
      return ret;
    }
    function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
      callWithAsyncErrorHandling(hook, instance, 7, [
        vnode,
        prevVNode
      ]);
    }
    const emptyAppContext = createAppContext();
    let uid$1 = 0;
    function createComponentInstance(vnode, parent, suspense) {
      const type = vnode.type;
      const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
      const instance = {
        uid: uid$1++,
        vnode,
        type,
        parent,
        appContext,
        root: null,
        next: null,
        subTree: null,
        effect: null,
        update: null,
        scope: new EffectScope(true),
        render: null,
        proxy: null,
        exposed: null,
        exposeProxy: null,
        withProxy: null,
        provides: parent ? parent.provides : Object.create(appContext.provides),
        accessCache: null,
        renderCache: [],
        components: null,
        directives: null,
        propsOptions: normalizePropsOptions(type, appContext),
        emitsOptions: normalizeEmitsOptions(type, appContext),
        emit: null,
        emitted: null,
        propsDefaults: EMPTY_OBJ,
        inheritAttrs: type.inheritAttrs,
        ctx: EMPTY_OBJ,
        data: EMPTY_OBJ,
        props: EMPTY_OBJ,
        attrs: EMPTY_OBJ,
        slots: EMPTY_OBJ,
        refs: EMPTY_OBJ,
        setupState: EMPTY_OBJ,
        setupContext: null,
        suspense,
        suspenseId: suspense ? suspense.pendingId : 0,
        asyncDep: null,
        asyncResolved: false,
        isMounted: false,
        isUnmounted: false,
        isDeactivated: false,
        bc: null,
        c: null,
        bm: null,
        m: null,
        bu: null,
        u: null,
        um: null,
        bum: null,
        da: null,
        a: null,
        rtg: null,
        rtc: null,
        ec: null,
        sp: null
      };
      {
        instance.ctx = { _: instance };
      }
      instance.root = parent ? parent.root : instance;
      instance.emit = emit$1.bind(null, instance);
      if (vnode.ce) {
        vnode.ce(instance);
      }
      return instance;
    }
    let currentInstance = null;
    const getCurrentInstance = () => currentInstance || currentRenderingInstance;
    const setCurrentInstance = (instance) => {
      currentInstance = instance;
      instance.scope.on();
    };
    const unsetCurrentInstance = () => {
      currentInstance && currentInstance.scope.off();
      currentInstance = null;
    };
    function isStatefulComponent(instance) {
      return instance.vnode.shapeFlag & 4;
    }
    let isInSSRComponentSetup = false;
    function setupComponent(instance, isSSR = false) {
      isInSSRComponentSetup = isSSR;
      const { props, children } = instance.vnode;
      const isStateful = isStatefulComponent(instance);
      initProps(instance, props, isStateful, isSSR);
      initSlots(instance, children);
      const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
      isInSSRComponentSetup = false;
      return setupResult;
    }
    function setupStatefulComponent(instance, isSSR) {
      const Component = instance.type;
      instance.accessCache = /* @__PURE__ */ Object.create(null);
      instance.proxy = markRaw(new Proxy(instance.ctx, PublicInstanceProxyHandlers));
      const { setup } = Component;
      if (setup) {
        const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
        setCurrentInstance(instance);
        pauseTracking();
        const setupResult = callWithErrorHandling(setup, instance, 0, [instance.props, setupContext]);
        resetTracking();
        unsetCurrentInstance();
        if (isPromise(setupResult)) {
          setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
          if (isSSR) {
            return setupResult.then((resolvedResult) => {
              handleSetupResult(instance, resolvedResult, isSSR);
            }).catch((e) => {
              handleError(e, instance, 0);
            });
          } else {
            instance.asyncDep = setupResult;
          }
        } else {
          handleSetupResult(instance, setupResult, isSSR);
        }
      } else {
        finishComponentSetup(instance, isSSR);
      }
    }
    function handleSetupResult(instance, setupResult, isSSR) {
      if (isFunction(setupResult)) {
        if (instance.type.__ssrInlineRender) {
          instance.ssrRender = setupResult;
        } else {
          instance.render = setupResult;
        }
      } else if (isObject(setupResult)) {
        instance.setupState = proxyRefs(setupResult);
      } else
        ;
      finishComponentSetup(instance, isSSR);
    }
    let compile;
    function finishComponentSetup(instance, isSSR, skipOptions) {
      const Component = instance.type;
      if (!instance.render) {
        if (!isSSR && compile && !Component.render) {
          const template = Component.template || resolveMergedOptions(instance).template;
          if (template) {
            const { isCustomElement, compilerOptions } = instance.appContext.config;
            const { delimiters, compilerOptions: componentCompilerOptions } = Component;
            const finalCompilerOptions = extend(extend({
              isCustomElement,
              delimiters
            }, compilerOptions), componentCompilerOptions);
            Component.render = compile(template, finalCompilerOptions);
          }
        }
        instance.render = Component.render || NOOP;
      }
      {
        setCurrentInstance(instance);
        pauseTracking();
        applyOptions(instance);
        resetTracking();
        unsetCurrentInstance();
      }
    }
    function createAttrsProxy(instance) {
      return new Proxy(instance.attrs, {
        get(target, key) {
          track(instance, "get", "$attrs");
          return target[key];
        }
      });
    }
    function createSetupContext(instance) {
      const expose = (exposed) => {
        instance.exposed = exposed || {};
      };
      let attrs;
      {
        return {
          get attrs() {
            return attrs || (attrs = createAttrsProxy(instance));
          },
          slots: instance.slots,
          emit: instance.emit,
          expose
        };
      }
    }
    function getExposeProxy(instance) {
      if (instance.exposed) {
        return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
          get(target, key) {
            if (key in target) {
              return target[key];
            } else if (key in publicPropertiesMap) {
              return publicPropertiesMap[key](instance);
            }
          },
          has(target, key) {
            return key in target || key in publicPropertiesMap;
          }
        }));
      }
    }
    function getComponentName(Component, includeInferred = true) {
      return isFunction(Component) ? Component.displayName || Component.name : Component.name || includeInferred && Component.__name;
    }
    function isClassComponent(value) {
      return isFunction(value) && "__vccOpts" in value;
    }
    const computed = (getterOrOptions, debugOptions) => {
      return computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
    };
    function h(type, propsOrChildren, children) {
      const l = arguments.length;
      if (l === 2) {
        if (isObject(propsOrChildren) && !isArray(propsOrChildren)) {
          if (isVNode(propsOrChildren)) {
            return createVNode(type, null, [propsOrChildren]);
          }
          return createVNode(type, propsOrChildren);
        } else {
          return createVNode(type, null, propsOrChildren);
        }
      } else {
        if (l > 3) {
          children = Array.prototype.slice.call(arguments, 2);
        } else if (l === 3 && isVNode(children)) {
          children = [children];
        }
        return createVNode(type, propsOrChildren, children);
      }
    }
    const ssrContextKey = Symbol(``);
    const useSSRContext = () => {
      {
        const ctx = inject(ssrContextKey);
        return ctx;
      }
    };
    const version = "3.2.45";
    const svgNS = "http://www.w3.org/2000/svg";
    const doc = typeof document !== "undefined" ? document : null;
    const templateContainer = doc && /* @__PURE__ */ doc.createElement("template");
    const nodeOps = {
      insert: (child, parent, anchor) => {
        parent.insertBefore(child, anchor || null);
      },
      remove: (child) => {
        const parent = child.parentNode;
        if (parent) {
          parent.removeChild(child);
        }
      },
      createElement: (tag, isSVG, is, props) => {
        const el = isSVG ? doc.createElementNS(svgNS, tag) : doc.createElement(tag, is ? { is } : void 0);
        if (tag === "select" && props && props.multiple != null) {
          el.setAttribute("multiple", props.multiple);
        }
        return el;
      },
      createText: (text) => doc.createTextNode(text),
      createComment: (text) => doc.createComment(text),
      setText: (node, text) => {
        node.nodeValue = text;
      },
      setElementText: (el, text) => {
        el.textContent = text;
      },
      parentNode: (node) => node.parentNode,
      nextSibling: (node) => node.nextSibling,
      querySelector: (selector) => doc.querySelector(selector),
      setScopeId(el, id) {
        el.setAttribute(id, "");
      },
      insertStaticContent(content, parent, anchor, isSVG, start, end) {
        const before = anchor ? anchor.previousSibling : parent.lastChild;
        if (start && (start === end || start.nextSibling)) {
          while (true) {
            parent.insertBefore(start.cloneNode(true), anchor);
            if (start === end || !(start = start.nextSibling))
              break;
          }
        } else {
          templateContainer.innerHTML = isSVG ? `<svg>${content}</svg>` : content;
          const template = templateContainer.content;
          if (isSVG) {
            const wrapper = template.firstChild;
            while (wrapper.firstChild) {
              template.appendChild(wrapper.firstChild);
            }
            template.removeChild(wrapper);
          }
          parent.insertBefore(template, anchor);
        }
        return [
          before ? before.nextSibling : parent.firstChild,
          anchor ? anchor.previousSibling : parent.lastChild
        ];
      }
    };
    function patchClass(el, value, isSVG) {
      const transitionClasses = el._vtc;
      if (transitionClasses) {
        value = (value ? [value, ...transitionClasses] : [...transitionClasses]).join(" ");
      }
      if (value == null) {
        el.removeAttribute("class");
      } else if (isSVG) {
        el.setAttribute("class", value);
      } else {
        el.className = value;
      }
    }
    function patchStyle(el, prev, next) {
      const style = el.style;
      const isCssString = isString$1(next);
      if (next && !isCssString) {
        for (const key in next) {
          setStyle(style, key, next[key]);
        }
        if (prev && !isString$1(prev)) {
          for (const key in prev) {
            if (next[key] == null) {
              setStyle(style, key, "");
            }
          }
        }
      } else {
        const currentDisplay = style.display;
        if (isCssString) {
          if (prev !== next) {
            style.cssText = next;
          }
        } else if (prev) {
          el.removeAttribute("style");
        }
        if ("_vod" in el) {
          style.display = currentDisplay;
        }
      }
    }
    const importantRE = /\s*!important$/;
    function setStyle(style, name, val) {
      if (isArray(val)) {
        val.forEach((v) => setStyle(style, name, v));
      } else {
        if (val == null)
          val = "";
        if (name.startsWith("--")) {
          style.setProperty(name, val);
        } else {
          const prefixed = autoPrefix(style, name);
          if (importantRE.test(val)) {
            style.setProperty(hyphenate(prefixed), val.replace(importantRE, ""), "important");
          } else {
            style[prefixed] = val;
          }
        }
      }
    }
    const prefixes = ["Webkit", "Moz", "ms"];
    const prefixCache = {};
    function autoPrefix(style, rawName) {
      const cached = prefixCache[rawName];
      if (cached) {
        return cached;
      }
      let name = camelize(rawName);
      if (name !== "filter" && name in style) {
        return prefixCache[rawName] = name;
      }
      name = capitalize(name);
      for (let i = 0; i < prefixes.length; i++) {
        const prefixed = prefixes[i] + name;
        if (prefixed in style) {
          return prefixCache[rawName] = prefixed;
        }
      }
      return rawName;
    }
    const xlinkNS = "http://www.w3.org/1999/xlink";
    function patchAttr(el, key, value, isSVG, instance) {
      if (isSVG && key.startsWith("xlink:")) {
        if (value == null) {
          el.removeAttributeNS(xlinkNS, key.slice(6, key.length));
        } else {
          el.setAttributeNS(xlinkNS, key, value);
        }
      } else {
        const isBoolean = isSpecialBooleanAttr(key);
        if (value == null || isBoolean && !includeBooleanAttr(value)) {
          el.removeAttribute(key);
        } else {
          el.setAttribute(key, isBoolean ? "" : value);
        }
      }
    }
    function patchDOMProp(el, key, value, prevChildren, parentComponent, parentSuspense, unmountChildren) {
      if (key === "innerHTML" || key === "textContent") {
        if (prevChildren) {
          unmountChildren(prevChildren, parentComponent, parentSuspense);
        }
        el[key] = value == null ? "" : value;
        return;
      }
      if (key === "value" && el.tagName !== "PROGRESS" && !el.tagName.includes("-")) {
        el._value = value;
        const newValue = value == null ? "" : value;
        if (el.value !== newValue || el.tagName === "OPTION") {
          el.value = newValue;
        }
        if (value == null) {
          el.removeAttribute(key);
        }
        return;
      }
      let needRemove = false;
      if (value === "" || value == null) {
        const type = typeof el[key];
        if (type === "boolean") {
          value = includeBooleanAttr(value);
        } else if (value == null && type === "string") {
          value = "";
          needRemove = true;
        } else if (type === "number") {
          value = 0;
          needRemove = true;
        }
      }
      try {
        el[key] = value;
      } catch (e) {
      }
      needRemove && el.removeAttribute(key);
    }
    function addEventListener$1(el, event, handler, options) {
      el.addEventListener(event, handler, options);
    }
    function removeEventListener$1(el, event, handler, options) {
      el.removeEventListener(event, handler, options);
    }
    function patchEvent(el, rawName, prevValue, nextValue, instance = null) {
      const invokers = el._vei || (el._vei = {});
      const existingInvoker = invokers[rawName];
      if (nextValue && existingInvoker) {
        existingInvoker.value = nextValue;
      } else {
        const [name, options] = parseName(rawName);
        if (nextValue) {
          const invoker = invokers[rawName] = createInvoker(nextValue, instance);
          addEventListener$1(el, name, invoker, options);
        } else if (existingInvoker) {
          removeEventListener$1(el, name, existingInvoker, options);
          invokers[rawName] = void 0;
        }
      }
    }
    const optionsModifierRE = /(?:Once|Passive|Capture)$/;
    function parseName(name) {
      let options;
      if (optionsModifierRE.test(name)) {
        options = {};
        let m;
        while (m = name.match(optionsModifierRE)) {
          name = name.slice(0, name.length - m[0].length);
          options[m[0].toLowerCase()] = true;
        }
      }
      const event = name[2] === ":" ? name.slice(3) : hyphenate(name.slice(2));
      return [event, options];
    }
    let cachedNow = 0;
    const p = /* @__PURE__ */ Promise.resolve();
    const getNow = () => cachedNow || (p.then(() => cachedNow = 0), cachedNow = Date.now());
    function createInvoker(initialValue, instance) {
      const invoker = (e) => {
        if (!e._vts) {
          e._vts = Date.now();
        } else if (e._vts <= invoker.attached) {
          return;
        }
        callWithAsyncErrorHandling(patchStopImmediatePropagation(e, invoker.value), instance, 5, [e]);
      };
      invoker.value = initialValue;
      invoker.attached = getNow();
      return invoker;
    }
    function patchStopImmediatePropagation(e, value) {
      if (isArray(value)) {
        const originalStop = e.stopImmediatePropagation;
        e.stopImmediatePropagation = () => {
          originalStop.call(e);
          e._stopped = true;
        };
        return value.map((fn) => (e2) => !e2._stopped && fn && fn(e2));
      } else {
        return value;
      }
    }
    const nativeOnRE = /^on[a-z]/;
    const patchProp = (el, key, prevValue, nextValue, isSVG = false, prevChildren, parentComponent, parentSuspense, unmountChildren) => {
      if (key === "class") {
        patchClass(el, nextValue, isSVG);
      } else if (key === "style") {
        patchStyle(el, prevValue, nextValue);
      } else if (isOn(key)) {
        if (!isModelListener(key)) {
          patchEvent(el, key, prevValue, nextValue, parentComponent);
        }
      } else if (key[0] === "." ? (key = key.slice(1), true) : key[0] === "^" ? (key = key.slice(1), false) : shouldSetAsProp(el, key, nextValue, isSVG)) {
        patchDOMProp(el, key, nextValue, prevChildren, parentComponent, parentSuspense, unmountChildren);
      } else {
        if (key === "true-value") {
          el._trueValue = nextValue;
        } else if (key === "false-value") {
          el._falseValue = nextValue;
        }
        patchAttr(el, key, nextValue, isSVG);
      }
    };
    function shouldSetAsProp(el, key, value, isSVG) {
      if (isSVG) {
        if (key === "innerHTML" || key === "textContent") {
          return true;
        }
        if (key in el && nativeOnRE.test(key) && isFunction(value)) {
          return true;
        }
        return false;
      }
      if (key === "spellcheck" || key === "draggable" || key === "translate") {
        return false;
      }
      if (key === "form") {
        return false;
      }
      if (key === "list" && el.tagName === "INPUT") {
        return false;
      }
      if (key === "type" && el.tagName === "TEXTAREA") {
        return false;
      }
      if (nativeOnRE.test(key) && isString$1(value)) {
        return false;
      }
      return key in el;
    }
    const TRANSITION = "transition";
    const ANIMATION = "animation";
    const Transition = (props, { slots }) => h(BaseTransition, resolveTransitionProps(props), slots);
    Transition.displayName = "Transition";
    const DOMTransitionPropsValidators = {
      name: String,
      type: String,
      css: {
        type: Boolean,
        default: true
      },
      duration: [String, Number, Object],
      enterFromClass: String,
      enterActiveClass: String,
      enterToClass: String,
      appearFromClass: String,
      appearActiveClass: String,
      appearToClass: String,
      leaveFromClass: String,
      leaveActiveClass: String,
      leaveToClass: String
    };
    Transition.props = /* @__PURE__ */ extend({}, BaseTransition.props, DOMTransitionPropsValidators);
    const callHook = (hook, args = []) => {
      if (isArray(hook)) {
        hook.forEach((h2) => h2(...args));
      } else if (hook) {
        hook(...args);
      }
    };
    const hasExplicitCallback = (hook) => {
      return hook ? isArray(hook) ? hook.some((h2) => h2.length > 1) : hook.length > 1 : false;
    };
    function resolveTransitionProps(rawProps) {
      const baseProps = {};
      for (const key in rawProps) {
        if (!(key in DOMTransitionPropsValidators)) {
          baseProps[key] = rawProps[key];
        }
      }
      if (rawProps.css === false) {
        return baseProps;
      }
      const { name = "v", type, duration, enterFromClass = `${name}-enter-from`, enterActiveClass = `${name}-enter-active`, enterToClass = `${name}-enter-to`, appearFromClass = enterFromClass, appearActiveClass = enterActiveClass, appearToClass = enterToClass, leaveFromClass = `${name}-leave-from`, leaveActiveClass = `${name}-leave-active`, leaveToClass = `${name}-leave-to` } = rawProps;
      const durations = normalizeDuration(duration);
      const enterDuration = durations && durations[0];
      const leaveDuration = durations && durations[1];
      const { onBeforeEnter, onEnter, onEnterCancelled, onLeave, onLeaveCancelled, onBeforeAppear = onBeforeEnter, onAppear = onEnter, onAppearCancelled = onEnterCancelled } = baseProps;
      const finishEnter = (el, isAppear, done) => {
        removeTransitionClass(el, isAppear ? appearToClass : enterToClass);
        removeTransitionClass(el, isAppear ? appearActiveClass : enterActiveClass);
        done && done();
      };
      const finishLeave = (el, done) => {
        el._isLeaving = false;
        removeTransitionClass(el, leaveFromClass);
        removeTransitionClass(el, leaveToClass);
        removeTransitionClass(el, leaveActiveClass);
        done && done();
      };
      const makeEnterHook = (isAppear) => {
        return (el, done) => {
          const hook = isAppear ? onAppear : onEnter;
          const resolve2 = () => finishEnter(el, isAppear, done);
          callHook(hook, [el, resolve2]);
          nextFrame(() => {
            removeTransitionClass(el, isAppear ? appearFromClass : enterFromClass);
            addTransitionClass(el, isAppear ? appearToClass : enterToClass);
            if (!hasExplicitCallback(hook)) {
              whenTransitionEnds(el, type, enterDuration, resolve2);
            }
          });
        };
      };
      return extend(baseProps, {
        onBeforeEnter(el) {
          callHook(onBeforeEnter, [el]);
          addTransitionClass(el, enterFromClass);
          addTransitionClass(el, enterActiveClass);
        },
        onBeforeAppear(el) {
          callHook(onBeforeAppear, [el]);
          addTransitionClass(el, appearFromClass);
          addTransitionClass(el, appearActiveClass);
        },
        onEnter: makeEnterHook(false),
        onAppear: makeEnterHook(true),
        onLeave(el, done) {
          el._isLeaving = true;
          const resolve2 = () => finishLeave(el, done);
          addTransitionClass(el, leaveFromClass);
          forceReflow();
          addTransitionClass(el, leaveActiveClass);
          nextFrame(() => {
            if (!el._isLeaving) {
              return;
            }
            removeTransitionClass(el, leaveFromClass);
            addTransitionClass(el, leaveToClass);
            if (!hasExplicitCallback(onLeave)) {
              whenTransitionEnds(el, type, leaveDuration, resolve2);
            }
          });
          callHook(onLeave, [el, resolve2]);
        },
        onEnterCancelled(el) {
          finishEnter(el, false);
          callHook(onEnterCancelled, [el]);
        },
        onAppearCancelled(el) {
          finishEnter(el, true);
          callHook(onAppearCancelled, [el]);
        },
        onLeaveCancelled(el) {
          finishLeave(el);
          callHook(onLeaveCancelled, [el]);
        }
      });
    }
    function normalizeDuration(duration) {
      if (duration == null) {
        return null;
      } else if (isObject(duration)) {
        return [NumberOf(duration.enter), NumberOf(duration.leave)];
      } else {
        const n = NumberOf(duration);
        return [n, n];
      }
    }
    function NumberOf(val) {
      const res = toNumber(val);
      return res;
    }
    function addTransitionClass(el, cls) {
      cls.split(/\s+/).forEach((c) => c && el.classList.add(c));
      (el._vtc || (el._vtc = /* @__PURE__ */ new Set())).add(cls);
    }
    function removeTransitionClass(el, cls) {
      cls.split(/\s+/).forEach((c) => c && el.classList.remove(c));
      const { _vtc } = el;
      if (_vtc) {
        _vtc.delete(cls);
        if (!_vtc.size) {
          el._vtc = void 0;
        }
      }
    }
    function nextFrame(cb) {
      requestAnimationFrame(() => {
        requestAnimationFrame(cb);
      });
    }
    let endId = 0;
    function whenTransitionEnds(el, expectedType, explicitTimeout, resolve2) {
      const id = el._endId = ++endId;
      const resolveIfNotStale = () => {
        if (id === el._endId) {
          resolve2();
        }
      };
      if (explicitTimeout) {
        return setTimeout(resolveIfNotStale, explicitTimeout);
      }
      const { type, timeout, propCount } = getTransitionInfo(el, expectedType);
      if (!type) {
        return resolve2();
      }
      const endEvent = type + "end";
      let ended = 0;
      const end = () => {
        el.removeEventListener(endEvent, onEnd);
        resolveIfNotStale();
      };
      const onEnd = (e) => {
        if (e.target === el && ++ended >= propCount) {
          end();
        }
      };
      setTimeout(() => {
        if (ended < propCount) {
          end();
        }
      }, timeout + 1);
      el.addEventListener(endEvent, onEnd);
    }
    function getTransitionInfo(el, expectedType) {
      const styles = window.getComputedStyle(el);
      const getStyleProperties = (key) => (styles[key] || "").split(", ");
      const transitionDelays = getStyleProperties(`${TRANSITION}Delay`);
      const transitionDurations = getStyleProperties(`${TRANSITION}Duration`);
      const transitionTimeout = getTimeout(transitionDelays, transitionDurations);
      const animationDelays = getStyleProperties(`${ANIMATION}Delay`);
      const animationDurations = getStyleProperties(`${ANIMATION}Duration`);
      const animationTimeout = getTimeout(animationDelays, animationDurations);
      let type = null;
      let timeout = 0;
      let propCount = 0;
      if (expectedType === TRANSITION) {
        if (transitionTimeout > 0) {
          type = TRANSITION;
          timeout = transitionTimeout;
          propCount = transitionDurations.length;
        }
      } else if (expectedType === ANIMATION) {
        if (animationTimeout > 0) {
          type = ANIMATION;
          timeout = animationTimeout;
          propCount = animationDurations.length;
        }
      } else {
        timeout = Math.max(transitionTimeout, animationTimeout);
        type = timeout > 0 ? transitionTimeout > animationTimeout ? TRANSITION : ANIMATION : null;
        propCount = type ? type === TRANSITION ? transitionDurations.length : animationDurations.length : 0;
      }
      const hasTransform = type === TRANSITION && /\b(transform|all)(,|$)/.test(getStyleProperties(`${TRANSITION}Property`).toString());
      return {
        type,
        timeout,
        propCount,
        hasTransform
      };
    }
    function getTimeout(delays, durations) {
      while (delays.length < durations.length) {
        delays = delays.concat(delays);
      }
      return Math.max(...durations.map((d, i) => toMs(d) + toMs(delays[i])));
    }
    function toMs(s) {
      return Number(s.slice(0, -1).replace(",", ".")) * 1e3;
    }
    function forceReflow() {
      return document.body.offsetHeight;
    }
    const vShow = {
      beforeMount(el, { value }, { transition }) {
        el._vod = el.style.display === "none" ? "" : el.style.display;
        if (transition && value) {
          transition.beforeEnter(el);
        } else {
          setDisplay(el, value);
        }
      },
      mounted(el, { value }, { transition }) {
        if (transition && value) {
          transition.enter(el);
        }
      },
      updated(el, { value, oldValue }, { transition }) {
        if (!value === !oldValue)
          return;
        if (transition) {
          if (value) {
            transition.beforeEnter(el);
            setDisplay(el, true);
            transition.enter(el);
          } else {
            transition.leave(el, () => {
              setDisplay(el, false);
            });
          }
        } else {
          setDisplay(el, value);
        }
      },
      beforeUnmount(el, { value }) {
        setDisplay(el, value);
      }
    };
    function setDisplay(el, value) {
      el.style.display = value ? el._vod : "none";
    }
    const rendererOptions = /* @__PURE__ */ extend({ patchProp }, nodeOps);
    let renderer;
    function ensureRenderer() {
      return renderer || (renderer = createRenderer(rendererOptions));
    }
    const createApp = (...args) => {
      const app2 = ensureRenderer().createApp(...args);
      const { mount } = app2;
      app2.mount = (containerOrSelector) => {
        const container = normalizeContainer(containerOrSelector);
        if (!container)
          return;
        const component = app2._component;
        if (!isFunction(component) && !component.render && !component.template) {
          component.template = container.innerHTML;
        }
        container.innerHTML = "";
        const proxy = mount(container, false, container instanceof SVGElement);
        if (container instanceof Element) {
          container.removeAttribute("v-cloak");
          container.setAttribute("data-v-app", "");
        }
        return proxy;
      };
      return app2;
    };
    function normalizeContainer(container) {
      if (isString$1(container)) {
        const res = document.querySelector(container);
        return res;
      }
      return container;
    }
    class WindowsService {
      static obtainWindow(name) {
        return new Promise((resolve2, reject) => {
          overwolf.windows.obtainDeclaredWindow(name, (result) => {
            if (result.success) {
              resolve2(result);
            } else {
              console.warn("WindowsService.obtainWindow(): error:", name, result);
              reject(new Error(result.error));
            }
          });
        });
      }
      static getCurrentWindow() {
        return new Promise((resolve2, reject) => {
          overwolf.windows.getCurrentWindow((result) => {
            if (result.success) {
              resolve2(result);
            } else {
              console.warn(
                "WindowsService.getCurrentWindow(): error:",
                result
              );
              reject(new Error(result.error));
            }
          });
        });
      }
      static async restore(name) {
        const { window: window2 } = await WindowsService.obtainWindow(name);
        return new Promise((resolve2, reject) => {
          overwolf.windows.restore(window2.id, (result) => {
            if (result.success) {
              resolve2();
            } else {
              console.warn("WindowsService.restore(): error:", name, result);
              reject(new Error(result.error));
            }
          });
        });
      }
      static async hide(name) {
        const state = await WindowsService.getWindowState(name);
        if (state === "closed")
          return;
        const { window: window2 } = await WindowsService.obtainWindow(name);
        return new Promise((resolve2, reject) => {
          overwolf.windows.hide(window2.id, (result) => {
            if (result.success) {
              resolve2();
            } else {
              console.warn("WindowsService.hide(): error:", name, result);
              reject(new Error(result.error));
            }
          });
        });
      }
      static async minimize(name) {
        const state = await WindowsService.getWindowState(name);
        if (state === "closed")
          return;
        const { window: window2 } = await WindowsService.obtainWindow(name);
        return new Promise((resolve2, reject) => {
          overwolf.windows.minimize(window2.id, (result) => {
            if (result.success) {
              resolve2();
            } else {
              console.warn("WindowsService.minimize(): error:", name, result);
              reject(new Error(result.error));
            }
          });
        });
      }
      static async maximize(name) {
        const { window: window2 } = await WindowsService.obtainWindow(name);
        return new Promise((resolve2, reject) => {
          overwolf.windows.maximize(window2.id, (result) => {
            if (result.success) {
              resolve2();
            } else {
              console.warn("WindowsService.maximize(): error:", name, result);
              reject(new Error(result.error));
            }
          });
        });
      }
      static async close(name) {
        const state = await WindowsService.getWindowState(name);
        if (state === "closed")
          return;
        const { window: window2 } = await WindowsService.obtainWindow(name);
        await new Promise((resolve2) => overwolf.windows.close(window2.id, resolve2));
      }
      static async changePosition(name, left, top) {
        const { window: window2 } = await WindowsService.obtainWindow(name);
        return new Promise((resolve2, reject) => {
          overwolf.windows.changePosition(window2.id, left, top, (result) => {
            if (result && result.success) {
              resolve2(result);
            } else {
              console.warn("WindowsService.changePosition(): error:", name, result);
              reject(new Error(result.error));
            }
          });
        });
      }
      static getWindowState(name) {
        return new Promise((resolve2, reject) => {
          overwolf.windows.getWindowState(name, (result) => {
            if (result.success) {
              resolve2(result.window_state_ex);
            } else {
              console.warn("WindowsService.getWindowState(): error:", name, result);
              reject(new Error(result.error));
            }
          });
        });
      }
      static async setTopmost(name, shouldBeTopmost) {
        const { window: window2 } = await WindowsService.obtainWindow(name);
        return new Promise((resolve2, reject) => {
          overwolf.windows.setTopmost(window2.id, shouldBeTopmost, (result) => {
            if (result.success) {
              resolve2(result);
            } else {
              console.warn("WindowsService.setTopmost(): error:", name, result);
              reject(new Error(result.error));
            }
          });
        });
      }
      static async bringToFront(name, grabFocus = false) {
        const { window: window2 } = await WindowsService.obtainWindow(name);
        return new Promise((resolve2, reject) => {
          overwolf.windows.bringToFront(window2.id, grabFocus, (result) => {
            if (result.success) {
              resolve2(result);
            } else {
              console.warn("WindowsService.bringToFront(): error:", name, result);
              reject(new Error(result.error));
            }
          });
        });
      }
      static getWindowsStates() {
        return new Promise((resolve2, reject) => {
          overwolf.windows.getWindowsStates((state) => {
            if (state.success) {
              resolve2(state.resultV2);
            } else {
              reject(state);
            }
          });
        });
      }
      static getMonitorsList() {
        return new Promise((resolve2, reject) => {
          overwolf.utils.getMonitorsList((result) => {
            if (result && result.success && result.displays) {
              resolve2(result.displays);
            } else {
              console.warn("WindowsService.getMonitorsList(): error:", result);
              reject(new Error(result.error));
            }
          });
        });
      }
      static windowStateIsOpen(state) {
        switch (state) {
          case "normal":
          case "maximized":
            return true;
          default:
            return false;
        }
      }
    }
    const SIGNIFICANT_MOUSE_MOVE_THRESHOLD = 1;
    class DragService {
      constructor(currentWindow, element) {
        this.currentWindow = currentWindow;
        this.initialMousePosition = null;
        this.isMouseDown = false;
        element.addEventListener("mousedown", this.onDragStart.bind(this));
        element.addEventListener("mousemove", this.onMouseMove.bind(this));
        element.className = element.className + " draggable";
      }
      _isSignificantMouseMove(event) {
        if (!this.initialMousePosition) {
          return false;
        }
        const x = event.clientX, y = event.clientY, diffX = Math.abs(x - this.initialMousePosition.x), diffY = Math.abs(y - this.initialMousePosition.y);
        return diffX > SIGNIFICANT_MOUSE_MOVE_THRESHOLD || diffY > SIGNIFICANT_MOUSE_MOVE_THRESHOLD;
      }
      onDragStart(event) {
        this.isMouseDown = true;
        this.initialMousePosition = {
          x: event.clientX,
          y: event.clientY
        };
      }
      onMouseMove(event) {
        if (!this.isMouseDown) {
          return;
        }
        if (!this._isSignificantMouseMove(event)) {
          return;
        }
        this.isMouseDown = false;
        if (this.currentWindow) {
          overwolf.windows.dragMove(this.currentWindow.id);
        }
      }
    }
    const kAppStates = {
      INITIALIZATION: "INITIALIZATION",
      DESKTOP_MAIN: "DESKTOP_MAIN",
      DESKTOP_AFTER_GAME: "DESKTOP_AFTER_GAME",
      IN_GAME_QUESTION_SUGGESTION: "IN_GAME_QUESTION_SUGGESTION",
      IN_GAME_QUESTION: "IN_GAME_QUESTION",
      IN_GAME_HIDDEN: "IN_GAME_HIDDEN",
      IN_NO_EVENTS_GAME_QUESTION_SUGGESTION: "IN_NO_EVENTS_GAME_QUESTION_SUGGESTION",
      IN_NO_EVENTS_GAME_QUESTION: "IN_NO_EVENTS_GAME_QUESTION",
      IN_NO_EVENTS_GAME_RETRY_PENDING: "IN_NO_EVENTS_GAME_RETRY_PENDING"
    };
    const kQuizType = {
      REGULAR: "REGULAR",
      BUY_LIVES: "BUY_LIVES",
      BONUS_FREE: "BONUS_FREE"
    };
    const kEventKeys = {
      APP_NETWORK_CHANGE: "APP_NETWORK_CHANGE",
      HOTKEY_PRESSED: "HOTKEY_PRESSED",
      UPDATE_TO_STATE: "UPDATE_TO_STATE",
      STORE_DATA_UPDATE: "STORE_DATA_UPDATE"
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
    const kStores = {
      USER: "USER",
      CLOCK: "CLOCK",
      STATE: "STATE",
      MODAL_STATE: "MODAL_STATE",
      ERROR_MESSAGE: "ERROR_MESSAGE"
    };
    const kWindowNames = {
      BACKGROUND: "background",
      DESKTOP: "desktop",
      IN_GAME: "in_game"
    };
    const kEventOwners = {
      inGameApp: "ingame.app",
      desktopApp: "desktop.app"
    };
    const AdsPlacement_vue_vue_type_style_index_0_scoped_739f61e1_lang = "";
    const _export_sfc = (sfc, props) => {
      const target = sfc.__vccOpts || sfc;
      for (const [key, val] of props) {
        target[key] = val;
      }
      return target;
    };
    const _sfc_main$a = {
      name: "AdsPlacement",
      props: {
        visible: Boolean,
        owWindowName: String
      },
      data() {
        return {
          adInstance: null,
          adEnabled: false,
          windowIsOpen: null,
          windowIsVisible: null,
          updateWindowIsVisibleInterval: null
        };
      },
      watch: {
        visible: function(newVal, oldVal) {
          if (newVal !== oldVal) {
            this.updateAd();
          }
        }
      },
      async mounted() {
        if (!this.owWindowName) {
          console.log(`AdsPlacement cannot be mounted, missing owWindowName prop`);
          return;
        }
        console.log(
          `AdsPlacement mounted, this.owWindowName: ${this.owWindowName}`
        );
        console.log(
          `AdsPlacement mounted, this.visible: ${this.visible}`,
          this.visible
        );
        this.windowIsOpen = await this.getWindowIsOpen();
        this.windowIsVisible = await this.getWindowIsVisible();
        overwolf.windows.onStateChanged.addListener(this.onWindowStateChanged);
        this.updateWindowIsVisibleInterval = setInterval(
          this.updateWindowIsVisible,
          2e3
        );
        this.windowIsOpen = await this.getWindowIsOpen();
        this.windowIsVisible = await this.getWindowIsVisible();
        this.updateAd();
      },
      methods: {
        async loadAdLib() {
          return new Promise((resolve2, reject) => {
            const el = document.createElement("script");
            el.src = "https://content.overwolf.com/libs/ads/latest/owads.min.js";
            el.async = true;
            el.onload = resolve2;
            el.onerror = reject;
            document.body.appendChild(el);
          });
        },
        async updateAd() {
          const shouldEnable = this.visible && this.windowIsOpen && this.windowIsVisible;
          if (this.adEnabled !== shouldEnable) {
            this.adEnabled = shouldEnable;
            if (shouldEnable) {
              await this.createAd();
            } else {
              await this.removeAd();
            }
          }
        },
        isTower() {
          return this.owWindowName === kWindowNames.DESKTOP;
        },
        async createAd() {
          if (!window.OwAd) {
            await this.loadAdLib();
            if (!window.OwAd) {
              console.error("Couldn't load OwAd");
              return;
            }
          }
          if (this.adInstance !== null) {
            this.adInstance.refreshAd();
            console.log("createAd(): refreshAd");
            return;
          }
          const adCont = this.$refs.adsElRef;
          let size2;
          if (this.isTower()) {
            size2 = [
              { width: 400, height: 600 },
              { width: 400, height: 300 },
              { width: 300, height: 250 },
              { width: 300, height: 600 },
              { width: 336, height: 280 },
              { width: 160, height: 600 },
              { width: 250, height: 250 }
            ];
          } else {
            size2 = [
              { width: 400, height: 300 },
              { width: 300, height: 250 },
              { width: 336, height: 280 },
              { width: 250, height: 250 }
            ];
          }
          this.adInstance = new window.OwAd(adCont, { size: size2 });
          this.adInstance.addEventListener(
            "player_loaded",
            () => console.log("OwAd player_loaded")
          );
          this.adInstance.addEventListener(
            "display_ad_loaded",
            () => console.log("OwAd display_ad_loaded")
          );
          this.adInstance.addEventListener("play", () => console.log("OwAd play"));
          this.adInstance.addEventListener(
            "impression",
            () => console.log("OwAd impression")
          );
          this.adInstance.addEventListener(
            "complete",
            () => console.log("OwAd complete")
          );
          this.adInstance.addEventListener(
            "ow_internal_rendered",
            () => console.log("OwAd ow_internal_rendered")
          );
          this.adInstance.addEventListener("error", (e) => {
            console.log("OwAd instance error:");
            console.error(e);
          });
          console.log("createAd(): new Ad instance");
        },
        async removeAd() {
          if (this.adInstance !== null) {
            console.log("removeAd()");
            this.adInstance.removeAd();
          }
        },
        async getWindowIsOpen() {
          const state = await new Promise((resolve2) => {
            overwolf.windows.getWindowState(this.owWindowName, resolve2);
          });
          if (state && state.success && state.window_state_ex) {
            const isOpen = state.window_state_ex === "normal" || state.window_state_ex === "maximized";
            console.log(`getWindowIsOpen():`, state.window_state_ex, isOpen);
            return isOpen;
          }
          return false;
        },
        async getWindowIsVisible() {
          const state = await new Promise((resolve2) => {
            overwolf.windows.isWindowVisibleToUser(resolve2);
          });
          return state && state.success && state.visible !== "hidden";
        },
        async updateWindowIsVisible() {
          const isVisible = await this.getWindowIsVisible();
          if (this.windowIsVisible !== isVisible) {
            console.log(`updateWindowIsVisible():`, isVisible);
            this.windowIsVisible = isVisible;
            this.updateAd();
          }
        },
        async onWindowStateChanged(state) {
          if (state && state.window_state_ex && state.window_name === this.owWindowName) {
            const isOpen = state.window_state_ex === "normal" || state.window_state_ex === "maximized";
            console.log(
              `AdsPlacement onWindowStateChanged:`,
              state.window_state_ex,
              isOpen
            );
            if (this.windowIsOpen !== isOpen) {
              this.windowIsOpen = isOpen;
              await this.updateAd();
            }
          }
        }
      }
    };
    function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
      return openBlock(), createElementBlock("div", {
        id: "ad-div",
        ref: "adsElRef",
        class: normalizeClass([
          "ad-test",
          ($props.visible ? "" : "hidden-placeholder ") + ($options.isTower() ? "tower-ad" : "")
        ])
      }, null, 2);
    }
    const AdsPlacement = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$a], ["__scopeId", "data-v-739f61e1"]]);
    const kMetrics = {
      AppLoading_Ended: "AppLoading_Ended",
      View_PoppedUp: "View_PoppedUp",
      View_Closed: "View_Closed",
      QuestionSuggestion_ViewOpened: "QuestionSuggestion_ViewOpened",
      QuestionSuggestion_Accepted: "QuestionSuggestion_Accepted",
      QuestionSuggestion_Skipped: "QuestionSuggestion_Skipped",
      Question_ViewOpened: "Question_ViewOpened",
      Question_AnswerSelected: "Question_AnswerSelected",
      Question_CheckAnswer_ViewOpened: "Question_CheckAnswer_ViewOpened",
      Question_Flow_Completed: "Question_Flow_Completed",
      Raffles_ViewOpened: "Raffles_ViewOpened",
      Store_ViewOpened: "Store_ViewOpened",
      Store_BuyTicket_Clicked: "Store_BuyTicket_Clicked",
      HotkeysEditor_ViewOpened: "HotkeysEditor_ViewOpened",
      Collect_ViewOpened: "Collect_ViewOpened",
      PlayScreen_ViewOpened: "PlayScreen_ViewOpened",
      Settings_ViewOpened: "Settings_ViewOpened",
      Settings_Login_Clicked: "Settings_Login_Clicked",
      Settings_Start_Tutorial: "Settings_Start_Tutorial",
      Settings_ResetAppData_Clicked: "Settings_ResetAppData_Clicked",
      Settings_ResetAppData_Approved: "Settings_ResetAppData_Approved",
      Learn_ViewOpened: "Learn_ViewOpened",
      Faq_Expanded: "Faq_Expanded"
    };
    const hkOk = "learn_earn_repeat_ok";
    const hkCancel = "learn_earn_repeat_cancel";
    const hkA1 = "learn_earn_repeat_a1";
    const hkA2 = "learn_earn_repeat_a2";
    const hkA3 = "learn_earn_repeat_a3";
    const hkA4 = "learn_earn_repeat_a4";
    const kTriggers = {
      MOUSE_CLICK: "MOUSE_CLICK",
      HOTKEY_PRESSED: "HOTKEY_PRESSED",
      COUNTDOWN_END: "COUNTDOWN_END",
      GAME_EVENT: "GAME_EVENT",
      DOCK: "DOCK"
    };
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
    const _sfc_main$9 = {
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
    const _hoisted_1$9 = ["width", "height"];
    const _hoisted_2$5 = ["id", "fx", "fy", "cx", "cy", "r"];
    const _hoisted_3$4 = ["stop-color"];
    const _hoisted_4$4 = ["stop-color"];
    const _hoisted_5$3 = ["r", "cx", "cy", "stroke", "stroke-dasharray", "stroke-linecap"];
    const _hoisted_6$3 = ["transform", "r", "cx", "cy", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap"];
    function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
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
              }, null, 8, _hoisted_3$4),
              createBaseVNode("stop", {
                offset: "100%",
                "stop-color": $props.stopColor
              }, null, 8, _hoisted_4$4)
            ], 8, _hoisted_2$5)
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
          }, null, 12, _hoisted_5$3),
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
          }, null, 12, _hoisted_6$3)
        ], 8, _hoisted_1$9))
      ], 4);
    }
    const RadialProgressBarLer = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$9]]);
    const App_vue_vue_type_style_index_0_scoped_d3f23f60_lang = "";
    const _sfc_main$8 = {
      components: {
        AdsPlacement,
        RadialProgressBarLer
      },
      data() {
        return {
          currentState: kAppStates.INITIALIZATION,
          kAppStates,
          kWindowNames,
          user: {},
          step: "",
          errorMessage: null,
          gameId: null,
          hkOk: "",
          hkCancel: "",
          hkA1: "",
          hkA2: "",
          hkA3: "",
          hkA4: "",
          activeSelectedOption: null,
          activeQuiz: null,
          answerPopularDeadline: null,
          step2hideDeadline: null,
          kTriggers,
          acceptChallengeInProgress: false
        };
      },
      computed: {
        TAG() {
          return "InGameApp";
        }
      },
      created() {
        WindowsService.getCurrentWindow().then(({ window: window2 }) => {
          console.log("window", window2);
          if (window2.left < 0 || window2.top < 0) {
            console.log("resetting position to 40,40");
            overwolf.windows.changePosition(kWindowNames.IN_GAME, 40, 40);
          }
        });
      },
      beforeMount() {
        const { owEventBus } = overwolf.windows.getMainWindow();
        owEventBus.removeOwner(kEventOwners.inGameApp);
      },
      mounted() {
        window.main = overwolf.windows.getMainWindow();
        const { hotkeysService, runningGameService, remoteLog } = window.main;
        window.hotkeysService = hotkeysService;
        window.runningGameService = runningGameService;
        this.hkOk = hkOk;
        this.hkCancel = hkCancel;
        this.hkA1 = hkA1;
        this.hkA2 = hkA2;
        this.hkA3 = hkA3;
        this.hkA4 = hkA4;
        this._eventListener = (eventName, eventValue) => {
          remoteLog("_eventListener", eventName, eventValue, Date.now());
          switch (eventName) {
            case kEventKeys.UPDATE_TO_STATE:
              console.log(
                `_eventListener stateUpdated ${eventName}: ${eventValue}`
              );
              this.updateToState();
              break;
            case kEventKeys.STORE_DATA_UPDATE:
              console.log(
                `_eventListener dataUpdated ${eventName}: ${eventValue && JSON.stringify(eventValue)}`
              );
              this.updateData();
              break;
            case kEventKeys.HOTKEY_PRESSED:
              console.log(
                `_eventListener HOTKEY_PRESSED ${eventName}: ${eventValue}`
              );
              this._inGameHotkeyHandler(eventValue);
              break;
            default:
              console.log(`_eventListener unhandled event: ${eventName}`);
              break;
          }
        };
        this._eventListenerBound = this._eventListener.bind(this);
        this.initState();
        const { owEventBus, setState, stateHolderService } = overwolf.windows.getMainWindow();
        this.setState = setState;
        this.owEventBus = owEventBus;
        this.stateHolderService = stateHolderService;
        const curState = this.stateHolderService.get(kStores.STATE);
        this.updateData = () => {
          this.user = this.stateHolderService.get(kStores.USER);
          const clock = this.stateHolderService.get(kStores.CLOCK);
          window.clock = clock;
        };
        this.updateToState = () => {
          const prevState = this.currentState;
          this.currentState = this.stateHolderService.get(kStores.STATE);
          if (this.currentState) {
            if (this.currentState === kAppStates.IN_GAME_HIDDEN) {
              document.documentElement.style.display = "none";
            } else {
              document.documentElement.style.display = "block";
            }
          }
          if (prevState !== this.currentState && ![
            kAppStates.IN_NO_EVENTS_GAME_QUESTION,
            kAppStates.IN_NO_EVENTS_GAME_QUESTION
          ].includes(this.currentState)) {
            console.log("ingame initState");
            this.initState();
          }
          this.errorMessage = null;
          this.updateData();
        };
        this.listenerKey = this.owEventBus.addOwnedListener(
          kEventOwners.inGameApp,
          this._eventListenerBound
        );
        window.runningGameService.getCurrentRunningGameId().then((gId) => {
          this.gameId = gId;
        });
        const suggestionStateRef = this.$refs.suggestionStateRef;
        if (suggestionStateRef) {
          WindowsService.getCurrentWindow().then(({ window: window2 }) => {
            this.reportWindowStats(window2);
            this._dragService = new DragService(window2, suggestionStateRef);
          });
        }
        this.updateToState(curState);
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
        async reportWindowStats(curWindowStat) {
          const monitorsList = await WindowsService.getMonitorsList();
          window.main.registerMetricsProperties({
            widgetPositionX: curWindowStat.left,
            widgetPositionY: curWindowStat.top,
            monitorsCount: monitorsList.length
          });
        },
        clock() {
          return window.getGlobalTime();
        },
        async answerChecked(answer, trigger2) {
          console.log(`Selected answer: ${answer}`);
          try {
            switch (this.step) {
              case 1: {
                this.activeSelectedOption = answer;
                window.main.trackEvent(kMetrics.Question_AnswerSelected, {
                  trigger: trigger2,
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
                  trigger2
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
                  const self2 = this;
                  setTimeout(() => {
                    if (this.activeQuiz) {
                      self2.step2hideDeadline = getGlobalTime() + 10 * 1e3;
                      self2.step = 2;
                      window.main.trackEvent(
                        kMetrics.Question_CheckAnswer_ViewOpened,
                        {
                          trigger: trigger2,
                          questionText: this.activeQuiz.question,
                          selectedAnswerText: this.activeQuiz.options[answer - 1],
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
                  trigger2
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
        btnClose() {
          console.log(`btnClose: closing...`);
          if (this.step === 4 && this.currentState === kAppStates.IN_NO_EVENTS_GAME_QUESTION) {
            this.setState(kAppStates.IN_NO_EVENTS_GAME_RETRY_PENDING);
          } else {
            this.setState(kAppStates.IN_GAME_HIDDEN);
          }
        },
        async hideApp(trigger2) {
          window.main.trackEvent(kMetrics.Question_Flow_Completed, {
            trigger: trigger2,
            questionText: this.activeQuiz.question,
            isAnsweredCorrectly: this.activeQuiz.selectedAnswer === this.activeQuiz.correctAnswer,
            secondsLeftOnCountDown: Math.round(
              (this.step2hideDeadline - getGlobalTime()) / 1e3
            )
          });
          window.main.trackEvent(kMetrics.View_Closed, {
            window: kWindowNames.IN_GAME,
            isHappyClose: true,
            trigger: trigger2
          });
          await this.setState(kAppStates.IN_GAME_HIDDEN, trigger2);
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
        },
        async _buyLivesForChallenge() {
          return this._acceptChallenge(kQuizType.BUY_LIVES);
        },
        async _acceptChallenge(quizType) {
          if (this.acceptChallengeInProgress) {
            console.log(
              `${this.TAG} _acceptChallenge ignore action, already in progress; quizType: ${quizType}`
            );
            return;
          }
          this.acceptChallengeInProgress = true;
          try {
            this.activeQuiz = await window.main.acceptChallenge(quizType);
            if (!this.activeQuiz) {
              console.error(`${this.TAG} _acceptChallenge error no activeQuiz`);
              this.errorMessage = `An error occurred. Please try again later.`;
              if (!await window.main.getOnlineStatus()) {
                this.errorMessage = "No internet connection.";
              }
            }
            window.main.trackEvent(kMetrics.Question_ViewOpened, {
              questionText: this.activeQuiz && this.activeQuiz.question
            });
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
        _skipChallenge(trigger2) {
          window.main.skipChallenge(trigger2);
        },
        _inGameHotkeyHandler(hk) {
          var _a2, _b, _c, _d, _e, _f, _g;
          const curState = this.stateHolderService.get(kStores.STATE);
          console.log("_inGameHotkeyHandler", hk, curState);
          switch (hk) {
            case hkOk:
              switch (curState) {
                case kAppStates.IN_NO_EVENTS_GAME_QUESTION_SUGGESTION:
                case kAppStates.IN_GAME_QUESTION_SUGGESTION:
                  if (((_a2 = this.user) == null ? void 0 : _a2.hearts) === 0) {
                    (_c = (_b = this.$refs) == null ? void 0 : _b.quizSuggestionRef) == null ? void 0 : _c.askToStartWithoutAvailableLives(
                      true
                    );
                  } else {
                    (_e = (_d = this.$refs) == null ? void 0 : _d.quizSuggestionRef) == null ? void 0 : _e.onAccept(true);
                  }
                  break;
                case kAppStates.IN_NO_EVENTS_GAME_QUESTION:
                case kAppStates.IN_GAME_QUESTION:
                  break;
                case kAppStates.IN_GAME_HIDDEN:
                  break;
              }
              break;
            case hkCancel:
              if (curState === kAppStates.IN_GAME_QUESTION_SUGGESTION) {
                (_g = (_f = this.$refs) == null ? void 0 : _f.quizSuggestionRef) == null ? void 0 : _g.onSkip(kTriggers.HOTKEY_PRESSED);
              } else if (curState === kAppStates.IN_GAME_HIDDEN) {
                this.setState(
                  kAppStates.IN_GAME_QUESTION_SUGGESTION,
                  kTriggers.HOTKEY_PRESSED
                );
                window.main.trackEvent(kMetrics.View_PoppedUp, {
                  window: kWindowNames.IN_GAME,
                  view: "questionSuggestion",
                  isDelayed: false,
                  trigger: kTriggers.HOTKEY_PRESSED
                });
              } else if (curState === kAppStates.IN_GAME_QUESTION) {
                this.hideApp(kTriggers.HOTKEY_PRESSED);
              } else {
                this._skipChallenge(kTriggers.HOTKEY_PRESSED);
              }
              break;
            case hkA1:
              if (this.currentState !== kAppStates.IN_GAME_QUESTION && this.currentState !== kAppStates.IN_NO_EVENTS_GAME_QUESTION) {
                return;
              }
              this.answerChecked(1, kTriggers.HOTKEY_PRESSED);
              break;
            case hkA2:
              if (this.currentState !== kAppStates.IN_GAME_QUESTION && this.currentState !== kAppStates.IN_NO_EVENTS_GAME_QUESTION) {
                return;
              }
              this.answerChecked(2, kTriggers.HOTKEY_PRESSED);
              break;
            case hkA3:
              if (this.currentState !== kAppStates.IN_GAME_QUESTION && this.currentState !== kAppStates.IN_NO_EVENTS_GAME_QUESTION) {
                return;
              }
              this.answerChecked(3, kTriggers.HOTKEY_PRESSED);
              break;
            case hkA4:
              if (this.currentState !== kAppStates.IN_GAME_QUESTION && this.currentState !== kAppStates.IN_NO_EVENTS_GAME_QUESTION) {
                return;
              }
              this.answerChecked(4, kTriggers.HOTKEY_PRESSED);
              break;
            default:
              console.log(`Unhandled hotkey: ${hk}`);
              break;
          }
        }
      }
    };
    const _withScopeId$3 = (n) => (pushScopeId("data-v-d3f23f60"), n = n(), popScopeId(), n);
    const _hoisted_1$8 = {
      ref: "suggestionStateRef",
      class: "semi-transparent-bg max-content-width"
    };
    const _hoisted_2$4 = {
      key: 0,
      class: "semi-transparent-bg max-content-width"
    };
    const _hoisted_3$3 = {
      key: 1,
      class: "active-ingame-bg ingame-width ingame-full-height"
    };
    const _hoisted_4$3 = {
      key: 0,
      class: "error-state"
    };
    const _hoisted_5$2 = { class: "error-message-text" };
    const _hoisted_6$2 = { key: 1 };
    const _hoisted_7$2 = { class: "" };
    const _hoisted_8$2 = /* @__PURE__ */ _withScopeId$3(() => /* @__PURE__ */ createBaseVNode("span", { class: "radial-counter-bg" }, null, -1));
    const _hoisted_9$2 = { class: "radial-counter-timeleft-label" };
    const _hoisted_10$2 = /* @__PURE__ */ _withScopeId$3(() => /* @__PURE__ */ createBaseVNode("span", { class: "radial-counter-unit-label" }, "seconds", -1));
    const _hoisted_11$2 = {
      key: 1,
      class: "error-message-text"
    };
    const _hoisted_12$2 = { key: 2 };
    const _hoisted_13$2 = { class: "resultBoxWrap step2Box" };
    const _hoisted_14$2 = { key: 0 };
    const _hoisted_15$2 = /* @__PURE__ */ _withScopeId$3(() => /* @__PURE__ */ createBaseVNode("div", { class: "step2ResultBox step2TitlePadding" }, "Good job!", -1));
    const _hoisted_16$1 = { class: "step2ResultBox flex-row" };
    const _hoisted_17$1 = { class: "padLeft4" };
    const _hoisted_18$1 = /* @__PURE__ */ _withScopeId$3(() => /* @__PURE__ */ createBaseVNode("div", { class: "step2GrayLbl" }, "Collect your coins after the game", -1));
    const _hoisted_19$1 = { key: 1 };
    const _hoisted_20$1 = /* @__PURE__ */ _withScopeId$3(() => /* @__PURE__ */ createBaseVNode("div", { class: "step2ResultBox" }, [
      /* @__PURE__ */ createBaseVNode("div", { class: "wrong-box-front" }, [
        /* @__PURE__ */ createBaseVNode("div", { class: "education-icon" }),
        /* @__PURE__ */ createBaseVNode("div", { class: "box-text" }, " Wrong answers are lessons learned! To help you learn, we\u2019ll quiz you on this again in the future ")
      ])
    ], -1));
    const _hoisted_21 = [
      _hoisted_20$1
    ];
    const _hoisted_22 = { class: "flex-row justify-center" };
    const _hoisted_23 = {
      key: 0,
      class: "flex-column"
    };
    const _hoisted_24 = {
      key: 0,
      class: "bonus-round-title"
    };
    const _hoisted_25 = {
      key: 1,
      class: "bonus-round-title-placeholder"
    };
    const _hoisted_26 = {
      key: 2,
      class: "bonus-round-text flex-row"
    };
    const _hoisted_27 = {
      key: 3,
      class: "bonus-round-text"
    };
    const _hoisted_28 = { class: "" };
    const _hoisted_29 = /* @__PURE__ */ _withScopeId$3(() => /* @__PURE__ */ createBaseVNode("span", { class: "radial-counter-bg smaller" }, null, -1));
    const _hoisted_30 = { class: "radial-counter-timeleft-label smaller" };
    const _hoisted_31 = /* @__PURE__ */ _withScopeId$3(() => /* @__PURE__ */ createBaseVNode("span", { class: "radial-counter-unit-label smaller" }, "seconds", -1));
    const _hoisted_32 = { key: 5 };
    const _hoisted_33 = { key: 0 };
    const _hoisted_34 = {
      key: 1,
      class: "times-up-popular"
    };
    const _hoisted_35 = /* @__PURE__ */ _withScopeId$3(() => /* @__PURE__ */ createBaseVNode("br", null, null, -1));
    const _hoisted_36 = {
      key: 2,
      id: "idInGame_Empty",
      style: { "background-color": "transparent" }
    };
    const _hoisted_37 = { class: "ad-wrap" };
    function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
      const _component_TopRowView = resolveComponent("TopRowView");
      const _component_QuizSuggestion = resolveComponent("QuizSuggestion");
      const _component_QuizQuestion = resolveComponent("QuizQuestion");
      const _component_RadialProgressBarLer = resolveComponent("RadialProgressBarLer");
      const _component_vue_countdown = resolveComponent("vue-countdown");
      const _component_LerCoin = resolveComponent("LerCoin");
      const _component_HotkeyLabel = resolveComponent("HotkeyLabel");
      const _component_CollectAfterGame = resolveComponent("CollectAfterGame");
      const _component_AdsPlacement = resolveComponent("AdsPlacement");
      return openBlock(), createElementBlock(Fragment, null, [
        $data.currentState !== $data.kAppStates.IN_GAME_QUESTION_SUGGESTION && $data.currentState !== $data.kAppStates.IN_NO_EVENTS_GAME_QUESTION_SUGGESTION ? (openBlock(), createBlock(_component_TopRowView, {
          key: 0,
          class: "ingame-width",
          "on-close-window": $options.btnClose
        }, null, 8, ["on-close-window"])) : createCommentVNode("", true),
        createBaseVNode("main", null, [
          withDirectives(createBaseVNode("div", _hoisted_1$8, [
            $data.currentState === $data.kAppStates.IN_GAME_QUESTION_SUGGESTION ? (openBlock(), createBlock(_component_QuizSuggestion, {
              key: 0,
              ref: "quizSuggestionRef",
              user: $data.user,
              "game-id": $data.gameId,
              "error-message": $data.errorMessage,
              "accept-in-progress": $data.acceptChallengeInProgress,
              onOnStartChallenge: $options._acceptChallenge,
              onOnBuyLives: $options._buyLivesForChallenge,
              onOnSkip: $options._skipChallenge
            }, null, 8, ["user", "game-id", "error-message", "accept-in-progress", "onOnStartChallenge", "onOnBuyLives", "onOnSkip"])) : createCommentVNode("", true)
          ], 512), [
            [vShow, $data.currentState === $data.kAppStates.IN_GAME_QUESTION_SUGGESTION]
          ]),
          $data.currentState === $data.kAppStates.IN_NO_EVENTS_GAME_QUESTION_SUGGESTION ? (openBlock(), createElementBlock("div", _hoisted_2$4, [
            createVNode(_component_QuizSuggestion, {
              ref: "quizSuggestionRef",
              user: $data.user,
              "game-id": $data.gameId,
              "error-message": $data.errorMessage,
              "accept-in-progress": $data.acceptChallengeInProgress,
              onOnStartChallenge: $options._acceptChallenge,
              onOnBuyLives: $options._buyLivesForChallenge,
              onOnSkip: $options._skipChallenge
            }, null, 8, ["user", "game-id", "error-message", "accept-in-progress", "onOnStartChallenge", "onOnBuyLives", "onOnSkip"])
          ])) : $data.currentState === $data.kAppStates.IN_GAME_QUESTION || $data.currentState === $data.kAppStates.IN_NO_EVENTS_GAME_QUESTION ? (openBlock(), createElementBlock("div", _hoisted_3$3, [
            $data.errorMessage ? (openBlock(), createElementBlock("div", _hoisted_4$3, [
              createBaseVNode("div", _hoisted_5$2, toDisplayString($data.errorMessage), 1)
            ])) : createCommentVNode("", true),
            $data.step === 1 ? (openBlock(), createElementBlock("div", _hoisted_6$2, [
              !!$data.activeQuiz ? (openBlock(), createBlock(_component_QuizQuestion, {
                key: 0,
                "quiz-question-object": $data.activeQuiz,
                "allow-picking-answer": true,
                "active-selected-answer": $data.activeSelectedOption,
                onAnswerSelected: $options.answerChecked
              }, null, 8, ["quiz-question-object", "active-selected-answer", "onAnswerSelected"])) : createCommentVNode("", true),
              createBaseVNode("div", _hoisted_7$2, [
                $data.activeQuiz && !$data.activeQuiz.isAnswered && $data.activeQuiz.answerDeadline && $data.activeQuiz.answerDeadline ? (openBlock(), createBlock(_component_vue_countdown, {
                  key: 0,
                  interval: 1e3,
                  time: $data.activeQuiz.answerDeadline - $options.clock(),
                  class: "",
                  style: { "position": "relative", "margin-left": "auto", "margin-right": "auto" },
                  onEnd: $options.onCountdownEnd
                }, {
                  default: withCtx(({ totalSeconds }) => [
                    _hoisted_8$2,
                    createBaseVNode("span", _hoisted_9$2, toDisplayString(totalSeconds), 1),
                    _hoisted_10$2,
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
              !$data.activeQuiz ? (openBlock(), createElementBlock("div", _hoisted_11$2, " An error occured while presenting the question. Please try again. ")) : createCommentVNode("", true)
            ])) : $data.step === 2 ? (openBlock(), createElementBlock("div", _hoisted_12$2, [
              !!$data.activeQuiz ? (openBlock(), createBlock(_component_QuizQuestion, {
                key: 0,
                "quiz-question-object": $data.activeQuiz,
                "allow-picking-answer": false,
                "selected-answer": $data.activeQuiz.selectedAnswer,
                "correct-answer": $data.activeQuiz.correctAnswer,
                onAnswerSelected: $options.answerChecked
              }, null, 8, ["quiz-question-object", "selected-answer", "correct-answer", "onAnswerSelected"])) : createCommentVNode("", true),
              createBaseVNode("div", _hoisted_13$2, [
                $data.activeQuiz && $data.activeQuiz.coinsWinning ? (openBlock(), createElementBlock("span", _hoisted_14$2, [
                  _hoisted_15$2,
                  createBaseVNode("div", _hoisted_16$1, [
                    createTextVNode(" You've earned "),
                    createVNode(_component_LerCoin, { class: "earned-coin padLeft4" }),
                    createBaseVNode("span", _hoisted_17$1, toDisplayString($data.activeQuiz.coinsWinning), 1)
                  ]),
                  _hoisted_18$1
                ])) : (openBlock(), createElementBlock("span", _hoisted_19$1, _hoisted_21))
              ]),
              createBaseVNode("div", _hoisted_22, [
                createBaseVNode("div", {
                  class: "btn-secondary-cta suggestion-sec",
                  onClick: _cache[1] || (_cache[1] = ($event) => $options.hideApp($data.kTriggers.MOUSE_CLICK))
                }, [
                  createTextVNode(" Hide "),
                  $data.step2hideDeadline ? (openBlock(), createBlock(_component_vue_countdown, {
                    key: 0,
                    time: $data.step2hideDeadline - $options.clock(),
                    onEnd: _cache[0] || (_cache[0] = () => $options.hideApp($data.kTriggers.COUNTDOWN_END))
                  }, {
                    default: withCtx(({ totalSeconds }) => [
                      createTextVNode("in (" + toDisplayString(totalSeconds) + ") ", 1)
                    ]),
                    _: 1
                  }, 8, ["time"])) : createCommentVNode("", true),
                  createVNode(_component_HotkeyLabel, {
                    class: "padLeft4",
                    "hk-id": $data.hkCancel,
                    "game-id": $data.gameId
                  }, null, 8, ["hk-id", "game-id"])
                ])
              ])
            ])) : createCommentVNode("", true),
            createVNode(Transition, {
              name: "slow-slide-anim",
              duration: { enter: 500, leave: 800 }
            }, {
              default: withCtx(() => [
                $data.step === 3 || $data.step === 4 ? (openBlock(), createElementBlock("div", _hoisted_23, [
                  $data.step === 3 ? (openBlock(), createElementBlock("div", _hoisted_24, "BONUS ROUND")) : createCommentVNode("", true),
                  $data.step === 4 ? (openBlock(), createElementBlock("div", _hoisted_25)) : createCommentVNode("", true),
                  $data.step === 3 ? (openBlock(), createElementBlock("div", _hoisted_26, [
                    createBaseVNode("span", null, [
                      createTextVNode("Guess the answer most popular by others for a "),
                      createVNode(_component_LerCoin, { class: "padRight8" }),
                      createTextVNode(toDisplayString($data.activeQuiz.bonusReward) + " bonus!", 1)
                    ])
                  ])) : createCommentVNode("", true),
                  $data.step === 4 && $data.activeQuiz.selectedPopular && $data.activeQuiz.selectedPopular > 0 ? (openBlock(), createElementBlock("div", _hoisted_27, " Your guess is accepted! ")) : createCommentVNode("", true),
                  !!$data.activeQuiz ? (openBlock(), createBlock(_component_QuizQuestion, {
                    key: 4,
                    "quiz-question-object": $data.activeQuiz,
                    "allow-picking-answer": $data.step === 3,
                    "selected-answer": $data.activeQuiz.selectedPopular,
                    onAnswerSelected: $options.answerChecked
                  }, null, 8, ["quiz-question-object", "allow-picking-answer", "selected-answer", "onAnswerSelected"])) : createCommentVNode("", true),
                  createBaseVNode("div", _hoisted_28, [
                    $data.answerPopularDeadline ? (openBlock(), createBlock(_component_vue_countdown, {
                      key: 0,
                      interval: 1e3,
                      time: $data.answerPopularDeadline - $options.clock(),
                      class: "",
                      style: { "position": "relative", "margin-left": "auto", "margin-right": "auto" },
                      onEnd: $options.onCountdownEnd
                    }, {
                      default: withCtx(({ totalSeconds }) => [
                        _hoisted_29,
                        createBaseVNode("span", _hoisted_30, toDisplayString(totalSeconds), 1),
                        _hoisted_31,
                        createVNode(_component_RadialProgressBarLer, {
                          class: "margin-side-auto",
                          diameter: 102,
                          "completed-steps": totalSeconds,
                          "total-steps": $data.activeQuiz.answerDeadlineTotalSeconds,
                          "is-clockwise": true,
                          "start-color": "#FF51E5",
                          "stop-color": "#FF51E5",
                          "inner-stroke-color": "#4E083C",
                          "stroke-width": 5,
                          "inner-stroke-width": 5,
                          "stroke-linecap": "round",
                          "animate-speed": 1e3
                        }, null, 8, ["completed-steps", "total-steps"])
                      ]),
                      _: 1
                    }, 8, ["time", "onEnd"])) : createCommentVNode("", true)
                  ]),
                  $data.step === 4 ? (openBlock(), createElementBlock("div", _hoisted_32, [
                    $data.activeQuiz.selectedPopular && $data.activeQuiz.selectedPopular > 0 ? (openBlock(), createElementBlock("div", _hoisted_33, [
                      createVNode(_component_CollectAfterGame)
                    ])) : (openBlock(), createElementBlock("div", _hoisted_34, [
                      createTextVNode(" Times up "),
                      _hoisted_35,
                      createTextVNode(" Find out the answer after the game ")
                    ]))
                  ])) : createCommentVNode("", true),
                  $data.step === 4 ? (openBlock(), createElementBlock("button", {
                    key: 6,
                    class: "btn-secondary-cta text centered-button step-4-close-button",
                    onClick: _cache[2] || (_cache[2] = (...args) => $options.btnClose && $options.btnClose(...args))
                  }, [
                    createTextVNode(" Close in "),
                    _ctx.step4Deadline ? (openBlock(), createBlock(_component_vue_countdown, {
                      key: 0,
                      time: _ctx.step4Deadline - $options.clock(),
                      onEnd: $options.onCountdownEnd
                    }, {
                      default: withCtx(({ totalSeconds }) => [
                        createTextVNode(" (" + toDisplayString(totalSeconds) + ") ", 1)
                      ]),
                      _: 1
                    }, 8, ["time", "onEnd"])) : createCommentVNode("", true),
                    createVNode(_component_HotkeyLabel, {
                      class: "padLeft4px",
                      "hk-id": $data.hkCancel,
                      "game-id": $data.gameId
                    }, null, 8, ["hk-id", "game-id"])
                  ])) : createCommentVNode("", true)
                ])) : createCommentVNode("", true)
              ]),
              _: 1
            })
          ])) : $data.currentState === $data.kAppStates.IN_GAME_HIDDEN ? (openBlock(), createElementBlock("div", _hoisted_36)) : createCommentVNode("", true),
          createBaseVNode("div", _hoisted_37, [
            createVNode(_component_AdsPlacement, {
              style: { "position": "absolute", "top": "570px" },
              visible: $data.currentState === $data.kAppStates.IN_GAME_QUESTION || $data.currentState === $data.kAppStates.IN_NO_EVENTS_GAME_QUESTION,
              "ow-window-name": $data.kWindowNames.IN_GAME
            }, null, 8, ["visible", "ow-window-name"])
          ])
        ])
      ], 64);
    }
    const App = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$8], ["__scopeId", "data-v-d3f23f60"]]);
    const HotkeyLabel_vue_vue_type_style_index_0_scoped_886e952a_lang = "";
    const _sfc_main$7 = {
      props: ["hkId", "gameId"],
      data: function() {
        return {
          keysLabel: ""
        };
      },
      mounted: function() {
        this.setLabel();
      },
      beforeUpdate() {
        this.setLabel();
      },
      methods: {
        setLabel: async function() {
          var _a2;
          this.keysLabel = await ((_a2 = window.hotkeysService) == null ? void 0 : _a2.getHotkey(
            this.hkId,
            this.gameId
          ));
        }
      }
    };
    const _hoisted_1$7 = {
      key: 0,
      class: "hkLbl"
    };
    function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
      return _ctx.keysLabel && _ctx.keysLabel !== "" ? (openBlock(), createElementBlock("span", _hoisted_1$7, "[" + toDisplayString(_ctx.keysLabel) + "]", 1)) : createCommentVNode("", true);
    }
    const HotkeyLabel = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$7], ["__scopeId", "data-v-886e952a"]]);
    const QuizQuestion_vue_vue_type_style_index_0_scoped_61278e6f_lang = "";
    const _sfc_main$6 = {
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
    const _hoisted_1$6 = { class: "questionText" };
    function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
      const _component_QuizOption = resolveComponent("QuizOption");
      return openBlock(), createElementBlock(Fragment, null, [
        createBaseVNode("div", _hoisted_1$6, toDisplayString($props.quizQuestionObject.question), 1),
        createBaseVNode("div", null, [
          (openBlock(), createElementBlock(Fragment, null, renderList(4, (index2) => {
            return createVNode(_component_QuizOption, {
              key: index2,
              option: index2,
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
    const QuizQuestion = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$6], ["__scopeId", "data-v-61278e6f"]]);
    const QuizOption_vue_vue_type_style_index_0_scoped_72552924_lang = "";
    const _sfc_main$5 = {
      name: "QuizOption",
      props: [
        "option",
        "quizQuestionObject",
        "allowPickingAnswer",
        "gameId",
        "activeAnswer",
        "selectAnswer",
        "selectedAnswer",
        "correctAnswer",
        "bonusTitle",
        "inProgress",
        "wasReported"
      ],
      data() {
        return {
          hks: {
            1: hkA1,
            2: hkA2,
            3: hkA3,
            4: hkA4
          },
          options: {
            1: this.quizQuestionObject.option1,
            2: this.quizQuestionObject.option2,
            3: this.quizQuestionObject.option3,
            4: this.quizQuestionObject.option4
          },
          wrongAnswer: this.selectedAnswer !== this.correctAnswer ? this.selectedAnswer : null
        };
      },
      mounted() {
      },
      methods: {
        showWrongAnswer() {
        },
        showCorrectAnswer() {
          return this.wrongAnswer === this.option;
        }
      }
    };
    const _hoisted_1$5 = { class: "d-flex answer-block option-text margin-vertical-auto" };
    const _hoisted_2$3 = {
      key: 0,
      class: "correct-answer-flicker"
    };
    function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
      const _component_HotkeyLabel = resolveComponent("HotkeyLabel");
      return openBlock(), createElementBlock("div", {
        class: normalizeClass([{
          "active-answer": $props.activeAnswer === $props.option,
          "option-reported": $props.wasReported === $props.option,
          "option-selected": $props.selectedAnswer === $props.option,
          "_correct-answer": $props.correctAnswer === $props.option,
          "_wrong-answer": $data.wrongAnswer === $props.option,
          clickable: $props.allowPickingAnswer && $props.wasReported === null
        }, "option-row d-flex flex-row"]),
        onClick: _cache[0] || (_cache[0] = ($event) => $props.allowPickingAnswer && $props.wasReported === null && $props.selectAnswer($props.option))
      }, [
        createBaseVNode("span", _hoisted_1$5, toDisplayString($props.option) + ". " + toDisplayString($data.options[$props.option]), 1),
        $props.correctAnswer === $props.option ? (openBlock(), createElementBlock("span", _hoisted_2$3)) : createCommentVNode("", true),
        createBaseVNode("span", {
          class: normalizeClass({
            "correct-answer": $props.correctAnswer === $props.option,
            "wrong-answer": $data.wrongAnswer === $props.option
          })
        }, null, 2),
        withDirectives(createVNode(_component_HotkeyLabel, {
          class: "margin-vertical-auto",
          style: { "padding-top": "6px", "margin-right": "10px" },
          "hk-id": $data.hks[$props.option],
          "game-id": $props.gameId
        }, null, 8, ["hk-id", "game-id"]), [
          [vShow, $props.allowPickingAnswer && $props.wasReported === null]
        ])
      ], 2);
    }
    const QuizOption = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$5], ["__scopeId", "data-v-72552924"]]);
    const LerCoin_vue_vue_type_style_index_0_scoped_f6611e5e_lang = "";
    const _sfc_main$4 = {
      name: "LerCoin"
    };
    const _hoisted_1$4 = { class: "coin-style" };
    function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
      return openBlock(), createElementBlock("span", _hoisted_1$4);
    }
    const LerCoin = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$4], ["__scopeId", "data-v-f6611e5e"]]);
    class RepoService {
      async get(key, defaultValue) {
        return localStorage[key] || defaultValue;
      }
      async set(key, value) {
        localStorage[key] = value;
      }
      async remove(key) {
        localStorage.removeItem(key);
      }
      async getBooleanValue(key, defaultValue) {
        const value = await this.get(key);
        return value && value.toString().toLowerCase() === "true" || defaultValue;
      }
      async incrementNumericValue(key, incrementBy = 1) {
        let value = Number(await this.get(key, 0));
        value += incrementBy;
        await this.set(key, value);
        return value;
      }
      async getObject(key, defaultValue) {
        let obj = defaultValue;
        try {
          JSON.parse(localStorage[key] || defaultValue);
        } catch (err) {
          console.warn(`RepoService cannot parse ${key} as JSON; value: ${localStorage[key]}`);
        }
        return obj;
      }
      async setObject(key, value) {
        localStorage[key] = JSON.stringify(value);
      }
      resetAll() {
        localStorage.clear();
      }
    }
    const kRepoKeys = {
      AUTH_TOKEN: "AUTH_TOKEN",
      AUTH_EXPIRATION: "AUTH_EXPIRATION",
      FINISHED_ONBOARDING: "FINISHED_ONBOARDING",
      LAST_QUIZ_SUGGESTION: "LAST_QUIZ_SUGGESTION",
      QUIZES_ACCEPTED: "QUIZES_ACCEPTED",
      QUIZES_ACCEPTED_LAST_GAME: "QUIZES_ACCEPTED_LAST_GAME",
      LAST_BONUS_QUIZ_SUGGESTED_AT: "LAST_BONUS_QUIZ_SUGGESTED_AT",
      BONUS_QUIZ_MODE: "BONUS_QUIZ_MODE",
      FAKE_GAME_ID: "FAKE_GAME_ID",
      LAST_QUIZ_SKIPPED: "LAST_QUIZ_SKIPPED",
      LAST_QUIZ_ANSWERED: "LAST_QUIZ_ANSWERED",
      TUTORIAL_QUIZ_MODE: "TUTORIAL_QUIZ_MODE"
    };
    const QuizSuggestion_vue_vue_type_style_index_0_scoped_2ef7f6fe_lang = "";
    const _sfc_main$3 = {
      name: "QuizSuggestion",
      components: { LerCoin },
      props: {
        acceptInProgress: Boolean,
        gameId: Number,
        user: {
          type: Object,
          required: true
        },
        errorMessage: {
          type: String,
          default: ""
        },
        autoSkipOnCountdownEnd: {
          type: Boolean,
          default: true
        }
      },
      emits: ["on-start-challenge", "on-buy-lives", "on-skip"],
      data() {
        return {
          suggestionDeadline: null,
          allowedToBuy: false,
          livesRefillIn: null,
          heartsBundleAmount: 0,
          heartsBundlePrice: 0,
          bonusMode: false,
          kTriggers
        };
      },
      computed: {
        clock() {
          return window.getGlobalTime();
        },
        gotEnoughCoins() {
          var _a2;
          return ((_a2 = this.user) == null ? void 0 : _a2.balance) >= this.heartsBundlePrice;
        }
      },
      beforeMount() {
        this.hkOk = hkOk;
        this.hkCancel = hkCancel;
      },
      async mounted() {
        var _a2, _b, _c;
        this.repoService = new RepoService();
        this.suggestionDeadline = window.getGlobalTime() + kConsts.durationMs.suggestion;
        this.livesRefillIn = ((_a2 = this.user) == null ? void 0 : _a2.nextHeart) ? Number(this.user && this.user.nextHeart) - getGlobalTime() : 0;
        if (this.livesRefillIn < 0) {
          console.error(
            `QuizSuggestion - livesRefillIn is negative: ${this.livesRefillIn}`
          );
        }
        if (((_b = this.user) == null ? void 0 : _b.hearts) === 0) {
          this.bonusMode = await this.repoService.getBooleanValue(
            kRepoKeys.TUTORIAL_QUIZ_MODE,
            false
          ) || await this.repoService.getBooleanValue(
            kRepoKeys.BONUS_QUIZ_MODE,
            false
          );
          if (!this.bonusMode) {
            const nextQRes = await window.main.getHeartsStatus();
            const nextHeartAt = nextQRes.renewsIn;
            this.livesRefillIn = nextHeartAt ? Number(nextHeartAt) - getGlobalTime() : 0;
            this.allowedToBuy = nextQRes.heartsPurchaseAllowed;
            this.heartsBundleAmount = 3;
            this.heartsBundlePrice = nextQRes.price;
          } else {
            console.log(`QuizSuggestion - bm is on`);
          }
        }
        window.main.trackEvent(kMetrics.QuestionSuggestion_ViewOpened, {
          state: this.getCurrentState(),
          minutesToRefill: ((_c = this.user) == null ? void 0 : _c.hearts) < 1
        });
      },
      methods: {
        getCurrentState() {
          var _a2, _b, _c, _d;
          let currentState = "unhandled";
          if (this.errorMessage) {
            currentState = "error";
          } else if (!this.user || ((_a2 = this.user) == null ? void 0 : _a2.hearts) === void 0) {
            currentState = "noUserStuckLoading";
          } else if (this.bonusMode) {
            currentState = "bonusStarting";
          } else if (((_b = this.user) == null ? void 0 : _b.hearts) >= 1) {
            if (this.autoSkipOnCountdownEnd) {
              currentState = "closing";
            } else {
              currentState = "starting";
            }
          } else if (((_c = this.user) == null ? void 0 : _c.hearts) < 1) {
            if (this.allowedToBuy && ((_d = this.user) == null ? void 0 : _d.balance) >= this.heartsBundlePrice) {
              currentState = "buyRefill";
            } else {
              currentState = "waitForRefill";
            }
          }
          return currentState;
        },
        trackSuggestionAccepted(trigger2) {
          window.main.trackEvent(kMetrics.QuestionSuggestion_Accepted, {
            state: this.getCurrentState(),
            trigger: trigger2,
            secondsLeftOnSuggestionCountdown: Math.round(
              (this.suggestionDeadline - window.getGlobalTime()) / 1e3
            )
          });
        },
        onAccept(isHotkey) {
          const quizType = this.bonusMode ? kQuizType.BONUS_FREE : kQuizType.REGULAR;
          this.$emit("on-start-challenge", quizType);
          this.trackSuggestionAccepted(
            isHotkey ? this.kTriggers.HOTKEY_PRESSED : this.kTriggers.MOUSE_CLICK
          );
        },
        askToStartWithoutAvailableLives() {
          if (this.bonusMode) {
            this.$emit("on-buy-lives");
            this.trackSuggestionAccepted(kTriggers.HOTKEY_PRESSED);
          } else {
            this.askToPurchaseLives(true);
          }
        },
        askToPurchaseLives(isHotkey) {
          var _a2;
          if (((_a2 = this.user) == null ? void 0 : _a2.hearts) === 0 && this.allowedToBuy && this.gotEnoughCoins) {
            this.$emit("on-buy-lives");
            this.trackSuggestionAccepted(
              isHotkey ? this.kTriggers.HOTKEY_PRESSED : this.kTriggers.MOUSE_CLICK
            );
          } else {
            console.log(`QuizSuggestion askToPurchaseLives - not allowed`);
          }
        },
        onCountdownEndAccept() {
          const quizType = this.bonusMode ? kQuizType.BONUS_FREE : kQuizType.REGULAR;
          this.$emit("on-start-challenge", quizType);
          this.trackSuggestionAccepted(this.kTriggers.COUNTDOWN_END);
        },
        onSkip(trigger2) {
          this.$emit("on-skip", trigger2);
          this.repoService.set(kRepoKeys.LAST_QUIZ_SKIPPED, getGlobalTime());
          window.main.trackEvent(kMetrics.QuestionSuggestion_Skipped, {
            state: this.getCurrentState(),
            trigger: trigger2,
            secondsLeftOnSuggestionCountdown: trigger2 === this.kTriggers.COUNTDOWN_END ? 0 : Math.round(
              (this.suggestionDeadline - window.getGlobalTime()) / 1e3
            )
          });
        }
      }
    };
    const _withScopeId$2 = (n) => (pushScopeId("data-v-2ef7f6fe"), n = n(), popScopeId(), n);
    const _hoisted_1$3 = { class: "suggestion-wrap d-flex flex-row" };
    const _hoisted_2$2 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ createBaseVNode("span", { class: "suggestion-app-logo" }, null, -1));
    const _hoisted_3$2 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ createBaseVNode("span", { class: "suggestion-sep" }, null, -1));
    const _hoisted_4$2 = {
      key: 0,
      class: "option-row d-flex flex-row"
    };
    const _hoisted_5$1 = { class: "suggestion-text" };
    const _hoisted_6$1 = {
      key: 1,
      class: "option-row d-flex flex-row"
    };
    const _hoisted_7$1 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ createBaseVNode("div", { class: "suggestion-text" }, "Learn. Earn. Repeat. Loading...", -1));
    const _hoisted_8$1 = {
      key: 2,
      class: "option-row d-flex flex-row"
    };
    const _hoisted_9$1 = { class: "suggestion-text" };
    const _hoisted_10$1 = { class: "d-flex" };
    const _hoisted_11$1 = {
      key: 3,
      class: "option-row d-flex flex-row"
    };
    const _hoisted_12$1 = {
      key: 0,
      class: "suggestion-text"
    };
    const _hoisted_13$1 = {
      key: 1,
      class: "suggestion-text"
    };
    const _hoisted_14$1 = { class: "d-flex" };
    const _hoisted_15$1 = {
      key: 4,
      class: "option-row d-flex flex-row"
    };
    const _hoisted_16 = {
      class: "suggestion-text smaller-text flex-row",
      style: { "margin-left": "12px" }
    };
    const _hoisted_17 = {
      key: 0,
      class: "flex-row"
    };
    const _hoisted_18 = { class: "d-flex" };
    const _hoisted_19 = {
      key: 5,
      class: "option-row d-flex flex-row"
    };
    const _hoisted_20 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ createBaseVNode("div", { class: "suggestion-text" }, "Unhandled visual state error", -1));
    function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
      const _component_vue_countdown = resolveComponent("vue-countdown");
      const _component_HotkeyLabel = resolveComponent("HotkeyLabel");
      const _component_LerHeart = resolveComponent("LerHeart");
      const _component_LerCoin = resolveComponent("LerCoin");
      return openBlock(), createElementBlock("div", _hoisted_1$3, [
        _hoisted_2$2,
        _hoisted_3$2,
        $props.errorMessage ? (openBlock(), createElementBlock("span", _hoisted_4$2, [
          createBaseVNode("div", _hoisted_5$1, toDisplayString($props.errorMessage), 1),
          createBaseVNode("div", {
            class: "btn-secondary-cta suggestion-secondary padLeft8",
            onClick: _cache[1] || (_cache[1] = ($event) => $options.onSkip($data.kTriggers.MOUSE_CLICK))
          }, [
            createTextVNode(" Hide "),
            $data.suggestionDeadline ? (openBlock(), createBlock(_component_vue_countdown, {
              key: 0,
              time: $data.suggestionDeadline - $options.clock,
              onEnd: _cache[0] || (_cache[0] = ($event) => $options.onSkip($data.kTriggers.COUNTDOWN_END))
            }, {
              default: withCtx(({ totalSeconds }) => [
                createTextVNode("in (" + toDisplayString(totalSeconds) + ")", 1)
              ]),
              _: 1
            }, 8, ["time"])) : createCommentVNode("", true),
            createVNode(_component_HotkeyLabel, {
              class: "padLeft4",
              "hk-id": _ctx.hkCancel,
              "game-id": $props.gameId
            }, null, 8, ["hk-id", "game-id"])
          ])
        ])) : !$props.user || $props.user.hearts === void 0 ? (openBlock(), createElementBlock("span", _hoisted_6$1, [
          _hoisted_7$1,
          createBaseVNode("div", {
            class: "btn-secondary-cta suggestion-secondary padLeft8",
            onClick: _cache[2] || (_cache[2] = ($event) => $options.onSkip($data.kTriggers.MOUSE_CLICK))
          }, [
            createTextVNode(" Close "),
            createVNode(_component_HotkeyLabel, {
              class: "padLeft4",
              "hk-id": _ctx.hkCancel,
              "game-id": $props.gameId
            }, null, 8, ["hk-id", "game-id"])
          ])
        ])) : $data.bonusMode ? (openBlock(), createElementBlock("span", _hoisted_8$1, [
          createBaseVNode("div", _hoisted_9$1, [
            createTextVNode(" You've missed a question during the game. Answer now! "),
            $data.suggestionDeadline ? (openBlock(), createBlock(_component_vue_countdown, {
              key: 0,
              time: $data.suggestionDeadline - $options.clock,
              onEnd: $options.onCountdownEndAccept
            }, {
              default: withCtx(({ totalSeconds }) => [
                createTextVNode(toDisplayString(totalSeconds), 1)
              ]),
              _: 1
            }, 8, ["time", "onEnd"])) : createCommentVNode("", true)
          ]),
          createBaseVNode("div", _hoisted_10$1, [
            createBaseVNode("div", {
              class: normalizeClass([{ "disabled-cta": $props.acceptInProgress }, "btn-main-cta"]),
              style: { "margin-right": "4px" },
              onClick: _cache[3] || (_cache[3] = () => $options.onAccept())
            }, [
              createTextVNode(" Start "),
              createVNode(_component_HotkeyLabel, {
                class: "padLeft4",
                "hk-id": _ctx.hkOk,
                "game-id": $props.gameId
              }, null, 8, ["hk-id", "game-id"])
            ], 2),
            createBaseVNode("div", {
              class: normalizeClass([{ "disabled-cta": $props.acceptInProgress }, "btn-secondary-cta suggestion-secondary padLeft8"]),
              onClick: _cache[4] || (_cache[4] = ($event) => $options.onSkip($data.kTriggers.MOUSE_CLICK))
            }, [
              createTextVNode(" Skip "),
              createVNode(_component_HotkeyLabel, {
                class: "padLeft4",
                "hk-id": _ctx.hkCancel,
                "game-id": $props.gameId
              }, null, 8, ["hk-id", "game-id"])
            ], 2)
          ])
        ])) : $props.user.hearts >= 1 ? (openBlock(), createElementBlock("span", _hoisted_11$1, [
          $props.autoSkipOnCountdownEnd ? (openBlock(), createElementBlock("div", _hoisted_12$1, [
            createTextVNode(" Question is ready. Closing in "),
            $data.suggestionDeadline ? (openBlock(), createBlock(_component_vue_countdown, {
              key: 0,
              time: $data.suggestionDeadline - $options.clock,
              onEnd: _cache[5] || (_cache[5] = ($event) => $options.onSkip($data.kTriggers.COUNTDOWN_END))
            }, {
              default: withCtx(({ totalSeconds }) => [
                createTextVNode(toDisplayString(totalSeconds), 1)
              ]),
              _: 1
            }, 8, ["time"])) : createCommentVNode("", true)
          ])) : (openBlock(), createElementBlock("div", _hoisted_13$1, [
            createTextVNode(" Question is ready. Starting in "),
            $data.suggestionDeadline ? (openBlock(), createBlock(_component_vue_countdown, {
              key: 0,
              time: $data.suggestionDeadline - $options.clock,
              onEnd: $options.onCountdownEndAccept
            }, {
              default: withCtx(({ totalSeconds }) => [
                createTextVNode(toDisplayString(totalSeconds), 1)
              ]),
              _: 1
            }, 8, ["time", "onEnd"])) : createCommentVNode("", true)
          ])),
          createBaseVNode("div", _hoisted_14$1, [
            createBaseVNode("div", {
              class: normalizeClass([{ "disabled-cta": $props.acceptInProgress }, "btn-main-cta"]),
              style: { "margin-right": "4px" },
              onClick: _cache[6] || (_cache[6] = () => $options.onAccept())
            }, [
              createTextVNode(" Start "),
              createVNode(_component_HotkeyLabel, {
                class: "padLeft4",
                "hk-id": _ctx.hkOk,
                "game-id": $props.gameId
              }, null, 8, ["hk-id", "game-id"])
            ], 2),
            createBaseVNode("div", {
              class: normalizeClass([{ "disabled-cta": $props.acceptInProgress }, "btn-secondary-cta suggestion-secondary padLeft8"]),
              onClick: _cache[7] || (_cache[7] = ($event) => $options.onSkip($data.kTriggers.MOUSE_CLICK))
            }, [
              createTextVNode(" Skip "),
              createVNode(_component_HotkeyLabel, {
                class: "padLeft4",
                "hk-id": _ctx.hkCancel,
                "game-id": $props.gameId
              }, null, 8, ["hk-id", "game-id"])
            ], 2)
          ])
        ])) : $props.user.hearts < 1 ? (openBlock(), createElementBlock("span", _hoisted_15$1, [
          createBaseVNode("span", _hoisted_16, [
            createVNode(_component_LerHeart),
            createTextVNode("0 left "),
            createVNode(_component_vue_countdown, { time: $data.livesRefillIn }, {
              default: withCtx(({ hours, minutes }) => [
                createTextVNode(" \xA0| " + toDisplayString(hours) + "h " + toDisplayString(minutes) + "m to refill\xA0", 1)
              ]),
              _: 1
            }, 8, ["time"]),
            $data.allowedToBuy && $options.gotEnoughCoins ? (openBlock(), createElementBlock("span", _hoisted_17, [
              createTextVNode(" | Buy "),
              createVNode(_component_LerHeart),
              createTextVNode(toDisplayString($data.heartsBundleAmount) + " for ", 1),
              createVNode(_component_LerCoin, { style: { "padding-right": "6px" } }),
              createTextVNode(toDisplayString($data.heartsBundlePrice), 1)
            ])) : createCommentVNode("", true)
          ]),
          createBaseVNode("div", _hoisted_18, [
            $data.allowedToBuy && $options.gotEnoughCoins ? (openBlock(), createElementBlock("div", {
              key: 0,
              class: "btn-main-cta",
              onClick: _cache[8] || (_cache[8] = (...args) => $options.askToPurchaseLives && $options.askToPurchaseLives(...args))
            }, [
              createTextVNode(" Buy now "),
              createVNode(_component_HotkeyLabel, {
                class: "padLeft4",
                "hk-id": _ctx.hkOk,
                "game-id": $props.gameId
              }, null, 8, ["hk-id", "game-id"])
            ])) : createCommentVNode("", true),
            createBaseVNode("div", {
              class: "btn-secondary-cta suggestion-secondary padLeft8",
              onClick: _cache[10] || (_cache[10] = ($event) => $options.onSkip($data.kTriggers.COUNTDOWN_END))
            }, [
              createTextVNode(" Hide "),
              $data.suggestionDeadline ? (openBlock(), createBlock(_component_vue_countdown, {
                key: 0,
                time: $data.suggestionDeadline - $options.clock,
                onEnd: _cache[9] || (_cache[9] = ($event) => $options.onSkip($data.kTriggers.COUNTDOWN_END))
              }, {
                default: withCtx(({ totalSeconds }) => [
                  createTextVNode(" in (" + toDisplayString(totalSeconds) + ") ", 1)
                ]),
                _: 1
              }, 8, ["time"])) : createCommentVNode("", true),
              createVNode(_component_HotkeyLabel, {
                class: "padLeft4",
                "hk-id": _ctx.hkCancel,
                "game-id": $props.gameId
              }, null, 8, ["hk-id", "game-id"])
            ])
          ])
        ])) : (openBlock(), createElementBlock("span", _hoisted_19, [
          _hoisted_20,
          createBaseVNode("div", {
            class: "btn-secondary-cta suggestion-secondary padLeft8",
            onClick: _cache[12] || (_cache[12] = ($event) => $options.onSkip($data.kTriggers.MOUSE_CLICK))
          }, [
            createTextVNode(" Hide "),
            $data.suggestionDeadline ? (openBlock(), createBlock(_component_vue_countdown, {
              key: 0,
              time: $data.suggestionDeadline - $options.clock,
              onEnd: _cache[11] || (_cache[11] = ($event) => $options.onSkip($data.kTriggers.COUNTDOWN_END))
            }, {
              default: withCtx(({ totalSeconds }) => [
                createTextVNode("in (" + toDisplayString(totalSeconds) + ")", 1)
              ]),
              _: 1
            }, 8, ["time"])) : createCommentVNode("", true),
            createVNode(_component_HotkeyLabel, {
              class: "padLeft4",
              "hk-id": _ctx.hkCancel,
              "game-id": $props.gameId
            }, null, 8, ["hk-id", "game-id"])
          ])
        ]))
      ]);
    }
    const QuizSuggestion = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$3], ["__scopeId", "data-v-2ef7f6fe"]]);
    const LerHeart_vue_vue_type_style_index_0_scoped_682400f4_lang = "";
    const _sfc_main$2 = {
      name: "LerCoin"
    };
    const _hoisted_1$2 = { class: "lives" };
    function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
      return openBlock(), createElementBlock("span", _hoisted_1$2);
    }
    const LerHeart = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2], ["__scopeId", "data-v-682400f4"]]);
    const TopRowView_vue_vue_type_style_index_0_scoped_994e28cf_lang = "";
    const _sfc_main$1 = {
      components: {
        HotkeyLabel
      },
      props: {
        onCloseWindow: Function,
        allowMaximize: Boolean,
        allowMinimize: Boolean,
        showTitle: Boolean,
        showUsername: Boolean,
        showBalance: Boolean,
        hideHotkey: Boolean
      },
      data() {
        return {
          counter: 0,
          isLoggedIn: false,
          isRegistered: false,
          username: "",
          lives: 0,
          coins: 0,
          hkCancel: null,
          gameId: ""
        };
      },
      beforeMount() {
        this.hkCancel = hkCancel;
      },
      mounted() {
        const headerEl = this.$refs.headerElRef;
        WindowsService.getCurrentWindow().then(({ window: window2 }) => {
          this._dragService = new DragService(window2, headerEl);
        });
        this.updateUserStats();
        const _eventListener = (eventName) => {
          if (eventName === kEventKeys.STORE_DATA_UPDATE) {
            this.updateUserStats();
          }
        };
        this._storeDataUpdateListenerBound = _eventListener.bind(this);
        const { storeUpdateSubscribe, runningGameService } = overwolf.windows.getMainWindow();
        this.listenerKey = storeUpdateSubscribe(this._storeDataUpdateListenerBound);
        runningGameService.getCurrentRunningGameId().then((gId) => {
          this.gameId = gId;
        });
      },
      unmounted() {
        const { storeUpdateUnsubscribe } = overwolf.windows.getMainWindow();
        storeUpdateUnsubscribe(this.listenerKey);
      },
      methods: {
        async maximizeWindow() {
          const { window: window2 } = await WindowsService.getCurrentWindow();
          if (window2.stateEx === "maximized") {
            await WindowsService.restore(window2.name);
          } else if (window2.stateEx === "normal") {
            await WindowsService.maximize(window2.name);
          }
        },
        async minimizeWindow() {
          const { window: currentWindow } = await WindowsService.getCurrentWindow();
          await WindowsService.minimize(currentWindow.name);
          window.main.trackEvent(kMetrics.View_Closed, {
            window: currentWindow.name,
            isHappyClose: false,
            trigger: kTriggers.MOUSE_CLICK
          });
        },
        async closeWindow() {
          if (this.onCloseWindow) {
            await this.onCloseWindow(kTriggers.MOUSE_CLICK);
          } else {
            const { window: currentWindow } = await WindowsService.getCurrentWindow();
            await WindowsService.close(currentWindow.name);
            window.main.trackEvent(kMetrics.View_Closed, {
              window: currentWindow.name,
              isHappyClose: false,
              trigger: kTriggers.MOUSE_CLICK
            });
          }
        },
        updateUserStats() {
          const { stateHolderService } = overwolf.windows.getMainWindow();
          const user = stateHolderService.get(kStores.USER);
          this.username = user == null ? void 0 : user.username;
          this.lives = user == null ? void 0 : user.hearts;
          this.coins = Number(user == null ? void 0 : user.balance).toLocaleString();
          if (user == null ? void 0 : user._id) {
            this.isLoggedIn = true;
          }
          if (user == null ? void 0 : user.isRegistered) {
            this.isRegistered = true;
          }
        }
      }
    };
    const _withScopeId$1 = (n) => (pushScopeId("data-v-994e28cf"), n = n(), popScopeId(), n);
    const _hoisted_1$1 = {
      ref: "headerElRef",
      class: "app-header"
    };
    const _hoisted_2$1 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ createBaseVNode("span", { class: "app-logo" }, null, -1));
    const _hoisted_3$1 = {
      key: 0,
      class: "app-title"
    };
    const _hoisted_4$1 = {
      key: 1,
      class: "top-row-sep top-spacer"
    };
    const _hoisted_5 = {
      key: 2,
      class: "top-row-sep-small-no-margin top-spacer"
    };
    const _hoisted_6 = {
      key: 3,
      class: "top-text lives"
    };
    const _hoisted_7 = {
      key: 4,
      class: "top-row-sep"
    };
    const _hoisted_8 = {
      key: 5,
      class: "top-text user"
    };
    const _hoisted_9 = {
      key: 6,
      class: "top-row-sep"
    };
    const _hoisted_10 = {
      key: 7,
      class: "top-text coins"
    };
    const _hoisted_11 = {
      key: 8,
      class: "top-row-sep"
    };
    const _hoisted_12 = {
      key: 9,
      class: "top-text"
    };
    const _hoisted_13 = {
      key: 10,
      class: "top-row-sep"
    };
    const _hoisted_14 = { class: "window-controls-group" };
    const _hoisted_15 = {
      key: 0,
      class: "top-text"
    };
    function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
      const _component_HotkeyLabel = resolveComponent("HotkeyLabel");
      return openBlock(), createElementBlock("header", _hoisted_1$1, [
        _hoisted_2$1,
        $props.showTitle ? (openBlock(), createElementBlock("h1", _hoisted_3$1, "Learn. Earn. Repeat.")) : createCommentVNode("", true),
        $props.showTitle ? (openBlock(), createElementBlock("span", _hoisted_4$1)) : (openBlock(), createElementBlock("span", _hoisted_5)),
        $data.isLoggedIn ? (openBlock(), createElementBlock("span", _hoisted_6, toDisplayString($data.lives) + "\xA0\xA0", 1)) : createCommentVNode("", true),
        $data.isLoggedIn && $props.showUsername ? (openBlock(), createElementBlock("span", _hoisted_7)) : createCommentVNode("", true),
        $data.isLoggedIn && $props.showUsername ? (openBlock(), createElementBlock("span", _hoisted_8, toDisplayString($data.isRegistered ? $data.username : "Guest") + "\xA0\xA0", 1)) : createCommentVNode("", true),
        $data.isLoggedIn && $props.showBalance ? (openBlock(), createElementBlock("span", _hoisted_9)) : createCommentVNode("", true),
        $data.isLoggedIn && $props.showBalance ? (openBlock(), createElementBlock("span", _hoisted_10, toDisplayString($data.coins), 1)) : createCommentVNode("", true),
        $data.isLoggedIn ? (openBlock(), createElementBlock("span", _hoisted_11)) : createCommentVNode("", true),
        !$data.isLoggedIn ? (openBlock(), createElementBlock("span", _hoisted_12, "Not logged in")) : createCommentVNode("", true),
        !$data.isLoggedIn ? (openBlock(), createElementBlock("span", _hoisted_13)) : createCommentVNode("", true),
        createBaseVNode("div", _hoisted_14, [
          !$props.hideHotkey ? (openBlock(), createElementBlock("span", _hoisted_15, "Show / Hide")) : createCommentVNode("", true),
          !$props.hideHotkey ? (openBlock(), createBlock(_component_HotkeyLabel, {
            key: 1,
            "hk-id": $data.hkCancel,
            "game-id": $data.gameId
          }, null, 8, ["hk-id", "game-id"])) : createCommentVNode("", true),
          $props.allowMinimize ? (openBlock(), createElementBlock("button", {
            key: 2,
            id: "minimizeButton",
            class: "window-control window-control-minimize",
            onClick: _cache[0] || (_cache[0] = (...args) => $options.minimizeWindow && $options.minimizeWindow(...args))
          })) : createCommentVNode("", true),
          $props.allowMaximize ? (openBlock(), createElementBlock("button", {
            key: 3,
            id: "maximizeButton",
            class: "window-control window-control-maximize",
            onClick: _cache[1] || (_cache[1] = (...args) => $options.maximizeWindow && $options.maximizeWindow(...args))
          })) : createCommentVNode("", true),
          createBaseVNode("button", {
            id: "closeButton",
            class: "window-control window-control-close",
            onClick: _cache[2] || (_cache[2] = (...args) => $options.closeWindow && $options.closeWindow(...args))
          })
        ])
      ], 512);
    }
    const TopRowView = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__scopeId", "data-v-994e28cf"]]);
    const CollectAfterGame_vue_vue_type_style_index_0_scoped_7e723979_lang = "";
    const _sfc_main = {
      name: "CollectAfterGame",
      props: [],
      data() {
        return {};
      }
    };
    const _withScopeId = (n) => (pushScopeId("data-v-7e723979"), n = n(), popScopeId(), n);
    const _hoisted_1 = { class: "resultBoxWrap flex-row" };
    const _hoisted_2 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("div", { class: "rIcon" }, null, -1));
    const _hoisted_3 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("div", { class: "flex-column" }, [
      /* @__PURE__ */ createBaseVNode("div", { class: "step2ResultBox step4Size" }, " Collect your winnings and find out the popular answer after the game ")
    ], -1));
    const _hoisted_4 = [
      _hoisted_2,
      _hoisted_3
    ];
    function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
      return openBlock(), createElementBlock("div", _hoisted_1, _hoisted_4);
    }
    const CollectAfterGame = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-7e723979"]]);
    /*! vue-countdown v2.1.0 | (c) 2018-present Chen Fengyuan | MIT */
    const MILLISECONDS_SECOND = 1e3;
    const MILLISECONDS_MINUTE = 60 * MILLISECONDS_SECOND;
    const MILLISECONDS_HOUR = 60 * MILLISECONDS_MINUTE;
    const MILLISECONDS_DAY = 24 * MILLISECONDS_HOUR;
    const EVENT_ABORT = "abort";
    const EVENT_END = "end";
    const EVENT_PROGRESS = "progress";
    const EVENT_START = "start";
    const EVENT_VISIBILITY_CHANGE = "visibilitychange";
    var index = defineComponent({
      name: "VueCountdown",
      props: {
        autoStart: {
          type: Boolean,
          default: true
        },
        emitEvents: {
          type: Boolean,
          default: true
        },
        interval: {
          type: Number,
          default: 1e3,
          validator: (value) => value >= 0
        },
        now: {
          type: Function,
          default: () => Date.now()
        },
        tag: {
          type: String,
          default: "span"
        },
        time: {
          type: Number,
          default: 0,
          validator: (value) => value >= 0
        },
        transform: {
          type: Function,
          default: (props) => props
        }
      },
      emits: [
        EVENT_ABORT,
        EVENT_END,
        EVENT_PROGRESS,
        EVENT_START
      ],
      data() {
        return {
          counting: false,
          endTime: 0,
          totalMilliseconds: 0,
          requestId: 0
        };
      },
      computed: {
        days() {
          return Math.floor(this.totalMilliseconds / MILLISECONDS_DAY);
        },
        hours() {
          return Math.floor(this.totalMilliseconds % MILLISECONDS_DAY / MILLISECONDS_HOUR);
        },
        minutes() {
          return Math.floor(this.totalMilliseconds % MILLISECONDS_HOUR / MILLISECONDS_MINUTE);
        },
        seconds() {
          return Math.floor(this.totalMilliseconds % MILLISECONDS_MINUTE / MILLISECONDS_SECOND);
        },
        milliseconds() {
          return Math.floor(this.totalMilliseconds % MILLISECONDS_SECOND);
        },
        totalDays() {
          return this.days;
        },
        totalHours() {
          return Math.floor(this.totalMilliseconds / MILLISECONDS_HOUR);
        },
        totalMinutes() {
          return Math.floor(this.totalMilliseconds / MILLISECONDS_MINUTE);
        },
        totalSeconds() {
          return Math.floor(this.totalMilliseconds / MILLISECONDS_SECOND);
        }
      },
      watch: {
        $props: {
          deep: true,
          immediate: true,
          handler() {
            this.totalMilliseconds = this.time;
            this.endTime = this.now() + this.time;
            if (this.autoStart) {
              this.start();
            }
          }
        }
      },
      mounted() {
        document.addEventListener(EVENT_VISIBILITY_CHANGE, this.handleVisibilityChange);
      },
      beforeUnmount() {
        document.removeEventListener(EVENT_VISIBILITY_CHANGE, this.handleVisibilityChange);
        this.pause();
      },
      methods: {
        start() {
          if (this.counting) {
            return;
          }
          this.counting = true;
          if (this.emitEvents) {
            this.$emit(EVENT_START);
          }
          if (document.visibilityState === "visible") {
            this.continue();
          }
        },
        continue() {
          if (!this.counting) {
            return;
          }
          const delay = Math.min(this.totalMilliseconds, this.interval);
          if (delay > 0) {
            let init2;
            let prev;
            const step = (now) => {
              if (!init2) {
                init2 = now;
              }
              if (!prev) {
                prev = now;
              }
              const range = now - init2;
              if (range >= delay || range + (now - prev) / 2 >= delay) {
                this.progress();
              } else {
                this.requestId = requestAnimationFrame(step);
              }
              prev = now;
            };
            this.requestId = requestAnimationFrame(step);
          } else {
            this.end();
          }
        },
        pause() {
          cancelAnimationFrame(this.requestId);
        },
        progress() {
          if (!this.counting) {
            return;
          }
          this.totalMilliseconds -= this.interval;
          if (this.emitEvents && this.totalMilliseconds > 0) {
            this.$emit(EVENT_PROGRESS, {
              days: this.days,
              hours: this.hours,
              minutes: this.minutes,
              seconds: this.seconds,
              milliseconds: this.milliseconds,
              totalDays: this.totalDays,
              totalHours: this.totalHours,
              totalMinutes: this.totalMinutes,
              totalSeconds: this.totalSeconds,
              totalMilliseconds: this.totalMilliseconds
            });
          }
          this.continue();
        },
        abort() {
          if (!this.counting) {
            return;
          }
          this.pause();
          this.counting = false;
          if (this.emitEvents) {
            this.$emit(EVENT_ABORT);
          }
        },
        end() {
          if (!this.counting) {
            return;
          }
          this.pause();
          this.totalMilliseconds = 0;
          this.counting = false;
          if (this.emitEvents) {
            this.$emit(EVENT_END);
          }
        },
        update() {
          if (this.counting) {
            this.totalMilliseconds = Math.max(0, this.endTime - this.now());
          }
        },
        restart() {
          this.pause();
          this.totalMilliseconds = this.time;
          this.endTime = this.now() + this.time;
          this.counting = false;
          this.start();
        },
        handleVisibilityChange() {
          switch (document.visibilityState) {
            case "visible":
              this.update();
              this.continue();
              break;
            case "hidden":
              this.pause();
              break;
          }
        }
      },
      render() {
        return h(this.tag, this.$slots.default ? [
          this.$slots.default(this.transform({
            days: this.days,
            hours: this.hours,
            minutes: this.minutes,
            seconds: this.seconds,
            milliseconds: this.milliseconds,
            totalDays: this.totalDays,
            totalHours: this.totalHours,
            totalMinutes: this.totalMinutes,
            totalSeconds: this.totalSeconds,
            totalMilliseconds: this.totalMilliseconds
          }))
        ] : void 0);
      }
    });
    const objectToString = Object.prototype.toString;
    function isError(wat) {
      switch (objectToString.call(wat)) {
        case "[object Error]":
        case "[object Exception]":
        case "[object DOMException]":
          return true;
        default:
          return isInstanceOf(wat, Error);
      }
    }
    function isBuiltin(wat, className) {
      return objectToString.call(wat) === `[object ${className}]`;
    }
    function isErrorEvent(wat) {
      return isBuiltin(wat, "ErrorEvent");
    }
    function isDOMError(wat) {
      return isBuiltin(wat, "DOMError");
    }
    function isDOMException(wat) {
      return isBuiltin(wat, "DOMException");
    }
    function isString(wat) {
      return isBuiltin(wat, "String");
    }
    function isPrimitive(wat) {
      return wat === null || typeof wat !== "object" && typeof wat !== "function";
    }
    function isPlainObject(wat) {
      return isBuiltin(wat, "Object");
    }
    function isEvent(wat) {
      return typeof Event !== "undefined" && isInstanceOf(wat, Event);
    }
    function isElement(wat) {
      return typeof Element !== "undefined" && isInstanceOf(wat, Element);
    }
    function isRegExp(wat) {
      return isBuiltin(wat, "RegExp");
    }
    function isThenable(wat) {
      return Boolean(wat && wat.then && typeof wat.then === "function");
    }
    function isSyntheticEvent(wat) {
      return isPlainObject(wat) && "nativeEvent" in wat && "preventDefault" in wat && "stopPropagation" in wat;
    }
    function isNaN$1(wat) {
      return typeof wat === "number" && wat !== wat;
    }
    function isInstanceOf(wat, base) {
      try {
        return wat instanceof base;
      } catch (_e) {
        return false;
      }
    }
    function isGlobalObj$1(obj) {
      return obj && obj.Math == Math ? obj : void 0;
    }
    const GLOBAL_OBJ$1 = typeof globalThis == "object" && isGlobalObj$1(globalThis) || typeof window == "object" && isGlobalObj$1(window) || typeof self == "object" && isGlobalObj$1(self) || typeof global == "object" && isGlobalObj$1(global) || function() {
      return this;
    }() || {};
    function getGlobalObject() {
      return GLOBAL_OBJ$1;
    }
    function getGlobalSingleton$1(name, creator, obj) {
      const gbl = obj || GLOBAL_OBJ$1;
      const __SENTRY__ = gbl.__SENTRY__ = gbl.__SENTRY__ || {};
      const singleton = __SENTRY__[name] || (__SENTRY__[name] = creator());
      return singleton;
    }
    const WINDOW$5 = getGlobalObject();
    function htmlTreeAsString(elem, keyAttrs) {
      try {
        let currentElem = elem;
        const MAX_TRAVERSE_HEIGHT = 5;
        const MAX_OUTPUT_LEN = 80;
        const out = [];
        let height = 0;
        let len = 0;
        const separator = " > ";
        const sepLength = separator.length;
        let nextStr;
        while (currentElem && height++ < MAX_TRAVERSE_HEIGHT) {
          nextStr = _htmlElementAsString(currentElem, keyAttrs);
          if (nextStr === "html" || height > 1 && len + out.length * sepLength + nextStr.length >= MAX_OUTPUT_LEN) {
            break;
          }
          out.push(nextStr);
          len += nextStr.length;
          currentElem = currentElem.parentNode;
        }
        return out.reverse().join(separator);
      } catch (_oO) {
        return "<unknown>";
      }
    }
    function _htmlElementAsString(el, keyAttrs) {
      const elem = el;
      const out = [];
      let className;
      let classes;
      let key;
      let attr;
      let i;
      if (!elem || !elem.tagName) {
        return "";
      }
      out.push(elem.tagName.toLowerCase());
      const keyAttrPairs = keyAttrs && keyAttrs.length ? keyAttrs.filter((keyAttr) => elem.getAttribute(keyAttr)).map((keyAttr) => [keyAttr, elem.getAttribute(keyAttr)]) : null;
      if (keyAttrPairs && keyAttrPairs.length) {
        keyAttrPairs.forEach((keyAttrPair) => {
          out.push(`[${keyAttrPair[0]}="${keyAttrPair[1]}"]`);
        });
      } else {
        if (elem.id) {
          out.push(`#${elem.id}`);
        }
        className = elem.className;
        if (className && isString(className)) {
          classes = className.split(/\s+/);
          for (i = 0; i < classes.length; i++) {
            out.push(`.${classes[i]}`);
          }
        }
      }
      const allowedAttrs = ["type", "name", "title", "alt"];
      for (i = 0; i < allowedAttrs.length; i++) {
        key = allowedAttrs[i];
        attr = elem.getAttribute(key);
        if (attr) {
          out.push(`[${key}="${attr}"]`);
        }
      }
      return out.join("");
    }
    function getLocationHref() {
      try {
        return WINDOW$5.document.location.href;
      } catch (oO) {
        return "";
      }
    }
    function getDomElement(selector) {
      if (WINDOW$5.document && WINDOW$5.document.querySelector) {
        return WINDOW$5.document.querySelector(selector);
      }
      return null;
    }
    class SentryError extends Error {
      constructor(message, logLevel = "warn") {
        super(message);
        this.message = message;
        this.name = new.target.prototype.constructor.name;
        Object.setPrototypeOf(this, new.target.prototype);
        this.logLevel = logLevel;
      }
    }
    const DSN_REGEX = /^(?:(\w+):)\/\/(?:(\w+)(?::(\w+)?)?@)([\w.-]+)(?::(\d+))?\/(.+)/;
    function isValidProtocol(protocol) {
      return protocol === "http" || protocol === "https";
    }
    function dsnToString(dsn, withPassword = false) {
      const { host, path, pass, port, projectId, protocol, publicKey } = dsn;
      return `${protocol}://${publicKey}${withPassword && pass ? `:${pass}` : ""}@${host}${port ? `:${port}` : ""}/${path ? `${path}/` : path}${projectId}`;
    }
    function dsnFromString(str) {
      const match = DSN_REGEX.exec(str);
      if (!match) {
        throw new SentryError(`Invalid Sentry Dsn: ${str}`);
      }
      const [protocol, publicKey, pass = "", host, port = "", lastPath] = match.slice(1);
      let path = "";
      let projectId = lastPath;
      const split = projectId.split("/");
      if (split.length > 1) {
        path = split.slice(0, -1).join("/");
        projectId = split.pop();
      }
      if (projectId) {
        const projectMatch = projectId.match(/^\d+/);
        if (projectMatch) {
          projectId = projectMatch[0];
        }
      }
      return dsnFromComponents({ host, pass, path, projectId, port, protocol, publicKey });
    }
    function dsnFromComponents(components) {
      return {
        protocol: components.protocol,
        publicKey: components.publicKey || "",
        pass: components.pass || "",
        host: components.host,
        port: components.port || "",
        path: components.path || "",
        projectId: components.projectId
      };
    }
    function validateDsn(dsn) {
      if (!(typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__)) {
        return;
      }
      const { port, projectId, protocol } = dsn;
      const requiredComponents = ["protocol", "publicKey", "host", "projectId"];
      requiredComponents.forEach((component) => {
        if (!dsn[component]) {
          throw new SentryError(`Invalid Sentry Dsn: ${component} missing`);
        }
      });
      if (!projectId.match(/^\d+$/)) {
        throw new SentryError(`Invalid Sentry Dsn: Invalid projectId ${projectId}`);
      }
      if (!isValidProtocol(protocol)) {
        throw new SentryError(`Invalid Sentry Dsn: Invalid protocol ${protocol}`);
      }
      if (port && isNaN(parseInt(port, 10))) {
        throw new SentryError(`Invalid Sentry Dsn: Invalid port ${port}`);
      }
      return true;
    }
    function makeDsn(from) {
      const components = typeof from === "string" ? dsnFromString(from) : dsnFromComponents(from);
      validateDsn(components);
      return components;
    }
    const PREFIX$1 = "Sentry Logger ";
    const CONSOLE_LEVELS$1 = ["debug", "info", "warn", "error", "log", "assert", "trace"];
    function consoleSandbox$1(callback) {
      if (!("console" in GLOBAL_OBJ$1)) {
        return callback();
      }
      const originalConsole = GLOBAL_OBJ$1.console;
      const wrappedLevels = {};
      CONSOLE_LEVELS$1.forEach((level) => {
        const originalWrappedFunc = originalConsole[level] && originalConsole[level].__sentry_original__;
        if (level in originalConsole && originalWrappedFunc) {
          wrappedLevels[level] = originalConsole[level];
          originalConsole[level] = originalWrappedFunc;
        }
      });
      try {
        return callback();
      } finally {
        Object.keys(wrappedLevels).forEach((level) => {
          originalConsole[level] = wrappedLevels[level];
        });
      }
    }
    function makeLogger$1() {
      let enabled = false;
      const logger2 = {
        enable: () => {
          enabled = true;
        },
        disable: () => {
          enabled = false;
        }
      };
      if (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) {
        CONSOLE_LEVELS$1.forEach((name) => {
          logger2[name] = (...args) => {
            if (enabled) {
              consoleSandbox$1(() => {
                GLOBAL_OBJ$1.console[name](`${PREFIX$1}[${name}]:`, ...args);
              });
            }
          };
        });
      } else {
        CONSOLE_LEVELS$1.forEach((name) => {
          logger2[name] = () => void 0;
        });
      }
      return logger2;
    }
    let logger;
    if (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) {
      logger = getGlobalSingleton$1("logger", makeLogger$1);
    } else {
      logger = makeLogger$1();
    }
    function truncate(str, max = 0) {
      if (typeof str !== "string" || max === 0) {
        return str;
      }
      return str.length <= max ? str : `${str.substr(0, max)}...`;
    }
    function safeJoin$1(input, delimiter) {
      if (!Array.isArray(input)) {
        return "";
      }
      const output = [];
      for (let i = 0; i < input.length; i++) {
        const value = input[i];
        try {
          output.push(String(value));
        } catch (e) {
          output.push("[value cannot be serialized]");
        }
      }
      return output.join(delimiter);
    }
    function isMatchingPattern(value, pattern, requireExactStringMatch = false) {
      if (!isString(value)) {
        return false;
      }
      if (isRegExp(pattern)) {
        return pattern.test(value);
      }
      if (isString(pattern)) {
        return requireExactStringMatch ? value === pattern : value.includes(pattern);
      }
      return false;
    }
    function stringMatchesSomePattern(testString, patterns = [], requireExactStringMatch = false) {
      return patterns.some((pattern) => isMatchingPattern(testString, pattern, requireExactStringMatch));
    }
    function fill$1(source, name, replacementFactory) {
      if (!(name in source)) {
        return;
      }
      const original = source[name];
      const wrapped = replacementFactory(original);
      if (typeof wrapped === "function") {
        try {
          markFunctionWrapped$1(wrapped, original);
        } catch (_Oo) {
        }
      }
      source[name] = wrapped;
    }
    function addNonEnumerableProperty$1(obj, name, value) {
      Object.defineProperty(obj, name, {
        value,
        writable: true,
        configurable: true
      });
    }
    function markFunctionWrapped$1(wrapped, original) {
      const proto = original.prototype || {};
      wrapped.prototype = original.prototype = proto;
      addNonEnumerableProperty$1(wrapped, "__sentry_original__", original);
    }
    function getOriginalFunction(func) {
      return func.__sentry_original__;
    }
    function urlEncode(object) {
      return Object.keys(object).map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(object[key])}`).join("&");
    }
    function convertToPlainObject(value) {
      if (isError(value)) {
        return {
          message: value.message,
          name: value.name,
          stack: value.stack,
          ...getOwnProperties(value)
        };
      } else if (isEvent(value)) {
        const newObj = {
          type: value.type,
          target: serializeEventTarget(value.target),
          currentTarget: serializeEventTarget(value.currentTarget),
          ...getOwnProperties(value)
        };
        if (typeof CustomEvent !== "undefined" && isInstanceOf(value, CustomEvent)) {
          newObj.detail = value.detail;
        }
        return newObj;
      } else {
        return value;
      }
    }
    function serializeEventTarget(target) {
      try {
        return isElement(target) ? htmlTreeAsString(target) : Object.prototype.toString.call(target);
      } catch (_oO) {
        return "<unknown>";
      }
    }
    function getOwnProperties(obj) {
      if (typeof obj === "object" && obj !== null) {
        const extractedProps = {};
        for (const property in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, property)) {
            extractedProps[property] = obj[property];
          }
        }
        return extractedProps;
      } else {
        return {};
      }
    }
    function extractExceptionKeysForMessage(exception, maxLength = 40) {
      const keys = Object.keys(convertToPlainObject(exception));
      keys.sort();
      if (!keys.length) {
        return "[object has no keys]";
      }
      if (keys[0].length >= maxLength) {
        return truncate(keys[0], maxLength);
      }
      for (let includedKeys = keys.length; includedKeys > 0; includedKeys--) {
        const serialized = keys.slice(0, includedKeys).join(", ");
        if (serialized.length > maxLength) {
          continue;
        }
        if (includedKeys === keys.length) {
          return serialized;
        }
        return truncate(serialized, maxLength);
      }
      return "";
    }
    function dropUndefinedKeys(inputValue) {
      const memoizationMap = /* @__PURE__ */ new Map();
      return _dropUndefinedKeys(inputValue, memoizationMap);
    }
    function _dropUndefinedKeys(inputValue, memoizationMap) {
      if (isPlainObject(inputValue)) {
        const memoVal = memoizationMap.get(inputValue);
        if (memoVal !== void 0) {
          return memoVal;
        }
        const returnValue = {};
        memoizationMap.set(inputValue, returnValue);
        for (const key of Object.keys(inputValue)) {
          if (typeof inputValue[key] !== "undefined") {
            returnValue[key] = _dropUndefinedKeys(inputValue[key], memoizationMap);
          }
        }
        return returnValue;
      }
      if (Array.isArray(inputValue)) {
        const memoVal = memoizationMap.get(inputValue);
        if (memoVal !== void 0) {
          return memoVal;
        }
        const returnValue = [];
        memoizationMap.set(inputValue, returnValue);
        inputValue.forEach((item) => {
          returnValue.push(_dropUndefinedKeys(item, memoizationMap));
        });
        return returnValue;
      }
      return inputValue;
    }
    function _nullishCoalesce(lhs, rhsFn) {
      return lhs != null ? lhs : rhsFn();
    }
    function _optionalChain(ops) {
      let lastAccessLHS = void 0;
      let value = ops[0];
      let i = 1;
      while (i < ops.length) {
        const op = ops[i];
        const fn = ops[i + 1];
        i += 2;
        if ((op === "optionalAccess" || op === "optionalCall") && value == null) {
          return;
        }
        if (op === "access" || op === "optionalAccess") {
          lastAccessLHS = value;
          value = fn(value);
        } else if (op === "call" || op === "optionalCall") {
          value = fn((...args) => value.call(lastAccessLHS, ...args));
          lastAccessLHS = void 0;
        }
      }
      return value;
    }
    const STACKTRACE_LIMIT = 50;
    function createStackParser(...parsers) {
      const sortedParsers = parsers.sort((a, b) => a[0] - b[0]).map((p2) => p2[1]);
      return (stack, skipFirst = 0) => {
        const frames = [];
        for (const line of stack.split("\n").slice(skipFirst)) {
          const cleanedLine = line.replace(/\(error: (.*)\)/, "$1");
          for (const parser of sortedParsers) {
            const frame = parser(cleanedLine);
            if (frame) {
              frames.push(frame);
              break;
            }
          }
        }
        return stripSentryFramesAndReverse(frames);
      };
    }
    function stackParserFromStackParserOptions(stackParser) {
      if (Array.isArray(stackParser)) {
        return createStackParser(...stackParser);
      }
      return stackParser;
    }
    function stripSentryFramesAndReverse(stack) {
      if (!stack.length) {
        return [];
      }
      let localStack = stack;
      const firstFrameFunction = localStack[0].function || "";
      const lastFrameFunction = localStack[localStack.length - 1].function || "";
      if (firstFrameFunction.indexOf("captureMessage") !== -1 || firstFrameFunction.indexOf("captureException") !== -1) {
        localStack = localStack.slice(1);
      }
      if (lastFrameFunction.indexOf("sentryWrapped") !== -1) {
        localStack = localStack.slice(0, -1);
      }
      return localStack.slice(0, STACKTRACE_LIMIT).map((frame) => ({
        ...frame,
        filename: frame.filename || localStack[0].filename,
        function: frame.function || "?"
      })).reverse();
    }
    const defaultFunctionName = "<anonymous>";
    function getFunctionName(fn) {
      try {
        if (!fn || typeof fn !== "function") {
          return defaultFunctionName;
        }
        return fn.name || defaultFunctionName;
      } catch (e) {
        return defaultFunctionName;
      }
    }
    const WINDOW$4 = getGlobalObject();
    function supportsFetch() {
      if (!("fetch" in WINDOW$4)) {
        return false;
      }
      try {
        new Headers();
        new Request("http://www.example.com");
        new Response();
        return true;
      } catch (e) {
        return false;
      }
    }
    function isNativeFetch(func) {
      return func && /^function fetch\(\)\s+\{\s+\[native code\]\s+\}$/.test(func.toString());
    }
    function supportsNativeFetch() {
      if (!supportsFetch()) {
        return false;
      }
      if (isNativeFetch(WINDOW$4.fetch)) {
        return true;
      }
      let result = false;
      const doc2 = WINDOW$4.document;
      if (doc2 && typeof doc2.createElement === "function") {
        try {
          const sandbox = doc2.createElement("iframe");
          sandbox.hidden = true;
          doc2.head.appendChild(sandbox);
          if (sandbox.contentWindow && sandbox.contentWindow.fetch) {
            result = isNativeFetch(sandbox.contentWindow.fetch);
          }
          doc2.head.removeChild(sandbox);
        } catch (err) {
          (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.warn("Could not create sandbox iframe for pure fetch check, bailing to window.fetch: ", err);
        }
      }
      return result;
    }
    function supportsHistory() {
      const chrome2 = WINDOW$4.chrome;
      const isChromePackagedApp = chrome2 && chrome2.app && chrome2.app.runtime;
      const hasHistoryApi = "history" in WINDOW$4 && !!WINDOW$4.history.pushState && !!WINDOW$4.history.replaceState;
      return !isChromePackagedApp && hasHistoryApi;
    }
    const WINDOW$3 = getGlobalObject();
    const handlers = {};
    const instrumented = {};
    function instrument(type) {
      if (instrumented[type]) {
        return;
      }
      instrumented[type] = true;
      switch (type) {
        case "console":
          instrumentConsole();
          break;
        case "dom":
          instrumentDOM();
          break;
        case "xhr":
          instrumentXHR();
          break;
        case "fetch":
          instrumentFetch();
          break;
        case "history":
          instrumentHistory();
          break;
        case "error":
          instrumentError();
          break;
        case "unhandledrejection":
          instrumentUnhandledRejection();
          break;
        default:
          (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.warn("unknown instrumentation type:", type);
          return;
      }
    }
    function addInstrumentationHandler(type, callback) {
      handlers[type] = handlers[type] || [];
      handlers[type].push(callback);
      instrument(type);
    }
    function triggerHandlers(type, data) {
      if (!type || !handlers[type]) {
        return;
      }
      for (const handler of handlers[type] || []) {
        try {
          handler(data);
        } catch (e) {
          (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.error(
            `Error while triggering instrumentation handler.
Type: ${type}
Name: ${getFunctionName(handler)}
Error:`,
            e
          );
        }
      }
    }
    function instrumentConsole() {
      if (!("console" in WINDOW$3)) {
        return;
      }
      CONSOLE_LEVELS$1.forEach(function(level) {
        if (!(level in WINDOW$3.console)) {
          return;
        }
        fill$1(WINDOW$3.console, level, function(originalConsoleMethod) {
          return function(...args) {
            triggerHandlers("console", { args, level });
            if (originalConsoleMethod) {
              originalConsoleMethod.apply(WINDOW$3.console, args);
            }
          };
        });
      });
    }
    function instrumentFetch() {
      if (!supportsNativeFetch()) {
        return;
      }
      fill$1(WINDOW$3, "fetch", function(originalFetch) {
        return function(...args) {
          const handlerData = {
            args,
            fetchData: {
              method: getFetchMethod(args),
              url: getFetchUrl(args)
            },
            startTimestamp: Date.now()
          };
          triggerHandlers("fetch", {
            ...handlerData
          });
          return originalFetch.apply(WINDOW$3, args).then(
            (response) => {
              triggerHandlers("fetch", {
                ...handlerData,
                endTimestamp: Date.now(),
                response
              });
              return response;
            },
            (error) => {
              triggerHandlers("fetch", {
                ...handlerData,
                endTimestamp: Date.now(),
                error
              });
              throw error;
            }
          );
        };
      });
    }
    function getFetchMethod(fetchArgs = []) {
      if ("Request" in WINDOW$3 && isInstanceOf(fetchArgs[0], Request) && fetchArgs[0].method) {
        return String(fetchArgs[0].method).toUpperCase();
      }
      if (fetchArgs[1] && fetchArgs[1].method) {
        return String(fetchArgs[1].method).toUpperCase();
      }
      return "GET";
    }
    function getFetchUrl(fetchArgs = []) {
      if (typeof fetchArgs[0] === "string") {
        return fetchArgs[0];
      }
      if ("Request" in WINDOW$3 && isInstanceOf(fetchArgs[0], Request)) {
        return fetchArgs[0].url;
      }
      return String(fetchArgs[0]);
    }
    function instrumentXHR() {
      if (!("XMLHttpRequest" in WINDOW$3)) {
        return;
      }
      const xhrproto = XMLHttpRequest.prototype;
      fill$1(xhrproto, "open", function(originalOpen) {
        return function(...args) {
          const xhr = this;
          const url = args[1];
          const xhrInfo = xhr.__sentry_xhr__ = {
            method: isString(args[0]) ? args[0].toUpperCase() : args[0],
            url: args[1]
          };
          if (isString(url) && xhrInfo.method === "POST" && url.match(/sentry_key/)) {
            xhr.__sentry_own_request__ = true;
          }
          const onreadystatechangeHandler = function() {
            if (xhr.readyState === 4) {
              try {
                xhrInfo.status_code = xhr.status;
              } catch (e) {
              }
              triggerHandlers("xhr", {
                args,
                endTimestamp: Date.now(),
                startTimestamp: Date.now(),
                xhr
              });
            }
          };
          if ("onreadystatechange" in xhr && typeof xhr.onreadystatechange === "function") {
            fill$1(xhr, "onreadystatechange", function(original) {
              return function(...readyStateArgs) {
                onreadystatechangeHandler();
                return original.apply(xhr, readyStateArgs);
              };
            });
          } else {
            xhr.addEventListener("readystatechange", onreadystatechangeHandler);
          }
          return originalOpen.apply(xhr, args);
        };
      });
      fill$1(xhrproto, "send", function(originalSend) {
        return function(...args) {
          if (this.__sentry_xhr__ && args[0] !== void 0) {
            this.__sentry_xhr__.body = args[0];
          }
          triggerHandlers("xhr", {
            args,
            startTimestamp: Date.now(),
            xhr: this
          });
          return originalSend.apply(this, args);
        };
      });
    }
    let lastHref;
    function instrumentHistory() {
      if (!supportsHistory()) {
        return;
      }
      const oldOnPopState = WINDOW$3.onpopstate;
      WINDOW$3.onpopstate = function(...args) {
        const to = WINDOW$3.location.href;
        const from = lastHref;
        lastHref = to;
        triggerHandlers("history", {
          from,
          to
        });
        if (oldOnPopState) {
          try {
            return oldOnPopState.apply(this, args);
          } catch (_oO) {
          }
        }
      };
      function historyReplacementFunction(originalHistoryFunction) {
        return function(...args) {
          const url = args.length > 2 ? args[2] : void 0;
          if (url) {
            const from = lastHref;
            const to = String(url);
            lastHref = to;
            triggerHandlers("history", {
              from,
              to
            });
          }
          return originalHistoryFunction.apply(this, args);
        };
      }
      fill$1(WINDOW$3.history, "pushState", historyReplacementFunction);
      fill$1(WINDOW$3.history, "replaceState", historyReplacementFunction);
    }
    const debounceDuration = 1e3;
    let debounceTimerID;
    let lastCapturedEvent;
    function shouldShortcircuitPreviousDebounce(previous, current) {
      if (!previous) {
        return true;
      }
      if (previous.type !== current.type) {
        return true;
      }
      try {
        if (previous.target !== current.target) {
          return true;
        }
      } catch (e) {
      }
      return false;
    }
    function shouldSkipDOMEvent(event) {
      if (event.type !== "keypress") {
        return false;
      }
      try {
        const target = event.target;
        if (!target || !target.tagName) {
          return true;
        }
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
          return false;
        }
      } catch (e) {
      }
      return true;
    }
    function makeDOMEventHandler(handler, globalListener = false) {
      return (event) => {
        if (!event || lastCapturedEvent === event) {
          return;
        }
        if (shouldSkipDOMEvent(event)) {
          return;
        }
        const name = event.type === "keypress" ? "input" : event.type;
        if (debounceTimerID === void 0) {
          handler({
            event,
            name,
            global: globalListener
          });
          lastCapturedEvent = event;
        } else if (shouldShortcircuitPreviousDebounce(lastCapturedEvent, event)) {
          handler({
            event,
            name,
            global: globalListener
          });
          lastCapturedEvent = event;
        }
        clearTimeout(debounceTimerID);
        debounceTimerID = WINDOW$3.setTimeout(() => {
          debounceTimerID = void 0;
        }, debounceDuration);
      };
    }
    function instrumentDOM() {
      if (!("document" in WINDOW$3)) {
        return;
      }
      const triggerDOMHandler = triggerHandlers.bind(null, "dom");
      const globalDOMEventHandler = makeDOMEventHandler(triggerDOMHandler, true);
      WINDOW$3.document.addEventListener("click", globalDOMEventHandler, false);
      WINDOW$3.document.addEventListener("keypress", globalDOMEventHandler, false);
      ["EventTarget", "Node"].forEach((target) => {
        const proto = WINDOW$3[target] && WINDOW$3[target].prototype;
        if (!proto || !proto.hasOwnProperty || !proto.hasOwnProperty("addEventListener")) {
          return;
        }
        fill$1(proto, "addEventListener", function(originalAddEventListener) {
          return function(type, listener, options) {
            if (type === "click" || type == "keypress") {
              try {
                const el = this;
                const handlers2 = el.__sentry_instrumentation_handlers__ = el.__sentry_instrumentation_handlers__ || {};
                const handlerForType = handlers2[type] = handlers2[type] || { refCount: 0 };
                if (!handlerForType.handler) {
                  const handler = makeDOMEventHandler(triggerDOMHandler);
                  handlerForType.handler = handler;
                  originalAddEventListener.call(this, type, handler, options);
                }
                handlerForType.refCount++;
              } catch (e) {
              }
            }
            return originalAddEventListener.call(this, type, listener, options);
          };
        });
        fill$1(
          proto,
          "removeEventListener",
          function(originalRemoveEventListener) {
            return function(type, listener, options) {
              if (type === "click" || type == "keypress") {
                try {
                  const el = this;
                  const handlers2 = el.__sentry_instrumentation_handlers__ || {};
                  const handlerForType = handlers2[type];
                  if (handlerForType) {
                    handlerForType.refCount--;
                    if (handlerForType.refCount <= 0) {
                      originalRemoveEventListener.call(this, type, handlerForType.handler, options);
                      handlerForType.handler = void 0;
                      delete handlers2[type];
                    }
                    if (Object.keys(handlers2).length === 0) {
                      delete el.__sentry_instrumentation_handlers__;
                    }
                  }
                } catch (e) {
                }
              }
              return originalRemoveEventListener.call(this, type, listener, options);
            };
          }
        );
      });
    }
    let _oldOnErrorHandler = null;
    function instrumentError() {
      _oldOnErrorHandler = WINDOW$3.onerror;
      WINDOW$3.onerror = function(msg, url, line, column, error) {
        triggerHandlers("error", {
          column,
          error,
          line,
          msg,
          url
        });
        if (_oldOnErrorHandler) {
          return _oldOnErrorHandler.apply(this, arguments);
        }
        return false;
      };
    }
    let _oldOnUnhandledRejectionHandler = null;
    function instrumentUnhandledRejection() {
      _oldOnUnhandledRejectionHandler = WINDOW$3.onunhandledrejection;
      WINDOW$3.onunhandledrejection = function(e) {
        triggerHandlers("unhandledrejection", e);
        if (_oldOnUnhandledRejectionHandler) {
          return _oldOnUnhandledRejectionHandler.apply(this, arguments);
        }
        return true;
      };
    }
    function memoBuilder() {
      const hasWeakSet = typeof WeakSet === "function";
      const inner = hasWeakSet ? /* @__PURE__ */ new WeakSet() : [];
      function memoize(obj) {
        if (hasWeakSet) {
          if (inner.has(obj)) {
            return true;
          }
          inner.add(obj);
          return false;
        }
        for (let i = 0; i < inner.length; i++) {
          const value = inner[i];
          if (value === obj) {
            return true;
          }
        }
        inner.push(obj);
        return false;
      }
      function unmemoize(obj) {
        if (hasWeakSet) {
          inner.delete(obj);
        } else {
          for (let i = 0; i < inner.length; i++) {
            if (inner[i] === obj) {
              inner.splice(i, 1);
              break;
            }
          }
        }
      }
      return [memoize, unmemoize];
    }
    function uuid4() {
      const gbl = GLOBAL_OBJ$1;
      const crypto2 = gbl.crypto || gbl.msCrypto;
      if (crypto2 && crypto2.randomUUID) {
        return crypto2.randomUUID().replace(/-/g, "");
      }
      const getRandomByte = crypto2 && crypto2.getRandomValues ? () => crypto2.getRandomValues(new Uint8Array(1))[0] : () => Math.random() * 16;
      return ([1e7] + 1e3 + 4e3 + 8e3 + 1e11).replace(
        /[018]/g,
        (c) => (c ^ (getRandomByte() & 15) >> c / 4).toString(16)
      );
    }
    function getFirstException(event) {
      return event.exception && event.exception.values ? event.exception.values[0] : void 0;
    }
    function getEventDescription(event) {
      const { message, event_id: eventId } = event;
      if (message) {
        return message;
      }
      const firstException = getFirstException(event);
      if (firstException) {
        if (firstException.type && firstException.value) {
          return `${firstException.type}: ${firstException.value}`;
        }
        return firstException.type || firstException.value || eventId || "<unknown>";
      }
      return eventId || "<unknown>";
    }
    function addExceptionTypeValue(event, value, type) {
      const exception = event.exception = event.exception || {};
      const values = exception.values = exception.values || [];
      const firstException = values[0] = values[0] || {};
      if (!firstException.value) {
        firstException.value = value || "";
      }
      if (!firstException.type) {
        firstException.type = type || "Error";
      }
    }
    function addExceptionMechanism(event, newMechanism) {
      const firstException = getFirstException(event);
      if (!firstException) {
        return;
      }
      const defaultMechanism = { type: "generic", handled: true };
      const currentMechanism = firstException.mechanism;
      firstException.mechanism = { ...defaultMechanism, ...currentMechanism, ...newMechanism };
      if (newMechanism && "data" in newMechanism) {
        const mergedData = { ...currentMechanism && currentMechanism.data, ...newMechanism.data };
        firstException.mechanism.data = mergedData;
      }
    }
    function checkOrSetAlreadyCaught(exception) {
      if (exception && exception.__sentry_captured__) {
        return true;
      }
      try {
        addNonEnumerableProperty$1(exception, "__sentry_captured__", true);
      } catch (err) {
      }
      return false;
    }
    function arrayify(maybeArray) {
      return Array.isArray(maybeArray) ? maybeArray : [maybeArray];
    }
    function isBrowserBundle() {
      return typeof __SENTRY_BROWSER_BUNDLE__ !== "undefined" && !!__SENTRY_BROWSER_BUNDLE__;
    }
    function isNodeEnv() {
      return !isBrowserBundle() && Object.prototype.toString.call(typeof process !== "undefined" ? process : 0) === "[object process]";
    }
    function dynamicRequire(mod, request) {
      return mod.require(request);
    }
    function loadModule(moduleName) {
      let mod;
      try {
        mod = dynamicRequire(module, moduleName);
      } catch (e) {
      }
      try {
        const { cwd } = dynamicRequire(module, "process");
        mod = dynamicRequire(module, `${cwd()}/node_modules/${moduleName}`);
      } catch (e) {
      }
      return mod;
    }
    function normalize(input, depth = Infinity, maxProperties = Infinity) {
      try {
        return visit("", input, depth, maxProperties);
      } catch (err) {
        return { ERROR: `**non-serializable** (${err})` };
      }
    }
    function normalizeToSize(object, depth = 3, maxSize = 100 * 1024) {
      const normalized = normalize(object, depth);
      if (jsonSize(normalized) > maxSize) {
        return normalizeToSize(object, depth - 1, maxSize);
      }
      return normalized;
    }
    function visit(key, value, depth = Infinity, maxProperties = Infinity, memo = memoBuilder()) {
      const [memoize, unmemoize] = memo;
      if (value === null || ["number", "boolean", "string"].includes(typeof value) && !isNaN$1(value)) {
        return value;
      }
      const stringified = stringifyValue(key, value);
      if (!stringified.startsWith("[object ")) {
        return stringified;
      }
      if (value["__sentry_skip_normalization__"]) {
        return value;
      }
      if (depth === 0) {
        return stringified.replace("object ", "");
      }
      if (memoize(value)) {
        return "[Circular ~]";
      }
      const valueWithToJSON = value;
      if (valueWithToJSON && typeof valueWithToJSON.toJSON === "function") {
        try {
          const jsonValue = valueWithToJSON.toJSON();
          return visit("", jsonValue, depth - 1, maxProperties, memo);
        } catch (err) {
        }
      }
      const normalized = Array.isArray(value) ? [] : {};
      let numAdded = 0;
      const visitable = convertToPlainObject(value);
      for (const visitKey in visitable) {
        if (!Object.prototype.hasOwnProperty.call(visitable, visitKey)) {
          continue;
        }
        if (numAdded >= maxProperties) {
          normalized[visitKey] = "[MaxProperties ~]";
          break;
        }
        const visitValue = visitable[visitKey];
        normalized[visitKey] = visit(visitKey, visitValue, depth - 1, maxProperties, memo);
        numAdded++;
      }
      unmemoize(value);
      return normalized;
    }
    function stringifyValue(key, value) {
      try {
        if (key === "domain" && value && typeof value === "object" && value._events) {
          return "[Domain]";
        }
        if (key === "domainEmitter") {
          return "[DomainEmitter]";
        }
        if (typeof global !== "undefined" && value === global) {
          return "[Global]";
        }
        if (typeof window !== "undefined" && value === window) {
          return "[Window]";
        }
        if (typeof document !== "undefined" && value === document) {
          return "[Document]";
        }
        if (isSyntheticEvent(value)) {
          return "[SyntheticEvent]";
        }
        if (typeof value === "number" && value !== value) {
          return "[NaN]";
        }
        if (value === void 0) {
          return "[undefined]";
        }
        if (typeof value === "function") {
          return `[Function: ${getFunctionName(value)}]`;
        }
        if (typeof value === "symbol") {
          return `[${String(value)}]`;
        }
        if (typeof value === "bigint") {
          return `[BigInt: ${String(value)}]`;
        }
        return `[object ${Object.getPrototypeOf(value).constructor.name}]`;
      } catch (err) {
        return `**non-serializable** (${err})`;
      }
    }
    function utf8Length(value) {
      return ~-encodeURI(value).split(/%..|./).length;
    }
    function jsonSize(value) {
      return utf8Length(JSON.stringify(value));
    }
    var States;
    (function(States2) {
      const PENDING = 0;
      States2[States2["PENDING"] = PENDING] = "PENDING";
      const RESOLVED = 1;
      States2[States2["RESOLVED"] = RESOLVED] = "RESOLVED";
      const REJECTED = 2;
      States2[States2["REJECTED"] = REJECTED] = "REJECTED";
    })(States || (States = {}));
    function resolvedSyncPromise(value) {
      return new SyncPromise((resolve2) => {
        resolve2(value);
      });
    }
    function rejectedSyncPromise(reason) {
      return new SyncPromise((_, reject) => {
        reject(reason);
      });
    }
    class SyncPromise {
      __init() {
        this._state = States.PENDING;
      }
      __init2() {
        this._handlers = [];
      }
      constructor(executor) {
        SyncPromise.prototype.__init.call(this);
        SyncPromise.prototype.__init2.call(this);
        SyncPromise.prototype.__init3.call(this);
        SyncPromise.prototype.__init4.call(this);
        SyncPromise.prototype.__init5.call(this);
        SyncPromise.prototype.__init6.call(this);
        try {
          executor(this._resolve, this._reject);
        } catch (e) {
          this._reject(e);
        }
      }
      then(onfulfilled, onrejected) {
        return new SyncPromise((resolve2, reject) => {
          this._handlers.push([
            false,
            (result) => {
              if (!onfulfilled) {
                resolve2(result);
              } else {
                try {
                  resolve2(onfulfilled(result));
                } catch (e) {
                  reject(e);
                }
              }
            },
            (reason) => {
              if (!onrejected) {
                reject(reason);
              } else {
                try {
                  resolve2(onrejected(reason));
                } catch (e) {
                  reject(e);
                }
              }
            }
          ]);
          this._executeHandlers();
        });
      }
      catch(onrejected) {
        return this.then((val) => val, onrejected);
      }
      finally(onfinally) {
        return new SyncPromise((resolve2, reject) => {
          let val;
          let isRejected;
          return this.then(
            (value) => {
              isRejected = false;
              val = value;
              if (onfinally) {
                onfinally();
              }
            },
            (reason) => {
              isRejected = true;
              val = reason;
              if (onfinally) {
                onfinally();
              }
            }
          ).then(() => {
            if (isRejected) {
              reject(val);
              return;
            }
            resolve2(val);
          });
        });
      }
      __init3() {
        this._resolve = (value) => {
          this._setResult(States.RESOLVED, value);
        };
      }
      __init4() {
        this._reject = (reason) => {
          this._setResult(States.REJECTED, reason);
        };
      }
      __init5() {
        this._setResult = (state, value) => {
          if (this._state !== States.PENDING) {
            return;
          }
          if (isThenable(value)) {
            void value.then(this._resolve, this._reject);
            return;
          }
          this._state = state;
          this._value = value;
          this._executeHandlers();
        };
      }
      __init6() {
        this._executeHandlers = () => {
          if (this._state === States.PENDING) {
            return;
          }
          const cachedHandlers = this._handlers.slice();
          this._handlers = [];
          cachedHandlers.forEach((handler) => {
            if (handler[0]) {
              return;
            }
            if (this._state === States.RESOLVED) {
              handler[1](this._value);
            }
            if (this._state === States.REJECTED) {
              handler[2](this._value);
            }
            handler[0] = true;
          });
        };
      }
    }
    function makePromiseBuffer(limit) {
      const buffer = [];
      function isReady() {
        return limit === void 0 || buffer.length < limit;
      }
      function remove2(task) {
        return buffer.splice(buffer.indexOf(task), 1)[0];
      }
      function add2(taskProducer) {
        if (!isReady()) {
          return rejectedSyncPromise(new SentryError("Not adding Promise because buffer limit was reached."));
        }
        const task = taskProducer();
        if (buffer.indexOf(task) === -1) {
          buffer.push(task);
        }
        void task.then(() => remove2(task)).then(
          null,
          () => remove2(task).then(null, () => {
          })
        );
        return task;
      }
      function drain(timeout) {
        return new SyncPromise((resolve2, reject) => {
          let counter = buffer.length;
          if (!counter) {
            return resolve2(true);
          }
          const capturedSetTimeout = setTimeout(() => {
            if (timeout && timeout > 0) {
              resolve2(false);
            }
          }, timeout);
          buffer.forEach((item) => {
            void resolvedSyncPromise(item).then(() => {
              if (!--counter) {
                clearTimeout(capturedSetTimeout);
                resolve2(true);
              }
            }, reject);
          });
        });
      }
      return {
        $: buffer,
        add: add2,
        drain
      };
    }
    function parseUrl(url) {
      if (!url) {
        return {};
      }
      const match = url.match(/^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/);
      if (!match) {
        return {};
      }
      const query = match[6] || "";
      const fragment = match[8] || "";
      return {
        host: match[4],
        path: match[5],
        protocol: match[2],
        relative: match[5] + query + fragment
      };
    }
    const validSeverityLevels$1 = ["fatal", "error", "warning", "log", "info", "debug"];
    function severityLevelFromString$1(level) {
      return level === "warn" ? "warning" : validSeverityLevels$1.includes(level) ? level : "log";
    }
    const WINDOW$2 = getGlobalObject();
    const dateTimestampSource = {
      nowSeconds: () => Date.now() / 1e3
    };
    function getBrowserPerformance() {
      const { performance: performance2 } = WINDOW$2;
      if (!performance2 || !performance2.now) {
        return void 0;
      }
      const timeOrigin = Date.now() - performance2.now();
      return {
        now: () => performance2.now(),
        timeOrigin
      };
    }
    function getNodePerformance() {
      try {
        const perfHooks = dynamicRequire(module, "perf_hooks");
        return perfHooks.performance;
      } catch (_) {
        return void 0;
      }
    }
    const platformPerformance = isNodeEnv() ? getNodePerformance() : getBrowserPerformance();
    const timestampSource = platformPerformance === void 0 ? dateTimestampSource : {
      nowSeconds: () => (platformPerformance.timeOrigin + platformPerformance.now()) / 1e3
    };
    const dateTimestampInSeconds = dateTimestampSource.nowSeconds.bind(dateTimestampSource);
    const timestampInSeconds = timestampSource.nowSeconds.bind(timestampSource);
    const timestampWithMs = timestampInSeconds;
    const browserPerformanceTimeOrigin = (() => {
      const { performance: performance2 } = WINDOW$2;
      if (!performance2 || !performance2.now) {
        return void 0;
      }
      const threshold = 3600 * 1e3;
      const performanceNow = performance2.now();
      const dateNow = Date.now();
      const timeOriginDelta = performance2.timeOrigin ? Math.abs(performance2.timeOrigin + performanceNow - dateNow) : threshold;
      const timeOriginIsReliable = timeOriginDelta < threshold;
      const navigationStart = performance2.timing && performance2.timing.navigationStart;
      const hasNavigationStart = typeof navigationStart === "number";
      const navigationStartDelta = hasNavigationStart ? Math.abs(navigationStart + performanceNow - dateNow) : threshold;
      const navigationStartIsReliable = navigationStartDelta < threshold;
      if (timeOriginIsReliable || navigationStartIsReliable) {
        if (timeOriginDelta <= navigationStartDelta) {
          return performance2.timeOrigin;
        } else {
          return navigationStart;
        }
      }
      return dateNow;
    })();
    const TRACEPARENT_REGEXP = new RegExp(
      "^[ \\t]*([0-9a-f]{32})?-?([0-9a-f]{16})?-?([01])?[ \\t]*$"
    );
    function extractTraceparentData(traceparent) {
      const matches = traceparent.match(TRACEPARENT_REGEXP);
      if (!traceparent || !matches) {
        return void 0;
      }
      let parentSampled;
      if (matches[3] === "1") {
        parentSampled = true;
      } else if (matches[3] === "0") {
        parentSampled = false;
      }
      return {
        traceId: matches[1],
        parentSampled,
        parentSpanId: matches[2]
      };
    }
    function createEnvelope(headers, items = []) {
      return [headers, items];
    }
    function addItemToEnvelope(envelope, newItem) {
      const [headers, items] = envelope;
      return [headers, [...items, newItem]];
    }
    function forEachEnvelopeItem(envelope, callback) {
      const envelopeItems = envelope[1];
      envelopeItems.forEach((envelopeItem) => {
        const envelopeItemType = envelopeItem[0].type;
        callback(envelopeItem, envelopeItemType);
      });
    }
    function encodeUTF8(input, textEncoder) {
      const utf8 = textEncoder || new TextEncoder();
      return utf8.encode(input);
    }
    function serializeEnvelope(envelope, textEncoder) {
      const [envHeaders, items] = envelope;
      let parts = JSON.stringify(envHeaders);
      function append(next) {
        if (typeof parts === "string") {
          parts = typeof next === "string" ? parts + next : [encodeUTF8(parts, textEncoder), next];
        } else {
          parts.push(typeof next === "string" ? encodeUTF8(next, textEncoder) : next);
        }
      }
      for (const item of items) {
        const [itemHeaders, payload] = item;
        append(`
${JSON.stringify(itemHeaders)}
`);
        if (typeof payload === "string" || payload instanceof Uint8Array) {
          append(payload);
        } else {
          let stringifiedPayload;
          try {
            stringifiedPayload = JSON.stringify(payload);
          } catch (e) {
            stringifiedPayload = JSON.stringify(normalize(payload));
          }
          append(stringifiedPayload);
        }
      }
      return typeof parts === "string" ? parts : concatBuffers(parts);
    }
    function concatBuffers(buffers) {
      const totalLength = buffers.reduce((acc, buf) => acc + buf.length, 0);
      const merged = new Uint8Array(totalLength);
      let offset = 0;
      for (const buffer of buffers) {
        merged.set(buffer, offset);
        offset += buffer.length;
      }
      return merged;
    }
    function createAttachmentEnvelopeItem(attachment, textEncoder) {
      const buffer = typeof attachment.data === "string" ? encodeUTF8(attachment.data, textEncoder) : attachment.data;
      return [
        dropUndefinedKeys({
          type: "attachment",
          length: buffer.length,
          filename: attachment.filename,
          content_type: attachment.contentType,
          attachment_type: attachment.attachmentType
        }),
        buffer
      ];
    }
    const ITEM_TYPE_TO_DATA_CATEGORY_MAP = {
      session: "session",
      sessions: "session",
      attachment: "attachment",
      transaction: "transaction",
      event: "error",
      client_report: "internal",
      user_report: "default"
    };
    function envelopeItemTypeToDataCategory(type) {
      return ITEM_TYPE_TO_DATA_CATEGORY_MAP[type];
    }
    function createClientReportEnvelope(discarded_events, dsn, timestamp) {
      const clientReportItem = [
        { type: "client_report" },
        {
          timestamp: timestamp || dateTimestampInSeconds(),
          discarded_events
        }
      ];
      return createEnvelope(dsn ? { dsn } : {}, [clientReportItem]);
    }
    const DEFAULT_RETRY_AFTER = 60 * 1e3;
    function parseRetryAfterHeader(header, now = Date.now()) {
      const headerDelay = parseInt(`${header}`, 10);
      if (!isNaN(headerDelay)) {
        return headerDelay * 1e3;
      }
      const headerDate = Date.parse(`${header}`);
      if (!isNaN(headerDate)) {
        return headerDate - now;
      }
      return DEFAULT_RETRY_AFTER;
    }
    function disabledUntil(limits, category) {
      return limits[category] || limits.all || 0;
    }
    function isRateLimited(limits, category, now = Date.now()) {
      return disabledUntil(limits, category) > now;
    }
    function updateRateLimits(limits, { statusCode, headers }, now = Date.now()) {
      const updatedRateLimits = {
        ...limits
      };
      const rateLimitHeader = headers && headers["x-sentry-rate-limits"];
      const retryAfterHeader = headers && headers["retry-after"];
      if (rateLimitHeader) {
        for (const limit of rateLimitHeader.trim().split(",")) {
          const [retryAfter, categories] = limit.split(":", 2);
          const headerDelay = parseInt(retryAfter, 10);
          const delay = (!isNaN(headerDelay) ? headerDelay : 60) * 1e3;
          if (!categories) {
            updatedRateLimits.all = now + delay;
          } else {
            for (const category of categories.split(";")) {
              updatedRateLimits[category] = now + delay;
            }
          }
        }
      } else if (retryAfterHeader) {
        updatedRateLimits.all = now + parseRetryAfterHeader(retryAfterHeader, now);
      } else if (statusCode === 429) {
        updatedRateLimits.all = now + 60 * 1e3;
      }
      return updatedRateLimits;
    }
    const BAGGAGE_HEADER_NAME = "baggage";
    const SENTRY_BAGGAGE_KEY_PREFIX = "sentry-";
    const SENTRY_BAGGAGE_KEY_PREFIX_REGEX = /^sentry-/;
    const MAX_BAGGAGE_STRING_LENGTH = 8192;
    function baggageHeaderToDynamicSamplingContext(baggageHeader) {
      if (!isString(baggageHeader) && !Array.isArray(baggageHeader)) {
        return void 0;
      }
      let baggageObject = {};
      if (Array.isArray(baggageHeader)) {
        baggageObject = baggageHeader.reduce((acc, curr) => {
          const currBaggageObject = baggageHeaderToObject(curr);
          return {
            ...acc,
            ...currBaggageObject
          };
        }, {});
      } else {
        if (!baggageHeader) {
          return void 0;
        }
        baggageObject = baggageHeaderToObject(baggageHeader);
      }
      const dynamicSamplingContext = Object.entries(baggageObject).reduce((acc, [key, value]) => {
        if (key.match(SENTRY_BAGGAGE_KEY_PREFIX_REGEX)) {
          const nonPrefixedKey = key.slice(SENTRY_BAGGAGE_KEY_PREFIX.length);
          acc[nonPrefixedKey] = value;
        }
        return acc;
      }, {});
      if (Object.keys(dynamicSamplingContext).length > 0) {
        return dynamicSamplingContext;
      } else {
        return void 0;
      }
    }
    function dynamicSamplingContextToSentryBaggageHeader(dynamicSamplingContext) {
      const sentryPrefixedDSC = Object.entries(dynamicSamplingContext).reduce(
        (acc, [dscKey, dscValue]) => {
          if (dscValue) {
            acc[`${SENTRY_BAGGAGE_KEY_PREFIX}${dscKey}`] = dscValue;
          }
          return acc;
        },
        {}
      );
      return objectToBaggageHeader(sentryPrefixedDSC);
    }
    function baggageHeaderToObject(baggageHeader) {
      return baggageHeader.split(",").map((baggageEntry) => baggageEntry.split("=").map((keyOrValue) => decodeURIComponent(keyOrValue.trim()))).reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});
    }
    function objectToBaggageHeader(object) {
      if (Object.keys(object).length === 0) {
        return void 0;
      }
      return Object.entries(object).reduce((baggageHeader, [objectKey, objectValue], currentIndex) => {
        const baggageEntry = `${encodeURIComponent(objectKey)}=${encodeURIComponent(objectValue)}`;
        const newBaggageHeader = currentIndex === 0 ? baggageEntry : `${baggageHeader},${baggageEntry}`;
        if (newBaggageHeader.length > MAX_BAGGAGE_STRING_LENGTH) {
          (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.warn(
            `Not adding key: ${objectKey} with val: ${objectValue} to baggage header due to exceeding baggage size limits.`
          );
          return baggageHeader;
        } else {
          return newBaggageHeader;
        }
      }, "");
    }
    function makeSession(context) {
      const startingTime = timestampInSeconds();
      const session = {
        sid: uuid4(),
        init: true,
        timestamp: startingTime,
        started: startingTime,
        duration: 0,
        status: "ok",
        errors: 0,
        ignoreDuration: false,
        toJSON: () => sessionToJSON(session)
      };
      if (context) {
        updateSession(session, context);
      }
      return session;
    }
    function updateSession(session, context = {}) {
      if (context.user) {
        if (!session.ipAddress && context.user.ip_address) {
          session.ipAddress = context.user.ip_address;
        }
        if (!session.did && !context.did) {
          session.did = context.user.id || context.user.email || context.user.username;
        }
      }
      session.timestamp = context.timestamp || timestampInSeconds();
      if (context.ignoreDuration) {
        session.ignoreDuration = context.ignoreDuration;
      }
      if (context.sid) {
        session.sid = context.sid.length === 32 ? context.sid : uuid4();
      }
      if (context.init !== void 0) {
        session.init = context.init;
      }
      if (!session.did && context.did) {
        session.did = `${context.did}`;
      }
      if (typeof context.started === "number") {
        session.started = context.started;
      }
      if (session.ignoreDuration) {
        session.duration = void 0;
      } else if (typeof context.duration === "number") {
        session.duration = context.duration;
      } else {
        const duration = session.timestamp - session.started;
        session.duration = duration >= 0 ? duration : 0;
      }
      if (context.release) {
        session.release = context.release;
      }
      if (context.environment) {
        session.environment = context.environment;
      }
      if (!session.ipAddress && context.ipAddress) {
        session.ipAddress = context.ipAddress;
      }
      if (!session.userAgent && context.userAgent) {
        session.userAgent = context.userAgent;
      }
      if (typeof context.errors === "number") {
        session.errors = context.errors;
      }
      if (context.status) {
        session.status = context.status;
      }
    }
    function closeSession(session, status) {
      let context = {};
      if (status) {
        context = { status };
      } else if (session.status === "ok") {
        context = { status: "exited" };
      }
      updateSession(session, context);
    }
    function sessionToJSON(session) {
      return dropUndefinedKeys({
        sid: `${session.sid}`,
        init: session.init,
        started: new Date(session.started * 1e3).toISOString(),
        timestamp: new Date(session.timestamp * 1e3).toISOString(),
        status: session.status,
        errors: session.errors,
        did: typeof session.did === "number" || typeof session.did === "string" ? `${session.did}` : void 0,
        duration: session.duration,
        attrs: {
          release: session.release,
          environment: session.environment,
          ip_address: session.ipAddress,
          user_agent: session.userAgent
        }
      });
    }
    const DEFAULT_MAX_BREADCRUMBS = 100;
    class Scope {
      constructor() {
        this._notifyingListeners = false;
        this._scopeListeners = [];
        this._eventProcessors = [];
        this._breadcrumbs = [];
        this._attachments = [];
        this._user = {};
        this._tags = {};
        this._extra = {};
        this._contexts = {};
        this._sdkProcessingMetadata = {};
      }
      static clone(scope) {
        const newScope = new Scope();
        if (scope) {
          newScope._breadcrumbs = [...scope._breadcrumbs];
          newScope._tags = { ...scope._tags };
          newScope._extra = { ...scope._extra };
          newScope._contexts = { ...scope._contexts };
          newScope._user = scope._user;
          newScope._level = scope._level;
          newScope._span = scope._span;
          newScope._session = scope._session;
          newScope._transactionName = scope._transactionName;
          newScope._fingerprint = scope._fingerprint;
          newScope._eventProcessors = [...scope._eventProcessors];
          newScope._requestSession = scope._requestSession;
          newScope._attachments = [...scope._attachments];
          newScope._sdkProcessingMetadata = { ...scope._sdkProcessingMetadata };
        }
        return newScope;
      }
      addScopeListener(callback) {
        this._scopeListeners.push(callback);
      }
      addEventProcessor(callback) {
        this._eventProcessors.push(callback);
        return this;
      }
      setUser(user) {
        this._user = user || {};
        if (this._session) {
          updateSession(this._session, { user });
        }
        this._notifyScopeListeners();
        return this;
      }
      getUser() {
        return this._user;
      }
      getRequestSession() {
        return this._requestSession;
      }
      setRequestSession(requestSession) {
        this._requestSession = requestSession;
        return this;
      }
      setTags(tags) {
        this._tags = {
          ...this._tags,
          ...tags
        };
        this._notifyScopeListeners();
        return this;
      }
      setTag(key, value) {
        this._tags = { ...this._tags, [key]: value };
        this._notifyScopeListeners();
        return this;
      }
      setExtras(extras) {
        this._extra = {
          ...this._extra,
          ...extras
        };
        this._notifyScopeListeners();
        return this;
      }
      setExtra(key, extra) {
        this._extra = { ...this._extra, [key]: extra };
        this._notifyScopeListeners();
        return this;
      }
      setFingerprint(fingerprint) {
        this._fingerprint = fingerprint;
        this._notifyScopeListeners();
        return this;
      }
      setLevel(level) {
        this._level = level;
        this._notifyScopeListeners();
        return this;
      }
      setTransactionName(name) {
        this._transactionName = name;
        this._notifyScopeListeners();
        return this;
      }
      setContext(key, context) {
        if (context === null) {
          delete this._contexts[key];
        } else {
          this._contexts[key] = context;
        }
        this._notifyScopeListeners();
        return this;
      }
      setSpan(span) {
        this._span = span;
        this._notifyScopeListeners();
        return this;
      }
      getSpan() {
        return this._span;
      }
      getTransaction() {
        const span = this.getSpan();
        return span && span.transaction;
      }
      setSession(session) {
        if (!session) {
          delete this._session;
        } else {
          this._session = session;
        }
        this._notifyScopeListeners();
        return this;
      }
      getSession() {
        return this._session;
      }
      update(captureContext) {
        if (!captureContext) {
          return this;
        }
        if (typeof captureContext === "function") {
          const updatedScope = captureContext(this);
          return updatedScope instanceof Scope ? updatedScope : this;
        }
        if (captureContext instanceof Scope) {
          this._tags = { ...this._tags, ...captureContext._tags };
          this._extra = { ...this._extra, ...captureContext._extra };
          this._contexts = { ...this._contexts, ...captureContext._contexts };
          if (captureContext._user && Object.keys(captureContext._user).length) {
            this._user = captureContext._user;
          }
          if (captureContext._level) {
            this._level = captureContext._level;
          }
          if (captureContext._fingerprint) {
            this._fingerprint = captureContext._fingerprint;
          }
          if (captureContext._requestSession) {
            this._requestSession = captureContext._requestSession;
          }
        } else if (isPlainObject(captureContext)) {
          captureContext = captureContext;
          this._tags = { ...this._tags, ...captureContext.tags };
          this._extra = { ...this._extra, ...captureContext.extra };
          this._contexts = { ...this._contexts, ...captureContext.contexts };
          if (captureContext.user) {
            this._user = captureContext.user;
          }
          if (captureContext.level) {
            this._level = captureContext.level;
          }
          if (captureContext.fingerprint) {
            this._fingerprint = captureContext.fingerprint;
          }
          if (captureContext.requestSession) {
            this._requestSession = captureContext.requestSession;
          }
        }
        return this;
      }
      clear() {
        this._breadcrumbs = [];
        this._tags = {};
        this._extra = {};
        this._user = {};
        this._contexts = {};
        this._level = void 0;
        this._transactionName = void 0;
        this._fingerprint = void 0;
        this._requestSession = void 0;
        this._span = void 0;
        this._session = void 0;
        this._notifyScopeListeners();
        this._attachments = [];
        return this;
      }
      addBreadcrumb(breadcrumb, maxBreadcrumbs) {
        const maxCrumbs = typeof maxBreadcrumbs === "number" ? maxBreadcrumbs : DEFAULT_MAX_BREADCRUMBS;
        if (maxCrumbs <= 0) {
          return this;
        }
        const mergedBreadcrumb = {
          timestamp: dateTimestampInSeconds(),
          ...breadcrumb
        };
        this._breadcrumbs = [...this._breadcrumbs, mergedBreadcrumb].slice(-maxCrumbs);
        this._notifyScopeListeners();
        return this;
      }
      clearBreadcrumbs() {
        this._breadcrumbs = [];
        this._notifyScopeListeners();
        return this;
      }
      addAttachment(attachment) {
        this._attachments.push(attachment);
        return this;
      }
      getAttachments() {
        return this._attachments;
      }
      clearAttachments() {
        this._attachments = [];
        return this;
      }
      applyToEvent(event, hint = {}) {
        if (this._extra && Object.keys(this._extra).length) {
          event.extra = { ...this._extra, ...event.extra };
        }
        if (this._tags && Object.keys(this._tags).length) {
          event.tags = { ...this._tags, ...event.tags };
        }
        if (this._user && Object.keys(this._user).length) {
          event.user = { ...this._user, ...event.user };
        }
        if (this._contexts && Object.keys(this._contexts).length) {
          event.contexts = { ...this._contexts, ...event.contexts };
        }
        if (this._level) {
          event.level = this._level;
        }
        if (this._transactionName) {
          event.transaction = this._transactionName;
        }
        if (this._span) {
          event.contexts = { trace: this._span.getTraceContext(), ...event.contexts };
          const transactionName = this._span.transaction && this._span.transaction.name;
          if (transactionName) {
            event.tags = { transaction: transactionName, ...event.tags };
          }
        }
        this._applyFingerprint(event);
        event.breadcrumbs = [...event.breadcrumbs || [], ...this._breadcrumbs];
        event.breadcrumbs = event.breadcrumbs.length > 0 ? event.breadcrumbs : void 0;
        event.sdkProcessingMetadata = { ...event.sdkProcessingMetadata, ...this._sdkProcessingMetadata };
        return this._notifyEventProcessors([...getGlobalEventProcessors(), ...this._eventProcessors], event, hint);
      }
      setSDKProcessingMetadata(newData) {
        this._sdkProcessingMetadata = { ...this._sdkProcessingMetadata, ...newData };
        return this;
      }
      _notifyEventProcessors(processors, event, hint, index2 = 0) {
        return new SyncPromise((resolve2, reject) => {
          const processor = processors[index2];
          if (event === null || typeof processor !== "function") {
            resolve2(event);
          } else {
            const result = processor({ ...event }, hint);
            (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && processor.id && result === null && logger.log(`Event processor "${processor.id}" dropped event`);
            if (isThenable(result)) {
              void result.then((final) => this._notifyEventProcessors(processors, final, hint, index2 + 1).then(resolve2)).then(null, reject);
            } else {
              void this._notifyEventProcessors(processors, result, hint, index2 + 1).then(resolve2).then(null, reject);
            }
          }
        });
      }
      _notifyScopeListeners() {
        if (!this._notifyingListeners) {
          this._notifyingListeners = true;
          this._scopeListeners.forEach((callback) => {
            callback(this);
          });
          this._notifyingListeners = false;
        }
      }
      _applyFingerprint(event) {
        event.fingerprint = event.fingerprint ? arrayify(event.fingerprint) : [];
        if (this._fingerprint) {
          event.fingerprint = event.fingerprint.concat(this._fingerprint);
        }
        if (event.fingerprint && !event.fingerprint.length) {
          delete event.fingerprint;
        }
      }
    }
    function getGlobalEventProcessors() {
      return getGlobalSingleton$1("globalEventProcessors", () => []);
    }
    function addGlobalEventProcessor(callback) {
      getGlobalEventProcessors().push(callback);
    }
    const NIL_EVENT_ID = "00000000000000000000000000000000";
    const API_VERSION = 4;
    const DEFAULT_BREADCRUMBS = 100;
    class Hub {
      __init() {
        this._stack = [{}];
      }
      constructor(client, scope = new Scope(), _version = API_VERSION) {
        this._version = _version;
        Hub.prototype.__init.call(this);
        this.getStackTop().scope = scope;
        if (client) {
          this.bindClient(client);
        }
      }
      isOlderThan(version2) {
        return this._version < version2;
      }
      bindClient(client) {
        const top = this.getStackTop();
        top.client = client;
        if (client && client.setupIntegrations) {
          client.setupIntegrations();
        }
      }
      pushScope() {
        const scope = Scope.clone(this.getScope());
        this.getStack().push({
          client: this.getClient(),
          scope
        });
        return scope;
      }
      popScope() {
        if (this.getStack().length <= 1)
          return false;
        return !!this.getStack().pop();
      }
      withScope(callback) {
        const scope = this.pushScope();
        try {
          callback(scope);
        } finally {
          this.popScope();
        }
      }
      getClient() {
        return this.getStackTop().client;
      }
      getScope() {
        return this.getStackTop().scope;
      }
      getStack() {
        return this._stack;
      }
      getStackTop() {
        return this._stack[this._stack.length - 1];
      }
      captureException(exception, hint) {
        const syntheticException = new Error("Sentry syntheticException");
        this._lastEventId = this._withClient((client, scope) => {
          return client.captureException(
            exception,
            {
              originalException: exception,
              syntheticException,
              ...hint
            },
            scope
          );
        }) || NIL_EVENT_ID;
        return this._lastEventId;
      }
      captureMessage(message, level, hint) {
        const syntheticException = new Error(message);
        this._lastEventId = this._withClient((client, scope) => {
          return client.captureMessage(
            message,
            level,
            {
              originalException: message,
              syntheticException,
              ...hint
            },
            scope
          );
        }) || NIL_EVENT_ID;
        return this._lastEventId;
      }
      captureEvent(event, hint) {
        const clientId = this._withClient((client, scope) => {
          return client.captureEvent(event, { ...hint }, scope);
        }) || NIL_EVENT_ID;
        if (event.type !== "transaction") {
          this._lastEventId = clientId;
        }
        return clientId;
      }
      lastEventId() {
        return this._lastEventId;
      }
      addBreadcrumb(breadcrumb, hint) {
        const { scope, client } = this.getStackTop();
        if (!scope || !client)
          return;
        const { beforeBreadcrumb = null, maxBreadcrumbs = DEFAULT_BREADCRUMBS } = client.getOptions && client.getOptions() || {};
        if (maxBreadcrumbs <= 0)
          return;
        const timestamp = dateTimestampInSeconds();
        const mergedBreadcrumb = { timestamp, ...breadcrumb };
        const finalBreadcrumb = beforeBreadcrumb ? consoleSandbox$1(() => beforeBreadcrumb(mergedBreadcrumb, hint)) : mergedBreadcrumb;
        if (finalBreadcrumb === null)
          return;
        scope.addBreadcrumb(finalBreadcrumb, maxBreadcrumbs);
      }
      setUser(user) {
        const scope = this.getScope();
        if (scope)
          scope.setUser(user);
      }
      setTags(tags) {
        const scope = this.getScope();
        if (scope)
          scope.setTags(tags);
      }
      setExtras(extras) {
        const scope = this.getScope();
        if (scope)
          scope.setExtras(extras);
      }
      setTag(key, value) {
        const scope = this.getScope();
        if (scope)
          scope.setTag(key, value);
      }
      setExtra(key, extra) {
        const scope = this.getScope();
        if (scope)
          scope.setExtra(key, extra);
      }
      setContext(name, context) {
        const scope = this.getScope();
        if (scope)
          scope.setContext(name, context);
      }
      configureScope(callback) {
        const { scope, client } = this.getStackTop();
        if (scope && client) {
          callback(scope);
        }
      }
      run(callback) {
        const oldHub = makeMain(this);
        try {
          callback(this);
        } finally {
          makeMain(oldHub);
        }
      }
      getIntegration(integration) {
        const client = this.getClient();
        if (!client)
          return null;
        try {
          return client.getIntegration(integration);
        } catch (_oO) {
          (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.warn(`Cannot retrieve integration ${integration.id} from the current Hub`);
          return null;
        }
      }
      startTransaction(context, customSamplingContext) {
        return this._callExtensionMethod("startTransaction", context, customSamplingContext);
      }
      traceHeaders() {
        return this._callExtensionMethod("traceHeaders");
      }
      captureSession(endSession = false) {
        if (endSession) {
          return this.endSession();
        }
        this._sendSessionUpdate();
      }
      endSession() {
        const layer = this.getStackTop();
        const scope = layer && layer.scope;
        const session = scope && scope.getSession();
        if (session) {
          closeSession(session);
        }
        this._sendSessionUpdate();
        if (scope) {
          scope.setSession();
        }
      }
      startSession(context) {
        const { scope, client } = this.getStackTop();
        const { release, environment } = client && client.getOptions() || {};
        const { userAgent } = GLOBAL_OBJ$1.navigator || {};
        const session = makeSession({
          release,
          environment,
          ...scope && { user: scope.getUser() },
          ...userAgent && { userAgent },
          ...context
        });
        if (scope) {
          const currentSession = scope.getSession && scope.getSession();
          if (currentSession && currentSession.status === "ok") {
            updateSession(currentSession, { status: "exited" });
          }
          this.endSession();
          scope.setSession(session);
        }
        return session;
      }
      shouldSendDefaultPii() {
        const client = this.getClient();
        const options = client && client.getOptions();
        return Boolean(options && options.sendDefaultPii);
      }
      _sendSessionUpdate() {
        const { scope, client } = this.getStackTop();
        if (!scope)
          return;
        const session = scope.getSession();
        if (session) {
          if (client && client.captureSession) {
            client.captureSession(session);
          }
        }
      }
      _withClient(callback) {
        const { scope, client } = this.getStackTop();
        return client && callback(client, scope);
      }
      _callExtensionMethod(method, ...args) {
        const carrier = getMainCarrier();
        const sentry = carrier.__SENTRY__;
        if (sentry && sentry.extensions && typeof sentry.extensions[method] === "function") {
          return sentry.extensions[method].apply(this, args);
        }
        (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.warn(`Extension method ${method} couldn't be found, doing nothing.`);
      }
    }
    function getMainCarrier() {
      GLOBAL_OBJ$1.__SENTRY__ = GLOBAL_OBJ$1.__SENTRY__ || {
        extensions: {},
        hub: void 0
      };
      return GLOBAL_OBJ$1;
    }
    function makeMain(hub) {
      const registry = getMainCarrier();
      const oldHub = getHubFromCarrier(registry);
      setHubOnCarrier(registry, hub);
      return oldHub;
    }
    function getCurrentHub() {
      const registry = getMainCarrier();
      if (!hasHubOnCarrier(registry) || getHubFromCarrier(registry).isOlderThan(API_VERSION)) {
        setHubOnCarrier(registry, new Hub());
      }
      if (isNodeEnv()) {
        return getHubFromActiveDomain(registry);
      }
      return getHubFromCarrier(registry);
    }
    function getHubFromActiveDomain(registry) {
      try {
        const sentry = getMainCarrier().__SENTRY__;
        const activeDomain = sentry && sentry.extensions && sentry.extensions.domain && sentry.extensions.domain.active;
        if (!activeDomain) {
          return getHubFromCarrier(registry);
        }
        if (!hasHubOnCarrier(activeDomain) || getHubFromCarrier(activeDomain).isOlderThan(API_VERSION)) {
          const registryHubTopStack = getHubFromCarrier(registry).getStackTop();
          setHubOnCarrier(activeDomain, new Hub(registryHubTopStack.client, Scope.clone(registryHubTopStack.scope)));
        }
        return getHubFromCarrier(activeDomain);
      } catch (_Oo) {
        return getHubFromCarrier(registry);
      }
    }
    function hasHubOnCarrier(carrier) {
      return !!(carrier && carrier.__SENTRY__ && carrier.__SENTRY__.hub);
    }
    function getHubFromCarrier(carrier) {
      return getGlobalSingleton$1("hub", () => new Hub(), carrier);
    }
    function setHubOnCarrier(carrier, hub) {
      if (!carrier)
        return false;
      const __SENTRY__ = carrier.__SENTRY__ = carrier.__SENTRY__ || {};
      __SENTRY__.hub = hub;
      return true;
    }
    function captureException(exception, captureContext) {
      return getCurrentHub().captureException(exception, { captureContext });
    }
    function withScope(callback) {
      getCurrentHub().withScope(callback);
    }
    const SENTRY_API_VERSION = "7";
    function getBaseApiEndpoint(dsn) {
      const protocol = dsn.protocol ? `${dsn.protocol}:` : "";
      const port = dsn.port ? `:${dsn.port}` : "";
      return `${protocol}//${dsn.host}${port}${dsn.path ? `/${dsn.path}` : ""}/api/`;
    }
    function _getIngestEndpoint(dsn) {
      return `${getBaseApiEndpoint(dsn)}${dsn.projectId}/envelope/`;
    }
    function _encodedAuth(dsn, sdkInfo) {
      return urlEncode({
        sentry_key: dsn.publicKey,
        sentry_version: SENTRY_API_VERSION,
        ...sdkInfo && { sentry_client: `${sdkInfo.name}/${sdkInfo.version}` }
      });
    }
    function getEnvelopeEndpointWithUrlEncodedAuth(dsn, tunnelOrOptions = {}) {
      const tunnel = typeof tunnelOrOptions === "string" ? tunnelOrOptions : tunnelOrOptions.tunnel;
      const sdkInfo = typeof tunnelOrOptions === "string" || !tunnelOrOptions._metadata ? void 0 : tunnelOrOptions._metadata.sdk;
      return tunnel ? tunnel : `${_getIngestEndpoint(dsn)}?${_encodedAuth(dsn, sdkInfo)}`;
    }
    function getSdkMetadataForEnvelopeHeader(metadata) {
      if (!metadata || !metadata.sdk) {
        return;
      }
      const { name, version: version2 } = metadata.sdk;
      return { name, version: version2 };
    }
    function enhanceEventWithSdkInfo(event, sdkInfo) {
      if (!sdkInfo) {
        return event;
      }
      event.sdk = event.sdk || {};
      event.sdk.name = event.sdk.name || sdkInfo.name;
      event.sdk.version = event.sdk.version || sdkInfo.version;
      event.sdk.integrations = [...event.sdk.integrations || [], ...sdkInfo.integrations || []];
      event.sdk.packages = [...event.sdk.packages || [], ...sdkInfo.packages || []];
      return event;
    }
    function createSessionEnvelope(session, dsn, metadata, tunnel) {
      const sdkInfo = getSdkMetadataForEnvelopeHeader(metadata);
      const envelopeHeaders = {
        sent_at: new Date().toISOString(),
        ...sdkInfo && { sdk: sdkInfo },
        ...!!tunnel && { dsn: dsnToString(dsn) }
      };
      const envelopeItem = "aggregates" in session ? [{ type: "sessions" }, session] : [{ type: "session" }, session];
      return createEnvelope(envelopeHeaders, [envelopeItem]);
    }
    function createEventEnvelope(event, dsn, metadata, tunnel) {
      const sdkInfo = getSdkMetadataForEnvelopeHeader(metadata);
      const eventType = event.type || "event";
      enhanceEventWithSdkInfo(event, metadata && metadata.sdk);
      const envelopeHeaders = createEventEnvelopeHeaders(event, sdkInfo, tunnel, dsn);
      delete event.sdkProcessingMetadata;
      const eventItem = [{ type: eventType }, event];
      return createEnvelope(envelopeHeaders, [eventItem]);
    }
    function createEventEnvelopeHeaders(event, sdkInfo, tunnel, dsn) {
      const dynamicSamplingContext = event.sdkProcessingMetadata && event.sdkProcessingMetadata.dynamicSamplingContext;
      return {
        event_id: event.event_id,
        sent_at: new Date().toISOString(),
        ...sdkInfo && { sdk: sdkInfo },
        ...!!tunnel && { dsn: dsnToString(dsn) },
        ...event.type === "transaction" && dynamicSamplingContext && {
          trace: dropUndefinedKeys({ ...dynamicSamplingContext })
        }
      };
    }
    const installedIntegrations = [];
    function filterDuplicates(integrations) {
      const integrationsByName = {};
      integrations.forEach((currentInstance2) => {
        const { name } = currentInstance2;
        const existingInstance = integrationsByName[name];
        if (existingInstance && !existingInstance.isDefaultInstance && currentInstance2.isDefaultInstance) {
          return;
        }
        integrationsByName[name] = currentInstance2;
      });
      return Object.values(integrationsByName);
    }
    function getIntegrationsToSetup(options) {
      const defaultIntegrations2 = options.defaultIntegrations || [];
      const userIntegrations = options.integrations;
      defaultIntegrations2.forEach((integration) => {
        integration.isDefaultInstance = true;
      });
      let integrations;
      if (Array.isArray(userIntegrations)) {
        integrations = [...defaultIntegrations2, ...userIntegrations];
      } else if (typeof userIntegrations === "function") {
        integrations = arrayify(userIntegrations(defaultIntegrations2));
      } else {
        integrations = defaultIntegrations2;
      }
      const finalIntegrations = filterDuplicates(integrations);
      const debugIndex = finalIntegrations.findIndex((integration) => integration.name === "Debug");
      if (debugIndex !== -1) {
        const [debugInstance] = finalIntegrations.splice(debugIndex, 1);
        finalIntegrations.push(debugInstance);
      }
      return finalIntegrations;
    }
    function setupIntegrations(integrations) {
      const integrationIndex = {};
      integrations.forEach((integration) => {
        integrationIndex[integration.name] = integration;
        if (installedIntegrations.indexOf(integration.name) === -1) {
          integration.setupOnce(addGlobalEventProcessor, getCurrentHub);
          installedIntegrations.push(integration.name);
          (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.log(`Integration installed: ${integration.name}`);
        }
      });
      return integrationIndex;
    }
    const ALREADY_SEEN_ERROR = "Not capturing exception because it's already been captured.";
    class BaseClient {
      __init() {
        this._integrations = {};
      }
      __init2() {
        this._integrationsInitialized = false;
      }
      __init3() {
        this._numProcessing = 0;
      }
      __init4() {
        this._outcomes = {};
      }
      constructor(options) {
        BaseClient.prototype.__init.call(this);
        BaseClient.prototype.__init2.call(this);
        BaseClient.prototype.__init3.call(this);
        BaseClient.prototype.__init4.call(this);
        this._options = options;
        if (options.dsn) {
          this._dsn = makeDsn(options.dsn);
          const url = getEnvelopeEndpointWithUrlEncodedAuth(this._dsn, options);
          this._transport = options.transport({
            recordDroppedEvent: this.recordDroppedEvent.bind(this),
            ...options.transportOptions,
            url
          });
        } else {
          (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.warn("No DSN provided, client will not do anything.");
        }
      }
      captureException(exception, hint, scope) {
        if (checkOrSetAlreadyCaught(exception)) {
          (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.log(ALREADY_SEEN_ERROR);
          return;
        }
        let eventId;
        this._process(
          this.eventFromException(exception, hint).then((event) => this._captureEvent(event, hint, scope)).then((result) => {
            eventId = result;
          })
        );
        return eventId;
      }
      captureMessage(message, level, hint, scope) {
        let eventId;
        const promisedEvent = isPrimitive(message) ? this.eventFromMessage(String(message), level, hint) : this.eventFromException(message, hint);
        this._process(
          promisedEvent.then((event) => this._captureEvent(event, hint, scope)).then((result) => {
            eventId = result;
          })
        );
        return eventId;
      }
      captureEvent(event, hint, scope) {
        if (hint && hint.originalException && checkOrSetAlreadyCaught(hint.originalException)) {
          (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.log(ALREADY_SEEN_ERROR);
          return;
        }
        let eventId;
        this._process(
          this._captureEvent(event, hint, scope).then((result) => {
            eventId = result;
          })
        );
        return eventId;
      }
      captureSession(session) {
        if (!this._isEnabled()) {
          (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.warn("SDK not enabled, will not capture session.");
          return;
        }
        if (!(typeof session.release === "string")) {
          (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.warn("Discarded session because of missing or non-string release");
        } else {
          this.sendSession(session);
          updateSession(session, { init: false });
        }
      }
      getDsn() {
        return this._dsn;
      }
      getOptions() {
        return this._options;
      }
      getTransport() {
        return this._transport;
      }
      flush(timeout) {
        const transport = this._transport;
        if (transport) {
          return this._isClientDoneProcessing(timeout).then((clientFinished) => {
            return transport.flush(timeout).then((transportFlushed) => clientFinished && transportFlushed);
          });
        } else {
          return resolvedSyncPromise(true);
        }
      }
      close(timeout) {
        return this.flush(timeout).then((result) => {
          this.getOptions().enabled = false;
          return result;
        });
      }
      setupIntegrations() {
        if (this._isEnabled() && !this._integrationsInitialized) {
          this._integrations = setupIntegrations(this._options.integrations);
          this._integrationsInitialized = true;
        }
      }
      getIntegrationById(integrationId) {
        return this._integrations[integrationId];
      }
      getIntegration(integration) {
        try {
          return this._integrations[integration.id] || null;
        } catch (_oO) {
          (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.warn(`Cannot retrieve integration ${integration.id} from the current Client`);
          return null;
        }
      }
      sendEvent(event, hint = {}) {
        if (this._dsn) {
          let env = createEventEnvelope(event, this._dsn, this._options._metadata, this._options.tunnel);
          for (const attachment of hint.attachments || []) {
            env = addItemToEnvelope(
              env,
              createAttachmentEnvelopeItem(
                attachment,
                this._options.transportOptions && this._options.transportOptions.textEncoder
              )
            );
          }
          this._sendEnvelope(env);
        }
      }
      sendSession(session) {
        if (this._dsn) {
          const env = createSessionEnvelope(session, this._dsn, this._options._metadata, this._options.tunnel);
          this._sendEnvelope(env);
        }
      }
      recordDroppedEvent(reason, category, _event) {
        if (this._options.sendClientReports) {
          const key = `${reason}:${category}`;
          (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.log(`Adding outcome: "${key}"`);
          this._outcomes[key] = this._outcomes[key] + 1 || 1;
        }
      }
      _updateSessionFromEvent(session, event) {
        let crashed = false;
        let errored = false;
        const exceptions = event.exception && event.exception.values;
        if (exceptions) {
          errored = true;
          for (const ex of exceptions) {
            const mechanism = ex.mechanism;
            if (mechanism && mechanism.handled === false) {
              crashed = true;
              break;
            }
          }
        }
        const sessionNonTerminal = session.status === "ok";
        const shouldUpdateAndSend = sessionNonTerminal && session.errors === 0 || sessionNonTerminal && crashed;
        if (shouldUpdateAndSend) {
          updateSession(session, {
            ...crashed && { status: "crashed" },
            errors: session.errors || Number(errored || crashed)
          });
          this.captureSession(session);
        }
      }
      _isClientDoneProcessing(timeout) {
        return new SyncPromise((resolve2) => {
          let ticked = 0;
          const tick = 1;
          const interval = setInterval(() => {
            if (this._numProcessing == 0) {
              clearInterval(interval);
              resolve2(true);
            } else {
              ticked += tick;
              if (timeout && ticked >= timeout) {
                clearInterval(interval);
                resolve2(false);
              }
            }
          }, tick);
        });
      }
      _isEnabled() {
        return this.getOptions().enabled !== false && this._dsn !== void 0;
      }
      _prepareEvent(event, hint, scope) {
        const { normalizeDepth = 3, normalizeMaxBreadth = 1e3 } = this.getOptions();
        const prepared = {
          ...event,
          event_id: event.event_id || hint.event_id || uuid4(),
          timestamp: event.timestamp || dateTimestampInSeconds()
        };
        this._applyClientOptions(prepared);
        this._applyIntegrationsMetadata(prepared);
        let finalScope = scope;
        if (hint.captureContext) {
          finalScope = Scope.clone(finalScope).update(hint.captureContext);
        }
        let result = resolvedSyncPromise(prepared);
        if (finalScope && finalScope.getAttachments) {
          const attachments = [...hint.attachments || [], ...finalScope.getAttachments()];
          if (attachments.length) {
            hint.attachments = attachments;
          }
          result = finalScope.applyToEvent(prepared, hint);
        }
        return result.then((evt) => {
          if (typeof normalizeDepth === "number" && normalizeDepth > 0) {
            return this._normalizeEvent(evt, normalizeDepth, normalizeMaxBreadth);
          }
          return evt;
        });
      }
      _normalizeEvent(event, depth, maxBreadth) {
        if (!event) {
          return null;
        }
        const normalized = {
          ...event,
          ...event.breadcrumbs && {
            breadcrumbs: event.breadcrumbs.map((b) => ({
              ...b,
              ...b.data && {
                data: normalize(b.data, depth, maxBreadth)
              }
            }))
          },
          ...event.user && {
            user: normalize(event.user, depth, maxBreadth)
          },
          ...event.contexts && {
            contexts: normalize(event.contexts, depth, maxBreadth)
          },
          ...event.extra && {
            extra: normalize(event.extra, depth, maxBreadth)
          }
        };
        if (event.contexts && event.contexts.trace && normalized.contexts) {
          normalized.contexts.trace = event.contexts.trace;
          if (event.contexts.trace.data) {
            normalized.contexts.trace.data = normalize(event.contexts.trace.data, depth, maxBreadth);
          }
        }
        if (event.spans) {
          normalized.spans = event.spans.map((span) => {
            if (span.data) {
              span.data = normalize(span.data, depth, maxBreadth);
            }
            return span;
          });
        }
        return normalized;
      }
      _applyClientOptions(event) {
        const options = this.getOptions();
        const { environment, release, dist, maxValueLength = 250 } = options;
        if (!("environment" in event)) {
          event.environment = "environment" in options ? environment : "production";
        }
        if (event.release === void 0 && release !== void 0) {
          event.release = release;
        }
        if (event.dist === void 0 && dist !== void 0) {
          event.dist = dist;
        }
        if (event.message) {
          event.message = truncate(event.message, maxValueLength);
        }
        const exception = event.exception && event.exception.values && event.exception.values[0];
        if (exception && exception.value) {
          exception.value = truncate(exception.value, maxValueLength);
        }
        const request = event.request;
        if (request && request.url) {
          request.url = truncate(request.url, maxValueLength);
        }
      }
      _applyIntegrationsMetadata(event) {
        const integrationsArray = Object.keys(this._integrations);
        if (integrationsArray.length > 0) {
          event.sdk = event.sdk || {};
          event.sdk.integrations = [...event.sdk.integrations || [], ...integrationsArray];
        }
      }
      _captureEvent(event, hint = {}, scope) {
        return this._processEvent(event, hint, scope).then(
          (finalEvent) => {
            return finalEvent.event_id;
          },
          (reason) => {
            if (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) {
              const sentryError = reason;
              if (sentryError.logLevel === "log") {
                logger.log(sentryError.message);
              } else {
                logger.warn(sentryError);
              }
            }
            return void 0;
          }
        );
      }
      _processEvent(event, hint, scope) {
        const options = this.getOptions();
        const { sampleRate } = options;
        if (!this._isEnabled()) {
          return rejectedSyncPromise(new SentryError("SDK not enabled, will not capture event.", "log"));
        }
        const isTransaction = event.type === "transaction";
        const beforeSendProcessorName = isTransaction ? "beforeSendTransaction" : "beforeSend";
        const beforeSendProcessor = options[beforeSendProcessorName];
        if (!isTransaction && typeof sampleRate === "number" && Math.random() > sampleRate) {
          this.recordDroppedEvent("sample_rate", "error", event);
          return rejectedSyncPromise(
            new SentryError(
              `Discarding event because it's not included in the random sample (sampling rate = ${sampleRate})`,
              "log"
            )
          );
        }
        return this._prepareEvent(event, hint, scope).then((prepared) => {
          if (prepared === null) {
            this.recordDroppedEvent("event_processor", event.type || "error", event);
            throw new SentryError("An event processor returned `null`, will not send event.", "log");
          }
          const isInternalException = hint.data && hint.data.__sentry__ === true;
          if (isInternalException || !beforeSendProcessor) {
            return prepared;
          }
          const beforeSendResult = beforeSendProcessor(prepared, hint);
          return _validateBeforeSendResult(beforeSendResult, beforeSendProcessorName);
        }).then((processedEvent) => {
          if (processedEvent === null) {
            this.recordDroppedEvent("before_send", event.type || "error", event);
            throw new SentryError(`\`${beforeSendProcessorName}\` returned \`null\`, will not send event.`, "log");
          }
          const session = scope && scope.getSession();
          if (!isTransaction && session) {
            this._updateSessionFromEvent(session, processedEvent);
          }
          const transactionInfo = processedEvent.transaction_info;
          if (isTransaction && transactionInfo && processedEvent.transaction !== event.transaction) {
            const source = "custom";
            processedEvent.transaction_info = {
              ...transactionInfo,
              source,
              changes: [
                ...transactionInfo.changes,
                {
                  source,
                  timestamp: processedEvent.timestamp,
                  propagations: transactionInfo.propagations
                }
              ]
            };
          }
          this.sendEvent(processedEvent, hint);
          return processedEvent;
        }).then(null, (reason) => {
          if (reason instanceof SentryError) {
            throw reason;
          }
          this.captureException(reason, {
            data: {
              __sentry__: true
            },
            originalException: reason
          });
          throw new SentryError(
            `Event processing pipeline threw an error, original event will not be sent. Details have been sent as a new event.
Reason: ${reason}`
          );
        });
      }
      _process(promise) {
        this._numProcessing++;
        void promise.then(
          (value) => {
            this._numProcessing--;
            return value;
          },
          (reason) => {
            this._numProcessing--;
            return reason;
          }
        );
      }
      _sendEnvelope(envelope) {
        if (this._transport && this._dsn) {
          this._transport.send(envelope).then(null, (reason) => {
            (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.error("Error while sending event:", reason);
          });
        } else {
          (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.error("Transport disabled");
        }
      }
      _clearOutcomes() {
        const outcomes = this._outcomes;
        this._outcomes = {};
        return Object.keys(outcomes).map((key) => {
          const [reason, category] = key.split(":");
          return {
            reason,
            category,
            quantity: outcomes[key]
          };
        });
      }
    }
    function _validateBeforeSendResult(beforeSendResult, beforeSendProcessorName) {
      const invalidValueError = `\`${beforeSendProcessorName}\` must return \`null\` or a valid event.`;
      if (isThenable(beforeSendResult)) {
        return beforeSendResult.then(
          (event) => {
            if (!isPlainObject(event) && event !== null) {
              throw new SentryError(invalidValueError);
            }
            return event;
          },
          (e) => {
            throw new SentryError(`\`${beforeSendProcessorName}\` rejected with ${e}`);
          }
        );
      } else if (!isPlainObject(beforeSendResult) && beforeSendResult !== null) {
        throw new SentryError(invalidValueError);
      }
      return beforeSendResult;
    }
    function initAndBind(clientClass, options) {
      if (options.debug === true) {
        if (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) {
          logger.enable();
        } else {
          console.warn("[Sentry] Cannot initialize SDK with `debug` option using a non-debug bundle.");
        }
      }
      const hub = getCurrentHub();
      const scope = hub.getScope();
      if (scope) {
        scope.update(options.initialScope);
      }
      const client = new clientClass(options);
      hub.bindClient(client);
    }
    const DEFAULT_TRANSPORT_BUFFER_SIZE = 30;
    function createTransport(options, makeRequest, buffer = makePromiseBuffer(options.bufferSize || DEFAULT_TRANSPORT_BUFFER_SIZE)) {
      let rateLimits = {};
      const flush = (timeout) => buffer.drain(timeout);
      function send(envelope) {
        const filteredEnvelopeItems = [];
        forEachEnvelopeItem(envelope, (item, type) => {
          const envelopeItemDataCategory = envelopeItemTypeToDataCategory(type);
          if (isRateLimited(rateLimits, envelopeItemDataCategory)) {
            const event = getEventForEnvelopeItem(item, type);
            options.recordDroppedEvent("ratelimit_backoff", envelopeItemDataCategory, event);
          } else {
            filteredEnvelopeItems.push(item);
          }
        });
        if (filteredEnvelopeItems.length === 0) {
          return resolvedSyncPromise();
        }
        const filteredEnvelope = createEnvelope(envelope[0], filteredEnvelopeItems);
        const recordEnvelopeLoss = (reason) => {
          forEachEnvelopeItem(filteredEnvelope, (item, type) => {
            const event = getEventForEnvelopeItem(item, type);
            options.recordDroppedEvent(reason, envelopeItemTypeToDataCategory(type), event);
          });
        };
        const requestTask = () => makeRequest({ body: serializeEnvelope(filteredEnvelope, options.textEncoder) }).then(
          (response) => {
            if (response.statusCode !== void 0 && (response.statusCode < 200 || response.statusCode >= 300)) {
              (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.warn(`Sentry responded with status code ${response.statusCode} to sent event.`);
            }
            rateLimits = updateRateLimits(rateLimits, response);
          },
          (error) => {
            (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.error("Failed while sending event:", error);
            recordEnvelopeLoss("network_error");
          }
        );
        return buffer.add(requestTask).then(
          (result) => result,
          (error) => {
            if (error instanceof SentryError) {
              (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.error("Skipped sending event because buffer is full.");
              recordEnvelopeLoss("queue_overflow");
              return resolvedSyncPromise();
            } else {
              throw error;
            }
          }
        );
      }
      return {
        send,
        flush
      };
    }
    function getEventForEnvelopeItem(item, type) {
      if (type !== "event" && type !== "transaction") {
        return void 0;
      }
      return Array.isArray(item) ? item[1] : void 0;
    }
    const SDK_VERSION = "7.23.0";
    let originalFunctionToString;
    class FunctionToString {
      constructor() {
        FunctionToString.prototype.__init.call(this);
      }
      static __initStatic() {
        this.id = "FunctionToString";
      }
      __init() {
        this.name = FunctionToString.id;
      }
      setupOnce() {
        originalFunctionToString = Function.prototype.toString;
        Function.prototype.toString = function(...args) {
          const context = getOriginalFunction(this) || this;
          return originalFunctionToString.apply(context, args);
        };
      }
    }
    FunctionToString.__initStatic();
    const DEFAULT_IGNORE_ERRORS = [/^Script error\.?$/, /^Javascript error: Script error\.? on line 0$/];
    class InboundFilters {
      static __initStatic() {
        this.id = "InboundFilters";
      }
      __init() {
        this.name = InboundFilters.id;
      }
      constructor(_options = {}) {
        this._options = _options;
        InboundFilters.prototype.__init.call(this);
      }
      setupOnce(addGlobalEventProcessor2, getCurrentHub2) {
        const eventProcess = (event) => {
          const hub = getCurrentHub2();
          if (hub) {
            const self2 = hub.getIntegration(InboundFilters);
            if (self2) {
              const client = hub.getClient();
              const clientOptions = client ? client.getOptions() : {};
              const options = _mergeOptions(self2._options, clientOptions);
              return _shouldDropEvent$1(event, options) ? null : event;
            }
          }
          return event;
        };
        eventProcess.id = this.name;
        addGlobalEventProcessor2(eventProcess);
      }
    }
    InboundFilters.__initStatic();
    function _mergeOptions(internalOptions = {}, clientOptions = {}) {
      return {
        allowUrls: [...internalOptions.allowUrls || [], ...clientOptions.allowUrls || []],
        denyUrls: [...internalOptions.denyUrls || [], ...clientOptions.denyUrls || []],
        ignoreErrors: [
          ...internalOptions.ignoreErrors || [],
          ...clientOptions.ignoreErrors || [],
          ...DEFAULT_IGNORE_ERRORS
        ],
        ignoreInternal: internalOptions.ignoreInternal !== void 0 ? internalOptions.ignoreInternal : true
      };
    }
    function _shouldDropEvent$1(event, options) {
      if (options.ignoreInternal && _isSentryError(event)) {
        (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.warn(`Event dropped due to being internal Sentry Error.
Event: ${getEventDescription(event)}`);
        return true;
      }
      if (_isIgnoredError(event, options.ignoreErrors)) {
        (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.warn(
          `Event dropped due to being matched by \`ignoreErrors\` option.
Event: ${getEventDescription(event)}`
        );
        return true;
      }
      if (_isDeniedUrl(event, options.denyUrls)) {
        (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.warn(
          `Event dropped due to being matched by \`denyUrls\` option.
Event: ${getEventDescription(
            event
          )}.
Url: ${_getEventFilterUrl(event)}`
        );
        return true;
      }
      if (!_isAllowedUrl(event, options.allowUrls)) {
        (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.warn(
          `Event dropped due to not being matched by \`allowUrls\` option.
Event: ${getEventDescription(
            event
          )}.
Url: ${_getEventFilterUrl(event)}`
        );
        return true;
      }
      return false;
    }
    function _isIgnoredError(event, ignoreErrors) {
      if (!ignoreErrors || !ignoreErrors.length) {
        return false;
      }
      return _getPossibleEventMessages(event).some((message) => stringMatchesSomePattern(message, ignoreErrors));
    }
    function _isDeniedUrl(event, denyUrls) {
      if (!denyUrls || !denyUrls.length) {
        return false;
      }
      const url = _getEventFilterUrl(event);
      return !url ? false : stringMatchesSomePattern(url, denyUrls);
    }
    function _isAllowedUrl(event, allowUrls) {
      if (!allowUrls || !allowUrls.length) {
        return true;
      }
      const url = _getEventFilterUrl(event);
      return !url ? true : stringMatchesSomePattern(url, allowUrls);
    }
    function _getPossibleEventMessages(event) {
      if (event.message) {
        return [event.message];
      }
      if (event.exception) {
        try {
          const { type = "", value = "" } = event.exception.values && event.exception.values[0] || {};
          return [`${value}`, `${type}: ${value}`];
        } catch (oO) {
          (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.error(`Cannot extract message for event ${getEventDescription(event)}`);
          return [];
        }
      }
      return [];
    }
    function _isSentryError(event) {
      try {
        return event.exception.values[0].type === "SentryError";
      } catch (e) {
      }
      return false;
    }
    function _getLastValidUrl(frames = []) {
      for (let i = frames.length - 1; i >= 0; i--) {
        const frame = frames[i];
        if (frame && frame.filename !== "<anonymous>" && frame.filename !== "[native code]") {
          return frame.filename || null;
        }
      }
      return null;
    }
    function _getEventFilterUrl(event) {
      try {
        let frames;
        try {
          frames = event.exception.values[0].stacktrace.frames;
        } catch (e) {
        }
        return frames ? _getLastValidUrl(frames) : null;
      } catch (oO) {
        (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.error(`Cannot extract url for event ${getEventDescription(event)}`);
        return null;
      }
    }
    const WINDOW$1 = GLOBAL_OBJ$1;
    let ignoreOnError = 0;
    function shouldIgnoreOnError() {
      return ignoreOnError > 0;
    }
    function ignoreNextOnError() {
      ignoreOnError++;
      setTimeout(() => {
        ignoreOnError--;
      });
    }
    function wrap(fn, options = {}, before) {
      if (typeof fn !== "function") {
        return fn;
      }
      try {
        const wrapper = fn.__sentry_wrapped__;
        if (wrapper) {
          return wrapper;
        }
        if (getOriginalFunction(fn)) {
          return fn;
        }
      } catch (e) {
        return fn;
      }
      const sentryWrapped = function() {
        const args = Array.prototype.slice.call(arguments);
        try {
          if (before && typeof before === "function") {
            before.apply(this, arguments);
          }
          const wrappedArguments = args.map((arg) => wrap(arg, options));
          return fn.apply(this, wrappedArguments);
        } catch (ex) {
          ignoreNextOnError();
          withScope((scope) => {
            scope.addEventProcessor((event) => {
              if (options.mechanism) {
                addExceptionTypeValue(event, void 0, void 0);
                addExceptionMechanism(event, options.mechanism);
              }
              event.extra = {
                ...event.extra,
                arguments: args
              };
              return event;
            });
            captureException(ex);
          });
          throw ex;
        }
      };
      try {
        for (const property in fn) {
          if (Object.prototype.hasOwnProperty.call(fn, property)) {
            sentryWrapped[property] = fn[property];
          }
        }
      } catch (_oO) {
      }
      markFunctionWrapped$1(sentryWrapped, fn);
      addNonEnumerableProperty$1(fn, "__sentry_wrapped__", sentryWrapped);
      try {
        const descriptor = Object.getOwnPropertyDescriptor(sentryWrapped, "name");
        if (descriptor.configurable) {
          Object.defineProperty(sentryWrapped, "name", {
            get() {
              return fn.name;
            }
          });
        }
      } catch (_oO) {
      }
      return sentryWrapped;
    }
    function exceptionFromError(stackParser, ex) {
      const frames = parseStackFrames(stackParser, ex);
      const exception = {
        type: ex && ex.name,
        value: extractMessage(ex)
      };
      if (frames.length) {
        exception.stacktrace = { frames };
      }
      if (exception.type === void 0 && exception.value === "") {
        exception.value = "Unrecoverable error caught";
      }
      return exception;
    }
    function eventFromPlainObject(stackParser, exception, syntheticException, isUnhandledRejection) {
      const hub = getCurrentHub();
      const client = hub.getClient();
      const normalizeDepth = client && client.getOptions().normalizeDepth;
      const event = {
        exception: {
          values: [
            {
              type: isEvent(exception) ? exception.constructor.name : isUnhandledRejection ? "UnhandledRejection" : "Error",
              value: `Non-Error ${isUnhandledRejection ? "promise rejection" : "exception"} captured with keys: ${extractExceptionKeysForMessage(exception)}`
            }
          ]
        },
        extra: {
          __serialized__: normalizeToSize(exception, normalizeDepth)
        }
      };
      if (syntheticException) {
        const frames = parseStackFrames(stackParser, syntheticException);
        if (frames.length) {
          event.exception.values[0].stacktrace = { frames };
        }
      }
      return event;
    }
    function eventFromError(stackParser, ex) {
      return {
        exception: {
          values: [exceptionFromError(stackParser, ex)]
        }
      };
    }
    function parseStackFrames(stackParser, ex) {
      const stacktrace = ex.stacktrace || ex.stack || "";
      const popSize = getPopSize(ex);
      try {
        return stackParser(stacktrace, popSize);
      } catch (e) {
      }
      return [];
    }
    const reactMinifiedRegexp = /Minified React error #\d+;/i;
    function getPopSize(ex) {
      if (ex) {
        if (typeof ex.framesToPop === "number") {
          return ex.framesToPop;
        }
        if (reactMinifiedRegexp.test(ex.message)) {
          return 1;
        }
      }
      return 0;
    }
    function extractMessage(ex) {
      const message = ex && ex.message;
      if (!message) {
        return "No error message";
      }
      if (message.error && typeof message.error.message === "string") {
        return message.error.message;
      }
      return message;
    }
    function eventFromException(stackParser, exception, hint, attachStacktrace) {
      const syntheticException = hint && hint.syntheticException || void 0;
      const event = eventFromUnknownInput(stackParser, exception, syntheticException, attachStacktrace);
      addExceptionMechanism(event);
      event.level = "error";
      if (hint && hint.event_id) {
        event.event_id = hint.event_id;
      }
      return resolvedSyncPromise(event);
    }
    function eventFromMessage(stackParser, message, level = "info", hint, attachStacktrace) {
      const syntheticException = hint && hint.syntheticException || void 0;
      const event = eventFromString(stackParser, message, syntheticException, attachStacktrace);
      event.level = level;
      if (hint && hint.event_id) {
        event.event_id = hint.event_id;
      }
      return resolvedSyncPromise(event);
    }
    function eventFromUnknownInput(stackParser, exception, syntheticException, attachStacktrace, isUnhandledRejection) {
      let event;
      if (isErrorEvent(exception) && exception.error) {
        const errorEvent = exception;
        return eventFromError(stackParser, errorEvent.error);
      }
      if (isDOMError(exception) || isDOMException(exception)) {
        const domException = exception;
        if ("stack" in exception) {
          event = eventFromError(stackParser, exception);
        } else {
          const name = domException.name || (isDOMError(domException) ? "DOMError" : "DOMException");
          const message = domException.message ? `${name}: ${domException.message}` : name;
          event = eventFromString(stackParser, message, syntheticException, attachStacktrace);
          addExceptionTypeValue(event, message);
        }
        if ("code" in domException) {
          event.tags = { ...event.tags, "DOMException.code": `${domException.code}` };
        }
        return event;
      }
      if (isError(exception)) {
        return eventFromError(stackParser, exception);
      }
      if (isPlainObject(exception) || isEvent(exception)) {
        const objectException = exception;
        event = eventFromPlainObject(stackParser, objectException, syntheticException, isUnhandledRejection);
        addExceptionMechanism(event, {
          synthetic: true
        });
        return event;
      }
      event = eventFromString(stackParser, exception, syntheticException, attachStacktrace);
      addExceptionTypeValue(event, `${exception}`, void 0);
      addExceptionMechanism(event, {
        synthetic: true
      });
      return event;
    }
    function eventFromString(stackParser, input, syntheticException, attachStacktrace) {
      const event = {
        message: input
      };
      if (attachStacktrace && syntheticException) {
        const frames = parseStackFrames(stackParser, syntheticException);
        if (frames.length) {
          event.exception = {
            values: [{ value: input, stacktrace: { frames } }]
          };
        }
      }
      return event;
    }
    const BREADCRUMB_INTEGRATION_ID = "Breadcrumbs";
    class Breadcrumbs {
      static __initStatic() {
        this.id = BREADCRUMB_INTEGRATION_ID;
      }
      __init() {
        this.name = Breadcrumbs.id;
      }
      constructor(options) {
        Breadcrumbs.prototype.__init.call(this);
        this.options = {
          console: true,
          dom: true,
          fetch: true,
          history: true,
          sentry: true,
          xhr: true,
          ...options
        };
      }
      setupOnce() {
        if (this.options.console) {
          addInstrumentationHandler("console", _consoleBreadcrumb);
        }
        if (this.options.dom) {
          addInstrumentationHandler("dom", _domBreadcrumb(this.options.dom));
        }
        if (this.options.xhr) {
          addInstrumentationHandler("xhr", _xhrBreadcrumb);
        }
        if (this.options.fetch) {
          addInstrumentationHandler("fetch", _fetchBreadcrumb);
        }
        if (this.options.history) {
          addInstrumentationHandler("history", _historyBreadcrumb);
        }
      }
      addSentryBreadcrumb(event) {
        if (this.options.sentry) {
          getCurrentHub().addBreadcrumb(
            {
              category: `sentry.${event.type === "transaction" ? "transaction" : "event"}`,
              event_id: event.event_id,
              level: event.level,
              message: getEventDescription(event)
            },
            {
              event
            }
          );
        }
      }
    }
    Breadcrumbs.__initStatic();
    function _domBreadcrumb(dom) {
      function _innerDomBreadcrumb(handlerData) {
        let target;
        let keyAttrs = typeof dom === "object" ? dom.serializeAttribute : void 0;
        if (typeof keyAttrs === "string") {
          keyAttrs = [keyAttrs];
        }
        try {
          target = handlerData.event.target ? htmlTreeAsString(handlerData.event.target, keyAttrs) : htmlTreeAsString(handlerData.event, keyAttrs);
        } catch (e) {
          target = "<unknown>";
        }
        if (target.length === 0) {
          return;
        }
        getCurrentHub().addBreadcrumb(
          {
            category: `ui.${handlerData.name}`,
            message: target
          },
          {
            event: handlerData.event,
            name: handlerData.name,
            global: handlerData.global
          }
        );
      }
      return _innerDomBreadcrumb;
    }
    function _consoleBreadcrumb(handlerData) {
      for (let i = 0; i < handlerData.args.length; i++) {
        if (handlerData.args[i] === "ref=Ref<") {
          handlerData.args[i + 1] = "viewRef";
          break;
        }
      }
      const breadcrumb = {
        category: "console",
        data: {
          arguments: handlerData.args,
          logger: "console"
        },
        level: severityLevelFromString$1(handlerData.level),
        message: safeJoin$1(handlerData.args, " ")
      };
      if (handlerData.level === "assert") {
        if (handlerData.args[0] === false) {
          breadcrumb.message = `Assertion failed: ${safeJoin$1(handlerData.args.slice(1), " ") || "console.assert"}`;
          breadcrumb.data.arguments = handlerData.args.slice(1);
        } else {
          return;
        }
      }
      getCurrentHub().addBreadcrumb(breadcrumb, {
        input: handlerData.args,
        level: handlerData.level
      });
    }
    function _xhrBreadcrumb(handlerData) {
      if (handlerData.endTimestamp) {
        if (handlerData.xhr.__sentry_own_request__) {
          return;
        }
        const { method, url, status_code, body } = handlerData.xhr.__sentry_xhr__ || {};
        getCurrentHub().addBreadcrumb(
          {
            category: "xhr",
            data: {
              method,
              url,
              status_code
            },
            type: "http"
          },
          {
            xhr: handlerData.xhr,
            input: body
          }
        );
        return;
      }
    }
    function _fetchBreadcrumb(handlerData) {
      if (!handlerData.endTimestamp) {
        return;
      }
      if (handlerData.fetchData.url.match(/sentry_key/) && handlerData.fetchData.method === "POST") {
        return;
      }
      if (handlerData.error) {
        getCurrentHub().addBreadcrumb(
          {
            category: "fetch",
            data: handlerData.fetchData,
            level: "error",
            type: "http"
          },
          {
            data: handlerData.error,
            input: handlerData.args
          }
        );
      } else {
        getCurrentHub().addBreadcrumb(
          {
            category: "fetch",
            data: {
              ...handlerData.fetchData,
              status_code: handlerData.response.status
            },
            type: "http"
          },
          {
            input: handlerData.args,
            response: handlerData.response
          }
        );
      }
    }
    function _historyBreadcrumb(handlerData) {
      let from = handlerData.from;
      let to = handlerData.to;
      const parsedLoc = parseUrl(WINDOW$1.location.href);
      let parsedFrom = parseUrl(from);
      const parsedTo = parseUrl(to);
      if (!parsedFrom.path) {
        parsedFrom = parsedLoc;
      }
      if (parsedLoc.protocol === parsedTo.protocol && parsedLoc.host === parsedTo.host) {
        to = parsedTo.relative;
      }
      if (parsedLoc.protocol === parsedFrom.protocol && parsedLoc.host === parsedFrom.host) {
        from = parsedFrom.relative;
      }
      getCurrentHub().addBreadcrumb({
        category: "navigation",
        data: {
          from,
          to
        }
      });
    }
    class BrowserClient extends BaseClient {
      constructor(options) {
        options._metadata = options._metadata || {};
        options._metadata.sdk = options._metadata.sdk || {
          name: "sentry.javascript.browser",
          packages: [
            {
              name: "npm:@sentry/browser",
              version: SDK_VERSION
            }
          ],
          version: SDK_VERSION
        };
        super(options);
        if (options.sendClientReports && WINDOW$1.document) {
          WINDOW$1.document.addEventListener("visibilitychange", () => {
            if (WINDOW$1.document.visibilityState === "hidden") {
              this._flushOutcomes();
            }
          });
        }
      }
      eventFromException(exception, hint) {
        return eventFromException(this._options.stackParser, exception, hint, this._options.attachStacktrace);
      }
      eventFromMessage(message, level = "info", hint) {
        return eventFromMessage(this._options.stackParser, message, level, hint, this._options.attachStacktrace);
      }
      sendEvent(event, hint) {
        const breadcrumbIntegration = this.getIntegrationById(BREADCRUMB_INTEGRATION_ID);
        _optionalChain([breadcrumbIntegration, "optionalAccess", (_) => _.addSentryBreadcrumb, "optionalCall", (_2) => _2(event)]);
        super.sendEvent(event, hint);
      }
      _prepareEvent(event, hint, scope) {
        event.platform = event.platform || "javascript";
        return super._prepareEvent(event, hint, scope);
      }
      _flushOutcomes() {
        const outcomes = this._clearOutcomes();
        if (outcomes.length === 0) {
          (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.log("No outcomes to send");
          return;
        }
        if (!this._dsn) {
          (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.log("No dsn provided, will not send outcomes");
          return;
        }
        (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.log("Sending outcomes:", outcomes);
        const url = getEnvelopeEndpointWithUrlEncodedAuth(this._dsn, this._options);
        const envelope = createClientReportEnvelope(outcomes, this._options.tunnel && dsnToString(this._dsn));
        try {
          const isRealNavigator = Object.prototype.toString.call(WINDOW$1 && WINDOW$1.navigator) === "[object Navigator]";
          const hasSendBeacon = isRealNavigator && typeof WINDOW$1.navigator.sendBeacon === "function";
          if (hasSendBeacon && !this._options.transportOptions) {
            const sendBeacon = WINDOW$1.navigator.sendBeacon.bind(WINDOW$1.navigator);
            sendBeacon(url, serializeEnvelope(envelope));
          } else {
            this._sendEnvelope(envelope);
          }
        } catch (e) {
          (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.error(e);
        }
      }
    }
    let cachedFetchImpl = void 0;
    function getNativeFetchImplementation() {
      if (cachedFetchImpl) {
        return cachedFetchImpl;
      }
      if (isNativeFetch(WINDOW$1.fetch)) {
        return cachedFetchImpl = WINDOW$1.fetch.bind(WINDOW$1);
      }
      const document2 = WINDOW$1.document;
      let fetchImpl = WINDOW$1.fetch;
      if (document2 && typeof document2.createElement === "function") {
        try {
          const sandbox = document2.createElement("iframe");
          sandbox.hidden = true;
          document2.head.appendChild(sandbox);
          const contentWindow = sandbox.contentWindow;
          if (contentWindow && contentWindow.fetch) {
            fetchImpl = contentWindow.fetch;
          }
          document2.head.removeChild(sandbox);
        } catch (e) {
          (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.warn("Could not create sandbox iframe for pure fetch check, bailing to window.fetch: ", e);
        }
      }
      return cachedFetchImpl = fetchImpl.bind(WINDOW$1);
    }
    function clearCachedFetchImplementation() {
      cachedFetchImpl = void 0;
    }
    function makeFetchTransport(options, nativeFetch = getNativeFetchImplementation()) {
      function makeRequest(request) {
        const requestOptions = {
          body: request.body,
          method: "POST",
          referrerPolicy: "origin",
          headers: options.headers,
          keepalive: request.body.length <= 65536,
          ...options.fetchOptions
        };
        try {
          return nativeFetch(options.url, requestOptions).then((response) => ({
            statusCode: response.status,
            headers: {
              "x-sentry-rate-limits": response.headers.get("X-Sentry-Rate-Limits"),
              "retry-after": response.headers.get("Retry-After")
            }
          }));
        } catch (e) {
          clearCachedFetchImplementation();
          return rejectedSyncPromise(e);
        }
      }
      return createTransport(options, makeRequest);
    }
    const XHR_READYSTATE_DONE = 4;
    function makeXHRTransport(options) {
      function makeRequest(request) {
        return new SyncPromise((resolve2, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onerror = reject;
          xhr.onreadystatechange = () => {
            if (xhr.readyState === XHR_READYSTATE_DONE) {
              resolve2({
                statusCode: xhr.status,
                headers: {
                  "x-sentry-rate-limits": xhr.getResponseHeader("X-Sentry-Rate-Limits"),
                  "retry-after": xhr.getResponseHeader("Retry-After")
                }
              });
            }
          };
          xhr.open("POST", options.url);
          for (const header in options.headers) {
            if (Object.prototype.hasOwnProperty.call(options.headers, header)) {
              xhr.setRequestHeader(header, options.headers[header]);
            }
          }
          xhr.send(request.body);
        });
      }
      return createTransport(options, makeRequest);
    }
    const UNKNOWN_FUNCTION = "?";
    const CHROME_PRIORITY = 30;
    const WINJS_PRIORITY = 40;
    const GECKO_PRIORITY = 50;
    function createFrame(filename, func, lineno, colno) {
      const frame = {
        filename,
        function: func,
        in_app: true
      };
      if (lineno !== void 0) {
        frame.lineno = lineno;
      }
      if (colno !== void 0) {
        frame.colno = colno;
      }
      return frame;
    }
    const chromeRegex = /^\s*at (?:(.*\).*?|.*?) ?\((?:address at )?)?((?:file|https?|blob|chrome-extension|address|native|eval|webpack|<anonymous>|[-a-z]+:|.*bundle|\/)?.*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i;
    const chromeEvalRegex = /\((\S*)(?::(\d+))(?::(\d+))\)/;
    const chrome = (line) => {
      const parts = chromeRegex.exec(line);
      if (parts) {
        const isEval = parts[2] && parts[2].indexOf("eval") === 0;
        if (isEval) {
          const subMatch = chromeEvalRegex.exec(parts[2]);
          if (subMatch) {
            parts[2] = subMatch[1];
            parts[3] = subMatch[2];
            parts[4] = subMatch[3];
          }
        }
        const [func, filename] = extractSafariExtensionDetails(parts[1] || UNKNOWN_FUNCTION, parts[2]);
        return createFrame(filename, func, parts[3] ? +parts[3] : void 0, parts[4] ? +parts[4] : void 0);
      }
      return;
    };
    const chromeStackLineParser = [CHROME_PRIORITY, chrome];
    const geckoREgex = /^\s*(.*?)(?:\((.*?)\))?(?:^|@)?((?:file|https?|blob|chrome|webpack|resource|moz-extension|safari-extension|safari-web-extension|capacitor)?:\/.*?|\[native code\]|[^@]*(?:bundle|\d+\.js)|\/[\w\-. /=]+)(?::(\d+))?(?::(\d+))?\s*$/i;
    const geckoEvalRegex = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i;
    const gecko = (line) => {
      const parts = geckoREgex.exec(line);
      if (parts) {
        const isEval = parts[3] && parts[3].indexOf(" > eval") > -1;
        if (isEval) {
          const subMatch = geckoEvalRegex.exec(parts[3]);
          if (subMatch) {
            parts[1] = parts[1] || "eval";
            parts[3] = subMatch[1];
            parts[4] = subMatch[2];
            parts[5] = "";
          }
        }
        let filename = parts[3];
        let func = parts[1] || UNKNOWN_FUNCTION;
        [func, filename] = extractSafariExtensionDetails(func, filename);
        return createFrame(filename, func, parts[4] ? +parts[4] : void 0, parts[5] ? +parts[5] : void 0);
      }
      return;
    };
    const geckoStackLineParser = [GECKO_PRIORITY, gecko];
    const winjsRegex = /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:file|ms-appx|https?|webpack|blob):.*?):(\d+)(?::(\d+))?\)?\s*$/i;
    const winjs = (line) => {
      const parts = winjsRegex.exec(line);
      return parts ? createFrame(parts[2], parts[1] || UNKNOWN_FUNCTION, +parts[3], parts[4] ? +parts[4] : void 0) : void 0;
    };
    const winjsStackLineParser = [WINJS_PRIORITY, winjs];
    const defaultStackLineParsers = [chromeStackLineParser, geckoStackLineParser, winjsStackLineParser];
    const defaultStackParser = createStackParser(...defaultStackLineParsers);
    const extractSafariExtensionDetails = (func, filename) => {
      const isSafariExtension = func.indexOf("safari-extension") !== -1;
      const isSafariWebExtension = func.indexOf("safari-web-extension") !== -1;
      return isSafariExtension || isSafariWebExtension ? [
        func.indexOf("@") !== -1 ? func.split("@")[0] : UNKNOWN_FUNCTION,
        isSafariExtension ? `safari-extension:${filename}` : `safari-web-extension:${filename}`
      ] : [func, filename];
    };
    class GlobalHandlers {
      static __initStatic() {
        this.id = "GlobalHandlers";
      }
      __init() {
        this.name = GlobalHandlers.id;
      }
      __init2() {
        this._installFunc = {
          onerror: _installGlobalOnErrorHandler,
          onunhandledrejection: _installGlobalOnUnhandledRejectionHandler
        };
      }
      constructor(options) {
        GlobalHandlers.prototype.__init.call(this);
        GlobalHandlers.prototype.__init2.call(this);
        this._options = {
          onerror: true,
          onunhandledrejection: true,
          ...options
        };
      }
      setupOnce() {
        Error.stackTraceLimit = 50;
        const options = this._options;
        for (const key in options) {
          const installFunc = this._installFunc[key];
          if (installFunc && options[key]) {
            globalHandlerLog(key);
            installFunc();
            this._installFunc[key] = void 0;
          }
        }
      }
    }
    GlobalHandlers.__initStatic();
    function _installGlobalOnErrorHandler() {
      addInstrumentationHandler(
        "error",
        (data) => {
          const [hub, stackParser, attachStacktrace] = getHubAndOptions();
          if (!hub.getIntegration(GlobalHandlers)) {
            return;
          }
          const { msg, url, line, column, error } = data;
          if (shouldIgnoreOnError() || error && error.__sentry_own_request__) {
            return;
          }
          const event = error === void 0 && isString(msg) ? _eventFromIncompleteOnError(msg, url, line, column) : _enhanceEventWithInitialFrame(
            eventFromUnknownInput(stackParser, error || msg, void 0, attachStacktrace, false),
            url,
            line,
            column
          );
          event.level = "error";
          addMechanismAndCapture(hub, error, event, "onerror");
        }
      );
    }
    function _installGlobalOnUnhandledRejectionHandler() {
      addInstrumentationHandler(
        "unhandledrejection",
        (e) => {
          const [hub, stackParser, attachStacktrace] = getHubAndOptions();
          if (!hub.getIntegration(GlobalHandlers)) {
            return;
          }
          let error = e;
          try {
            if ("reason" in e) {
              error = e.reason;
            } else if ("detail" in e && "reason" in e.detail) {
              error = e.detail.reason;
            }
          } catch (_oO) {
          }
          if (shouldIgnoreOnError() || error && error.__sentry_own_request__) {
            return true;
          }
          const event = isPrimitive(error) ? _eventFromRejectionWithPrimitive(error) : eventFromUnknownInput(stackParser, error, void 0, attachStacktrace, true);
          event.level = "error";
          addMechanismAndCapture(hub, error, event, "onunhandledrejection");
          return;
        }
      );
    }
    function _eventFromRejectionWithPrimitive(reason) {
      return {
        exception: {
          values: [
            {
              type: "UnhandledRejection",
              value: `Non-Error promise rejection captured with value: ${String(reason)}`
            }
          ]
        }
      };
    }
    function _eventFromIncompleteOnError(msg, url, line, column) {
      const ERROR_TYPES_RE = /^(?:[Uu]ncaught (?:exception: )?)?(?:((?:Eval|Internal|Range|Reference|Syntax|Type|URI|)Error): )?(.*)$/i;
      let message = isErrorEvent(msg) ? msg.message : msg;
      let name = "Error";
      const groups = message.match(ERROR_TYPES_RE);
      if (groups) {
        name = groups[1];
        message = groups[2];
      }
      const event = {
        exception: {
          values: [
            {
              type: name,
              value: message
            }
          ]
        }
      };
      return _enhanceEventWithInitialFrame(event, url, line, column);
    }
    function _enhanceEventWithInitialFrame(event, url, line, column) {
      const e = event.exception = event.exception || {};
      const ev = e.values = e.values || [];
      const ev0 = ev[0] = ev[0] || {};
      const ev0s = ev0.stacktrace = ev0.stacktrace || {};
      const ev0sf = ev0s.frames = ev0s.frames || [];
      const colno = isNaN(parseInt(column, 10)) ? void 0 : column;
      const lineno = isNaN(parseInt(line, 10)) ? void 0 : line;
      const filename = isString(url) && url.length > 0 ? url : getLocationHref();
      if (ev0sf.length === 0) {
        ev0sf.push({
          colno,
          filename,
          function: "?",
          in_app: true,
          lineno
        });
      }
      return event;
    }
    function globalHandlerLog(type) {
      (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.log(`Global Handler attached: ${type}`);
    }
    function addMechanismAndCapture(hub, error, event, type) {
      addExceptionMechanism(event, {
        handled: false,
        type
      });
      hub.captureEvent(event, {
        originalException: error
      });
    }
    function getHubAndOptions() {
      const hub = getCurrentHub();
      const client = hub.getClient();
      const options = client && client.getOptions() || {
        stackParser: () => [],
        attachStacktrace: false
      };
      return [hub, options.stackParser, options.attachStacktrace];
    }
    const DEFAULT_EVENT_TARGET = [
      "EventTarget",
      "Window",
      "Node",
      "ApplicationCache",
      "AudioTrackList",
      "ChannelMergerNode",
      "CryptoOperation",
      "EventSource",
      "FileReader",
      "HTMLUnknownElement",
      "IDBDatabase",
      "IDBRequest",
      "IDBTransaction",
      "KeyOperation",
      "MediaController",
      "MessagePort",
      "ModalWindow",
      "Notification",
      "SVGElementInstance",
      "Screen",
      "TextTrack",
      "TextTrackCue",
      "TextTrackList",
      "WebSocket",
      "WebSocketWorker",
      "Worker",
      "XMLHttpRequest",
      "XMLHttpRequestEventTarget",
      "XMLHttpRequestUpload"
    ];
    class TryCatch {
      static __initStatic() {
        this.id = "TryCatch";
      }
      __init() {
        this.name = TryCatch.id;
      }
      constructor(options) {
        TryCatch.prototype.__init.call(this);
        this._options = {
          XMLHttpRequest: true,
          eventTarget: true,
          requestAnimationFrame: true,
          setInterval: true,
          setTimeout: true,
          ...options
        };
      }
      setupOnce() {
        if (this._options.setTimeout) {
          fill$1(WINDOW$1, "setTimeout", _wrapTimeFunction);
        }
        if (this._options.setInterval) {
          fill$1(WINDOW$1, "setInterval", _wrapTimeFunction);
        }
        if (this._options.requestAnimationFrame) {
          fill$1(WINDOW$1, "requestAnimationFrame", _wrapRAF);
        }
        if (this._options.XMLHttpRequest && "XMLHttpRequest" in WINDOW$1) {
          fill$1(XMLHttpRequest.prototype, "send", _wrapXHR);
        }
        const eventTargetOption = this._options.eventTarget;
        if (eventTargetOption) {
          const eventTarget = Array.isArray(eventTargetOption) ? eventTargetOption : DEFAULT_EVENT_TARGET;
          eventTarget.forEach(_wrapEventTarget);
        }
      }
    }
    TryCatch.__initStatic();
    function _wrapTimeFunction(original) {
      return function(...args) {
        const originalCallback = args[0];
        args[0] = wrap(originalCallback, {
          mechanism: {
            data: { function: getFunctionName(original) },
            handled: true,
            type: "instrument"
          }
        });
        return original.apply(this, args);
      };
    }
    function _wrapRAF(original) {
      return function(callback) {
        return original.apply(this, [
          wrap(callback, {
            mechanism: {
              data: {
                function: "requestAnimationFrame",
                handler: getFunctionName(original)
              },
              handled: true,
              type: "instrument"
            }
          })
        ]);
      };
    }
    function _wrapXHR(originalSend) {
      return function(...args) {
        const xhr = this;
        const xmlHttpRequestProps = ["onload", "onerror", "onprogress", "onreadystatechange"];
        xmlHttpRequestProps.forEach((prop) => {
          if (prop in xhr && typeof xhr[prop] === "function") {
            fill$1(xhr, prop, function(original) {
              const wrapOptions = {
                mechanism: {
                  data: {
                    function: prop,
                    handler: getFunctionName(original)
                  },
                  handled: true,
                  type: "instrument"
                }
              };
              const originalFunction = getOriginalFunction(original);
              if (originalFunction) {
                wrapOptions.mechanism.data.handler = getFunctionName(originalFunction);
              }
              return wrap(original, wrapOptions);
            });
          }
        });
        return originalSend.apply(this, args);
      };
    }
    function _wrapEventTarget(target) {
      const globalObject = WINDOW$1;
      const proto = globalObject[target] && globalObject[target].prototype;
      if (!proto || !proto.hasOwnProperty || !proto.hasOwnProperty("addEventListener")) {
        return;
      }
      fill$1(proto, "addEventListener", function(original) {
        return function(eventName, fn, options) {
          try {
            if (typeof fn.handleEvent === "function") {
              fn.handleEvent = wrap(fn.handleEvent, {
                mechanism: {
                  data: {
                    function: "handleEvent",
                    handler: getFunctionName(fn),
                    target
                  },
                  handled: true,
                  type: "instrument"
                }
              });
            }
          } catch (err) {
          }
          return original.apply(this, [
            eventName,
            wrap(fn, {
              mechanism: {
                data: {
                  function: "addEventListener",
                  handler: getFunctionName(fn),
                  target
                },
                handled: true,
                type: "instrument"
              }
            }),
            options
          ]);
        };
      });
      fill$1(
        proto,
        "removeEventListener",
        function(originalRemoveEventListener) {
          return function(eventName, fn, options) {
            const wrappedEventHandler = fn;
            try {
              const originalEventHandler = wrappedEventHandler && wrappedEventHandler.__sentry_wrapped__;
              if (originalEventHandler) {
                originalRemoveEventListener.call(this, eventName, originalEventHandler, options);
              }
            } catch (e) {
            }
            return originalRemoveEventListener.call(this, eventName, wrappedEventHandler, options);
          };
        }
      );
    }
    const DEFAULT_KEY = "cause";
    const DEFAULT_LIMIT = 5;
    class LinkedErrors {
      static __initStatic() {
        this.id = "LinkedErrors";
      }
      __init() {
        this.name = LinkedErrors.id;
      }
      constructor(options = {}) {
        LinkedErrors.prototype.__init.call(this);
        this._key = options.key || DEFAULT_KEY;
        this._limit = options.limit || DEFAULT_LIMIT;
      }
      setupOnce() {
        const client = getCurrentHub().getClient();
        if (!client) {
          return;
        }
        addGlobalEventProcessor((event, hint) => {
          const self2 = getCurrentHub().getIntegration(LinkedErrors);
          return self2 ? _handler(client.getOptions().stackParser, self2._key, self2._limit, event, hint) : event;
        });
      }
    }
    LinkedErrors.__initStatic();
    function _handler(parser, key, limit, event, hint) {
      if (!event.exception || !event.exception.values || !hint || !isInstanceOf(hint.originalException, Error)) {
        return event;
      }
      const linkedErrors = _walkErrorTree(parser, limit, hint.originalException, key);
      event.exception.values = [...linkedErrors, ...event.exception.values];
      return event;
    }
    function _walkErrorTree(parser, limit, error, key, stack = []) {
      if (!isInstanceOf(error[key], Error) || stack.length + 1 >= limit) {
        return stack;
      }
      const exception = exceptionFromError(parser, error[key]);
      return _walkErrorTree(parser, limit, error[key], key, [exception, ...stack]);
    }
    class HttpContext {
      constructor() {
        HttpContext.prototype.__init.call(this);
      }
      static __initStatic() {
        this.id = "HttpContext";
      }
      __init() {
        this.name = HttpContext.id;
      }
      setupOnce() {
        addGlobalEventProcessor((event) => {
          if (getCurrentHub().getIntegration(HttpContext)) {
            if (!WINDOW$1.navigator && !WINDOW$1.location && !WINDOW$1.document) {
              return event;
            }
            const url = event.request && event.request.url || WINDOW$1.location && WINDOW$1.location.href;
            const { referrer } = WINDOW$1.document || {};
            const { userAgent } = WINDOW$1.navigator || {};
            const headers = {
              ...event.request && event.request.headers,
              ...referrer && { Referer: referrer },
              ...userAgent && { "User-Agent": userAgent }
            };
            const request = { ...url && { url }, headers };
            return { ...event, request };
          }
          return event;
        });
      }
    }
    HttpContext.__initStatic();
    class Dedupe {
      constructor() {
        Dedupe.prototype.__init.call(this);
      }
      static __initStatic() {
        this.id = "Dedupe";
      }
      __init() {
        this.name = Dedupe.id;
      }
      setupOnce(addGlobalEventProcessor2, getCurrentHub2) {
        const eventProcessor = (currentEvent) => {
          const self2 = getCurrentHub2().getIntegration(Dedupe);
          if (self2) {
            try {
              if (_shouldDropEvent(currentEvent, self2._previousEvent)) {
                (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.warn("Event dropped due to being a duplicate of previously captured event.");
                return null;
              }
            } catch (_oO) {
              return self2._previousEvent = currentEvent;
            }
            return self2._previousEvent = currentEvent;
          }
          return currentEvent;
        };
        eventProcessor.id = this.name;
        addGlobalEventProcessor2(eventProcessor);
      }
    }
    Dedupe.__initStatic();
    function _shouldDropEvent(currentEvent, previousEvent) {
      if (!previousEvent) {
        return false;
      }
      if (_isSameMessageEvent(currentEvent, previousEvent)) {
        return true;
      }
      if (_isSameExceptionEvent(currentEvent, previousEvent)) {
        return true;
      }
      return false;
    }
    function _isSameMessageEvent(currentEvent, previousEvent) {
      const currentMessage = currentEvent.message;
      const previousMessage = previousEvent.message;
      if (!currentMessage && !previousMessage) {
        return false;
      }
      if (currentMessage && !previousMessage || !currentMessage && previousMessage) {
        return false;
      }
      if (currentMessage !== previousMessage) {
        return false;
      }
      if (!_isSameFingerprint(currentEvent, previousEvent)) {
        return false;
      }
      if (!_isSameStacktrace(currentEvent, previousEvent)) {
        return false;
      }
      return true;
    }
    function _isSameExceptionEvent(currentEvent, previousEvent) {
      const previousException = _getExceptionFromEvent(previousEvent);
      const currentException = _getExceptionFromEvent(currentEvent);
      if (!previousException || !currentException) {
        return false;
      }
      if (previousException.type !== currentException.type || previousException.value !== currentException.value) {
        return false;
      }
      if (!_isSameFingerprint(currentEvent, previousEvent)) {
        return false;
      }
      if (!_isSameStacktrace(currentEvent, previousEvent)) {
        return false;
      }
      return true;
    }
    function _isSameStacktrace(currentEvent, previousEvent) {
      let currentFrames = _getFramesFromEvent(currentEvent);
      let previousFrames = _getFramesFromEvent(previousEvent);
      if (!currentFrames && !previousFrames) {
        return true;
      }
      if (currentFrames && !previousFrames || !currentFrames && previousFrames) {
        return false;
      }
      currentFrames = currentFrames;
      previousFrames = previousFrames;
      if (previousFrames.length !== currentFrames.length) {
        return false;
      }
      for (let i = 0; i < previousFrames.length; i++) {
        const frameA = previousFrames[i];
        const frameB = currentFrames[i];
        if (frameA.filename !== frameB.filename || frameA.lineno !== frameB.lineno || frameA.colno !== frameB.colno || frameA.function !== frameB.function) {
          return false;
        }
      }
      return true;
    }
    function _isSameFingerprint(currentEvent, previousEvent) {
      let currentFingerprint = currentEvent.fingerprint;
      let previousFingerprint = previousEvent.fingerprint;
      if (!currentFingerprint && !previousFingerprint) {
        return true;
      }
      if (currentFingerprint && !previousFingerprint || !currentFingerprint && previousFingerprint) {
        return false;
      }
      currentFingerprint = currentFingerprint;
      previousFingerprint = previousFingerprint;
      try {
        return !!(currentFingerprint.join("") === previousFingerprint.join(""));
      } catch (_oO) {
        return false;
      }
    }
    function _getExceptionFromEvent(event) {
      return event.exception && event.exception.values && event.exception.values[0];
    }
    function _getFramesFromEvent(event) {
      const exception = event.exception;
      if (exception) {
        try {
          return exception.values[0].stacktrace.frames;
        } catch (_oO) {
          return void 0;
        }
      }
      return void 0;
    }
    const defaultIntegrations = [
      new InboundFilters(),
      new FunctionToString(),
      new TryCatch(),
      new Breadcrumbs(),
      new GlobalHandlers(),
      new LinkedErrors(),
      new Dedupe(),
      new HttpContext()
    ];
    function init$1(options = {}) {
      if (options.defaultIntegrations === void 0) {
        options.defaultIntegrations = defaultIntegrations;
      }
      if (options.release === void 0) {
        if (typeof __SENTRY_RELEASE__ === "string") {
          options.release = __SENTRY_RELEASE__;
        }
        if (WINDOW$1.SENTRY_RELEASE && WINDOW$1.SENTRY_RELEASE.id) {
          options.release = WINDOW$1.SENTRY_RELEASE.id;
        }
      }
      if (options.autoSessionTracking === void 0) {
        options.autoSessionTracking = true;
      }
      if (options.sendClientReports === void 0) {
        options.sendClientReports = true;
      }
      const clientOptions = {
        ...options,
        stackParser: stackParserFromStackParserOptions(options.stackParser || defaultStackParser),
        integrations: getIntegrationsToSetup(options),
        transport: options.transport || (supportsFetch() ? makeFetchTransport : makeXHRTransport)
      };
      initAndBind(BrowserClient, clientOptions);
      if (options.autoSessionTracking) {
        startSessionTracking();
      }
    }
    function startSessionOnHub(hub) {
      hub.startSession({ ignoreDuration: true });
      hub.captureSession();
    }
    function startSessionTracking() {
      if (typeof WINDOW$1.document === "undefined") {
        (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.warn("Session tracking in non-browser environment with @sentry/browser is not supported.");
        return;
      }
      const hub = getCurrentHub();
      if (!hub.captureSession) {
        return;
      }
      startSessionOnHub(hub);
      addInstrumentationHandler("history", ({ from, to }) => {
        if (!(from === void 0 || from === to)) {
          startSessionOnHub(getCurrentHub());
        }
      });
    }
    const DEFAULT_HOOKS = ["activate", "mount", "update"];
    const classifyRE = /(?:^|[-_])(\w)/g;
    const classify = (str) => str.replace(classifyRE, (c) => c.toUpperCase()).replace(/[-_]/g, "");
    const ROOT_COMPONENT_NAME = "<Root>";
    const ANONYMOUS_COMPONENT_NAME = "<Anonymous>";
    const repeat = (str, n) => {
      let res = "";
      while (n) {
        if (n % 2 === 1) {
          res += str;
        }
        if (n > 1) {
          str += str;
        }
        n >>= 1;
      }
      return res;
    };
    const formatComponentName = (vm, includeFile) => {
      if (!vm) {
        return ANONYMOUS_COMPONENT_NAME;
      }
      if (vm.$root === vm) {
        return ROOT_COMPONENT_NAME;
      }
      if (!vm.$options) {
        return ANONYMOUS_COMPONENT_NAME;
      }
      const options = vm.$options;
      let name = options.name || options._componentTag;
      const file = options.__file;
      if (!name && file) {
        const match = file.match(/([^/\\]+)\.vue$/);
        if (match) {
          name = match[1];
        }
      }
      return (name ? `<${classify(name)}>` : ANONYMOUS_COMPONENT_NAME) + (file && includeFile !== false ? ` at ${file}` : "");
    };
    const generateComponentTrace = (vm) => {
      if ((_optionalChain([vm, "optionalAccess", (_) => _._isVue]) || _optionalChain([vm, "optionalAccess", (_2) => _2.__isVue])) && _optionalChain([vm, "optionalAccess", (_3) => _3.$parent])) {
        const tree = [];
        let currentRecursiveSequence = 0;
        while (vm) {
          if (tree.length > 0) {
            const last = tree[tree.length - 1];
            if (last.constructor === vm.constructor) {
              currentRecursiveSequence++;
              vm = vm.$parent;
              continue;
            } else if (currentRecursiveSequence > 0) {
              tree[tree.length - 1] = [last, currentRecursiveSequence];
              currentRecursiveSequence = 0;
            }
          }
          tree.push(vm);
          vm = vm.$parent;
        }
        const formattedTree = tree.map(
          (vm2, i) => `${(i === 0 ? "---> " : repeat(" ", 5 + i * 2)) + (Array.isArray(vm2) ? `${formatComponentName(vm2[0])}... (${vm2[1]} recursive calls)` : formatComponentName(vm2))}`
        ).join("\n");
        return `

found in

${formattedTree}`;
      }
      return `

(found in ${formatComponentName(vm)})`;
    };
    const attachErrorHandler = (app2, options) => {
      const { errorHandler, warnHandler, silent } = app2.config;
      app2.config.errorHandler = (error, vm, lifecycleHook) => {
        const componentName = formatComponentName(vm, false);
        const trace = vm ? generateComponentTrace(vm) : "";
        const metadata = {
          componentName,
          lifecycleHook,
          trace
        };
        if (options.attachProps && vm) {
          if (vm.$options && vm.$options.propsData) {
            metadata.propsData = vm.$options.propsData;
          } else if (vm.$props) {
            metadata.propsData = vm.$props;
          }
        }
        setTimeout(() => {
          getCurrentHub().withScope((scope) => {
            scope.setContext("vue", metadata);
            getCurrentHub().captureException(error);
          });
        });
        if (typeof errorHandler === "function") {
          errorHandler.call(app2, error, vm, lifecycleHook);
        }
        if (options.logErrors) {
          const hasConsole = typeof console !== "undefined";
          const message = `Error in ${lifecycleHook}: "${error && error.toString()}"`;
          if (warnHandler) {
            warnHandler.call(null, message, vm, trace);
          } else if (hasConsole && !silent) {
            console.error(`[Vue warn]: ${message}${trace}`);
          }
        }
      };
    };
    const VUE_OP = "ui.vue";
    const HOOKS = {
      activate: ["activated", "deactivated"],
      create: ["beforeCreate", "created"],
      destroy: ["beforeDestroy", "destroyed"],
      mount: ["beforeMount", "mounted"],
      update: ["beforeUpdate", "updated"]
    };
    function getActiveTransaction$1() {
      return _optionalChain([getCurrentHub, "call", (_) => _(), "access", (_2) => _2.getScope, "call", (_3) => _3(), "optionalAccess", (_4) => _4.getTransaction, "call", (_5) => _5()]);
    }
    function finishRootSpan(vm, timestamp, timeout) {
      if (vm.$_sentryRootSpanTimer) {
        clearTimeout(vm.$_sentryRootSpanTimer);
      }
      vm.$_sentryRootSpanTimer = setTimeout(() => {
        if (_optionalChain([vm, "access", (_6) => _6.$root, "optionalAccess", (_7) => _7.$_sentryRootSpan])) {
          vm.$root.$_sentryRootSpan.finish(timestamp);
          vm.$root.$_sentryRootSpan = void 0;
        }
      }, timeout);
    }
    const createTracingMixins = (options) => {
      const hooks = (options.hooks || []).concat(DEFAULT_HOOKS).filter((value, index2, self2) => self2.indexOf(value) === index2);
      const mixins = {};
      for (const operation of hooks) {
        const internalHooks = HOOKS[operation];
        if (!internalHooks) {
          (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.warn(`Unknown hook: ${operation}`);
          continue;
        }
        for (const internalHook of internalHooks) {
          mixins[internalHook] = function() {
            const isRoot = this.$root === this;
            if (isRoot) {
              const activeTransaction = getActiveTransaction$1();
              if (activeTransaction) {
                this.$_sentryRootSpan = this.$_sentryRootSpan || activeTransaction.startChild({
                  description: "Application Render",
                  op: `${VUE_OP}.render`
                });
              }
            }
            const name = formatComponentName(this, false);
            const shouldTrack2 = Array.isArray(options.trackComponents) ? options.trackComponents.indexOf(name) > -1 : options.trackComponents;
            if (!isRoot && !shouldTrack2) {
              return;
            }
            this.$_sentrySpans = this.$_sentrySpans || {};
            if (internalHook == internalHooks[0]) {
              const activeTransaction = _optionalChain([this, "access", (_8) => _8.$root, "optionalAccess", (_9) => _9.$_sentryRootSpan]) || getActiveTransaction$1();
              if (activeTransaction) {
                const oldSpan = this.$_sentrySpans[operation];
                if (oldSpan && !oldSpan.endTimestamp) {
                  oldSpan.finish();
                }
                this.$_sentrySpans[operation] = activeTransaction.startChild({
                  description: `Vue <${name}>`,
                  op: `${VUE_OP}.${operation}`
                });
              }
            } else {
              const span = this.$_sentrySpans[operation];
              if (!span)
                return;
              span.finish();
              finishRootSpan(this, timestampInSeconds(), options.timeout);
            }
          };
        }
      }
      return mixins;
    };
    const globalWithVue = GLOBAL_OBJ$1;
    const DEFAULT_CONFIG = {
      Vue: globalWithVue.Vue,
      attachProps: true,
      logErrors: false,
      hooks: DEFAULT_HOOKS,
      timeout: 2e3,
      trackComponents: false,
      _metadata: {
        sdk: {
          name: "sentry.javascript.vue",
          packages: [
            {
              name: "npm:@sentry/vue",
              version: SDK_VERSION
            }
          ],
          version: SDK_VERSION
        }
      }
    };
    function init(config = {}) {
      const options = {
        ...DEFAULT_CONFIG,
        ...config
      };
      init$1(options);
      if (!options.Vue && !options.app) {
        console.warn(
          `[@sentry/vue]: Misconfigured SDK. Vue specific errors will not be captured.
Update your \`Sentry.init\` call with an appropriate config option:
\`app\` (Application Instance - Vue 3) or \`Vue\` (Vue Constructor - Vue 2).`
        );
        return;
      }
      if (options.app) {
        const apps = arrayify(options.app);
        apps.forEach((app2) => vueInit(app2, options));
      } else if (options.Vue) {
        vueInit(options.Vue, options);
      }
    }
    const vueInit = (app2, options) => {
      const appWithInstance = app2;
      const isMounted = appWithInstance._instance && appWithInstance._instance.isMounted;
      if (isMounted === true) {
        console.warn(
          "[@sentry/vue]: Misconfigured SDK. Vue app is already mounted. Make sure to call `app.mount()` after `Sentry.init()`."
        );
      }
      attachErrorHandler(app2, options);
      if ("tracesSampleRate" in options || "tracesSampler" in options) {
        app2.mixin(
          createTracingMixins({
            ...options,
            ...options.tracingOptions
          })
        );
      }
    };
    function hasTracingEnabled(maybeOptions) {
      const client = getCurrentHub().getClient();
      const options = maybeOptions || client && client.getOptions();
      return !!options && ("tracesSampleRate" in options || "tracesSampler" in options);
    }
    function getActiveTransaction(maybeHub) {
      const hub = maybeHub || getCurrentHub();
      const scope = hub.getScope();
      return scope && scope.getTransaction();
    }
    function msToSec(time) {
      return time / 1e3;
    }
    function registerErrorInstrumentation() {
      addInstrumentationHandler("error", errorCallback);
      addInstrumentationHandler("unhandledrejection", errorCallback);
    }
    function errorCallback() {
      const activeTransaction = getActiveTransaction();
      if (activeTransaction) {
        const status = "internal_error";
        (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.log(`[Tracing] Transaction: ${status} -> Global error occured`);
        activeTransaction.setStatus(status);
      }
    }
    class SpanRecorder {
      __init() {
        this.spans = [];
      }
      constructor(maxlen = 1e3) {
        SpanRecorder.prototype.__init.call(this);
        this._maxlen = maxlen;
      }
      add(span) {
        if (this.spans.length > this._maxlen) {
          span.spanRecorder = void 0;
        } else {
          this.spans.push(span);
        }
      }
    }
    class Span {
      __init2() {
        this.traceId = uuid4();
      }
      __init3() {
        this.spanId = uuid4().substring(16);
      }
      __init4() {
        this.startTimestamp = timestampWithMs();
      }
      __init5() {
        this.tags = {};
      }
      __init6() {
        this.data = {};
      }
      __init7() {
        this.instrumenter = "sentry";
      }
      constructor(spanContext) {
        Span.prototype.__init2.call(this);
        Span.prototype.__init3.call(this);
        Span.prototype.__init4.call(this);
        Span.prototype.__init5.call(this);
        Span.prototype.__init6.call(this);
        Span.prototype.__init7.call(this);
        if (!spanContext) {
          return this;
        }
        if (spanContext.traceId) {
          this.traceId = spanContext.traceId;
        }
        if (spanContext.spanId) {
          this.spanId = spanContext.spanId;
        }
        if (spanContext.parentSpanId) {
          this.parentSpanId = spanContext.parentSpanId;
        }
        if ("sampled" in spanContext) {
          this.sampled = spanContext.sampled;
        }
        if (spanContext.op) {
          this.op = spanContext.op;
        }
        if (spanContext.description) {
          this.description = spanContext.description;
        }
        if (spanContext.data) {
          this.data = spanContext.data;
        }
        if (spanContext.tags) {
          this.tags = spanContext.tags;
        }
        if (spanContext.status) {
          this.status = spanContext.status;
        }
        if (spanContext.startTimestamp) {
          this.startTimestamp = spanContext.startTimestamp;
        }
        if (spanContext.endTimestamp) {
          this.endTimestamp = spanContext.endTimestamp;
        }
        if (spanContext.instrumenter) {
          this.instrumenter = spanContext.instrumenter;
        }
      }
      startChild(spanContext) {
        const childSpan = new Span({
          ...spanContext,
          parentSpanId: this.spanId,
          sampled: this.sampled,
          traceId: this.traceId
        });
        childSpan.spanRecorder = this.spanRecorder;
        if (childSpan.spanRecorder) {
          childSpan.spanRecorder.add(childSpan);
        }
        childSpan.transaction = this.transaction;
        if ((typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && childSpan.transaction) {
          const opStr = spanContext && spanContext.op || "< unknown op >";
          const nameStr = childSpan.transaction.name || "< unknown name >";
          const idStr = childSpan.transaction.spanId;
          const logMessage = `[Tracing] Starting '${opStr}' span on transaction '${nameStr}' (${idStr}).`;
          childSpan.transaction.metadata.spanMetadata[childSpan.spanId] = { logMessage };
          logger.log(logMessage);
        }
        return childSpan;
      }
      setTag(key, value) {
        this.tags = { ...this.tags, [key]: value };
        return this;
      }
      setData(key, value) {
        this.data = { ...this.data, [key]: value };
        return this;
      }
      setStatus(value) {
        this.status = value;
        return this;
      }
      setHttpStatus(httpStatus) {
        this.setTag("http.status_code", String(httpStatus));
        const spanStatus = spanStatusfromHttpCode(httpStatus);
        if (spanStatus !== "unknown_error") {
          this.setStatus(spanStatus);
        }
        return this;
      }
      isSuccess() {
        return this.status === "ok";
      }
      finish(endTimestamp) {
        if ((typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && this.transaction && this.transaction.spanId !== this.spanId) {
          const { logMessage } = this.transaction.metadata.spanMetadata[this.spanId];
          if (logMessage) {
            logger.log(logMessage.replace("Starting", "Finishing"));
          }
        }
        this.endTimestamp = typeof endTimestamp === "number" ? endTimestamp : timestampWithMs();
      }
      toTraceparent() {
        let sampledString = "";
        if (this.sampled !== void 0) {
          sampledString = this.sampled ? "-1" : "-0";
        }
        return `${this.traceId}-${this.spanId}${sampledString}`;
      }
      toContext() {
        return dropUndefinedKeys({
          data: this.data,
          description: this.description,
          endTimestamp: this.endTimestamp,
          op: this.op,
          parentSpanId: this.parentSpanId,
          sampled: this.sampled,
          spanId: this.spanId,
          startTimestamp: this.startTimestamp,
          status: this.status,
          tags: this.tags,
          traceId: this.traceId
        });
      }
      updateWithContext(spanContext) {
        this.data = _nullishCoalesce(spanContext.data, () => ({}));
        this.description = spanContext.description;
        this.endTimestamp = spanContext.endTimestamp;
        this.op = spanContext.op;
        this.parentSpanId = spanContext.parentSpanId;
        this.sampled = spanContext.sampled;
        this.spanId = _nullishCoalesce(spanContext.spanId, () => this.spanId);
        this.startTimestamp = _nullishCoalesce(spanContext.startTimestamp, () => this.startTimestamp);
        this.status = spanContext.status;
        this.tags = _nullishCoalesce(spanContext.tags, () => ({}));
        this.traceId = _nullishCoalesce(spanContext.traceId, () => this.traceId);
        return this;
      }
      getTraceContext() {
        return dropUndefinedKeys({
          data: Object.keys(this.data).length > 0 ? this.data : void 0,
          description: this.description,
          op: this.op,
          parent_span_id: this.parentSpanId,
          span_id: this.spanId,
          status: this.status,
          tags: Object.keys(this.tags).length > 0 ? this.tags : void 0,
          trace_id: this.traceId
        });
      }
      toJSON() {
        return dropUndefinedKeys({
          data: Object.keys(this.data).length > 0 ? this.data : void 0,
          description: this.description,
          op: this.op,
          parent_span_id: this.parentSpanId,
          span_id: this.spanId,
          start_timestamp: this.startTimestamp,
          status: this.status,
          tags: Object.keys(this.tags).length > 0 ? this.tags : void 0,
          timestamp: this.endTimestamp,
          trace_id: this.traceId
        });
      }
    }
    function spanStatusfromHttpCode(httpStatus) {
      if (httpStatus < 400 && httpStatus >= 100) {
        return "ok";
      }
      if (httpStatus >= 400 && httpStatus < 500) {
        switch (httpStatus) {
          case 401:
            return "unauthenticated";
          case 403:
            return "permission_denied";
          case 404:
            return "not_found";
          case 409:
            return "already_exists";
          case 413:
            return "failed_precondition";
          case 429:
            return "resource_exhausted";
          default:
            return "invalid_argument";
        }
      }
      if (httpStatus >= 500 && httpStatus < 600) {
        switch (httpStatus) {
          case 501:
            return "unimplemented";
          case 503:
            return "unavailable";
          case 504:
            return "deadline_exceeded";
          default:
            return "internal_error";
        }
      }
      return "unknown_error";
    }
    class Transaction extends Span {
      __init() {
        this._measurements = {};
      }
      __init2() {
        this._contexts = {};
      }
      __init3() {
        this._frozenDynamicSamplingContext = void 0;
      }
      constructor(transactionContext, hub) {
        super(transactionContext);
        Transaction.prototype.__init.call(this);
        Transaction.prototype.__init2.call(this);
        Transaction.prototype.__init3.call(this);
        this._hub = hub || getCurrentHub();
        this._name = transactionContext.name || "";
        this.metadata = {
          source: "custom",
          ...transactionContext.metadata,
          spanMetadata: {},
          changes: [],
          propagations: 0
        };
        this._trimEnd = transactionContext.trimEnd;
        this.transaction = this;
        const incomingDynamicSamplingContext = this.metadata.dynamicSamplingContext;
        if (incomingDynamicSamplingContext) {
          this._frozenDynamicSamplingContext = { ...incomingDynamicSamplingContext };
        }
      }
      get name() {
        return this._name;
      }
      set name(newName) {
        this.setName(newName);
      }
      setName(name, source = "custom") {
        if (name !== this.name || source !== this.metadata.source) {
          this.metadata.changes.push({
            source: this.metadata.source,
            timestamp: timestampInSeconds(),
            propagations: this.metadata.propagations
          });
        }
        this._name = name;
        this.metadata.source = source;
      }
      initSpanRecorder(maxlen = 1e3) {
        if (!this.spanRecorder) {
          this.spanRecorder = new SpanRecorder(maxlen);
        }
        this.spanRecorder.add(this);
      }
      setContext(key, context) {
        if (context === null) {
          delete this._contexts[key];
        } else {
          this._contexts[key] = context;
        }
      }
      setMeasurement(name, value, unit = "") {
        this._measurements[name] = { value, unit };
      }
      setMetadata(newMetadata) {
        this.metadata = { ...this.metadata, ...newMetadata };
      }
      finish(endTimestamp) {
        if (this.endTimestamp !== void 0) {
          return void 0;
        }
        if (!this.name) {
          (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.warn("Transaction has no name, falling back to `<unlabeled transaction>`.");
          this.name = "<unlabeled transaction>";
        }
        super.finish(endTimestamp);
        if (this.sampled !== true) {
          (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.log("[Tracing] Discarding transaction because its trace was not chosen to be sampled.");
          const client = this._hub.getClient();
          if (client) {
            client.recordDroppedEvent("sample_rate", "transaction");
          }
          return void 0;
        }
        const finishedSpans = this.spanRecorder ? this.spanRecorder.spans.filter((s) => s !== this && s.endTimestamp) : [];
        if (this._trimEnd && finishedSpans.length > 0) {
          this.endTimestamp = finishedSpans.reduce((prev, current) => {
            if (prev.endTimestamp && current.endTimestamp) {
              return prev.endTimestamp > current.endTimestamp ? prev : current;
            }
            return prev;
          }).endTimestamp;
        }
        const metadata = this.metadata;
        const transaction = {
          contexts: {
            ...this._contexts,
            trace: this.getTraceContext()
          },
          spans: finishedSpans,
          start_timestamp: this.startTimestamp,
          tags: this.tags,
          timestamp: this.endTimestamp,
          transaction: this.name,
          type: "transaction",
          sdkProcessingMetadata: {
            ...metadata,
            dynamicSamplingContext: this.getDynamicSamplingContext()
          },
          ...metadata.source && {
            transaction_info: {
              source: metadata.source,
              changes: metadata.changes,
              propagations: metadata.propagations
            }
          }
        };
        const hasMeasurements = Object.keys(this._measurements).length > 0;
        if (hasMeasurements) {
          (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.log(
            "[Measurements] Adding measurements to transaction",
            JSON.stringify(this._measurements, void 0, 2)
          );
          transaction.measurements = this._measurements;
        }
        (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.log(`[Tracing] Finishing ${this.op} transaction: ${this.name}.`);
        return this._hub.captureEvent(transaction);
      }
      toContext() {
        const spanContext = super.toContext();
        return dropUndefinedKeys({
          ...spanContext,
          name: this.name,
          trimEnd: this._trimEnd
        });
      }
      updateWithContext(transactionContext) {
        super.updateWithContext(transactionContext);
        this.name = _nullishCoalesce(transactionContext.name, () => "");
        this._trimEnd = transactionContext.trimEnd;
        return this;
      }
      getDynamicSamplingContext() {
        if (this._frozenDynamicSamplingContext) {
          return this._frozenDynamicSamplingContext;
        }
        const hub = this._hub || getCurrentHub();
        const client = hub && hub.getClient();
        if (!client)
          return {};
        const { environment, release } = client.getOptions() || {};
        const { publicKey: public_key } = client.getDsn() || {};
        const maybeSampleRate = this.metadata.sampleRate;
        const sample_rate = maybeSampleRate !== void 0 ? maybeSampleRate.toString() : void 0;
        const scope = hub.getScope();
        const { segment: user_segment } = scope && scope.getUser() || {};
        const source = this.metadata.source;
        const transaction = source && source !== "url" ? this.name : void 0;
        const dsc = dropUndefinedKeys({
          environment,
          release,
          transaction,
          user_segment,
          public_key,
          trace_id: this.traceId,
          sample_rate
        });
        return dsc;
      }
    }
    const DEFAULT_IDLE_TIMEOUT = 1e3;
    const DEFAULT_FINAL_TIMEOUT = 3e4;
    const DEFAULT_HEARTBEAT_INTERVAL = 5e3;
    class IdleTransactionSpanRecorder extends SpanRecorder {
      constructor(_pushActivity, _popActivity, transactionSpanId, maxlen) {
        super(maxlen);
        this._pushActivity = _pushActivity;
        this._popActivity = _popActivity;
        this.transactionSpanId = transactionSpanId;
      }
      add(span) {
        if (span.spanId !== this.transactionSpanId) {
          span.finish = (endTimestamp) => {
            span.endTimestamp = typeof endTimestamp === "number" ? endTimestamp : timestampWithMs();
            this._popActivity(span.spanId);
          };
          if (span.endTimestamp === void 0) {
            this._pushActivity(span.spanId);
          }
        }
        super.add(span);
      }
    }
    class IdleTransaction extends Transaction {
      __init() {
        this.activities = {};
      }
      __init2() {
        this._heartbeatCounter = 0;
      }
      __init3() {
        this._finished = false;
      }
      __init4() {
        this._beforeFinishCallbacks = [];
      }
      constructor(transactionContext, _idleHub, _idleTimeout = DEFAULT_IDLE_TIMEOUT, _finalTimeout = DEFAULT_FINAL_TIMEOUT, _heartbeatInterval = DEFAULT_HEARTBEAT_INTERVAL, _onScope = false) {
        super(transactionContext, _idleHub);
        this._idleHub = _idleHub;
        this._idleTimeout = _idleTimeout;
        this._finalTimeout = _finalTimeout;
        this._heartbeatInterval = _heartbeatInterval;
        this._onScope = _onScope;
        IdleTransaction.prototype.__init.call(this);
        IdleTransaction.prototype.__init2.call(this);
        IdleTransaction.prototype.__init3.call(this);
        IdleTransaction.prototype.__init4.call(this);
        if (_onScope) {
          clearActiveTransaction(_idleHub);
          (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.log(`Setting idle transaction on scope. Span ID: ${this.spanId}`);
          _idleHub.configureScope((scope) => scope.setSpan(this));
        }
        this._startIdleTimeout();
        setTimeout(() => {
          if (!this._finished) {
            this.setStatus("deadline_exceeded");
            this.finish();
          }
        }, this._finalTimeout);
      }
      finish(endTimestamp = timestampWithMs()) {
        this._finished = true;
        this.activities = {};
        if (this.spanRecorder) {
          (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.log("[Tracing] finishing IdleTransaction", new Date(endTimestamp * 1e3).toISOString(), this.op);
          for (const callback of this._beforeFinishCallbacks) {
            callback(this, endTimestamp);
          }
          this.spanRecorder.spans = this.spanRecorder.spans.filter((span) => {
            if (span.spanId === this.spanId) {
              return true;
            }
            if (!span.endTimestamp) {
              span.endTimestamp = endTimestamp;
              span.setStatus("cancelled");
              (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.log("[Tracing] cancelling span since transaction ended early", JSON.stringify(span, void 0, 2));
            }
            const keepSpan = span.startTimestamp < endTimestamp;
            if (!keepSpan) {
              (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.log(
                "[Tracing] discarding Span since it happened after Transaction was finished",
                JSON.stringify(span, void 0, 2)
              );
            }
            return keepSpan;
          });
          (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.log("[Tracing] flushing IdleTransaction");
        } else {
          (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.log("[Tracing] No active IdleTransaction");
        }
        if (this._onScope) {
          clearActiveTransaction(this._idleHub);
        }
        return super.finish(endTimestamp);
      }
      registerBeforeFinishCallback(callback) {
        this._beforeFinishCallbacks.push(callback);
      }
      initSpanRecorder(maxlen) {
        if (!this.spanRecorder) {
          const pushActivity = (id) => {
            if (this._finished) {
              return;
            }
            this._pushActivity(id);
          };
          const popActivity = (id) => {
            if (this._finished) {
              return;
            }
            this._popActivity(id);
          };
          this.spanRecorder = new IdleTransactionSpanRecorder(pushActivity, popActivity, this.spanId, maxlen);
          (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.log("Starting heartbeat");
          this._pingHeartbeat();
        }
        this.spanRecorder.add(this);
      }
      _cancelIdleTimeout() {
        if (this._idleTimeoutID) {
          clearTimeout(this._idleTimeoutID);
          this._idleTimeoutID = void 0;
        }
      }
      _startIdleTimeout(endTimestamp) {
        this._cancelIdleTimeout();
        this._idleTimeoutID = setTimeout(() => {
          if (!this._finished && Object.keys(this.activities).length === 0) {
            this.finish(endTimestamp);
          }
        }, this._idleTimeout);
      }
      _pushActivity(spanId) {
        this._cancelIdleTimeout();
        (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.log(`[Tracing] pushActivity: ${spanId}`);
        this.activities[spanId] = true;
        (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.log("[Tracing] new activities count", Object.keys(this.activities).length);
      }
      _popActivity(spanId) {
        if (this.activities[spanId]) {
          (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.log(`[Tracing] popActivity ${spanId}`);
          delete this.activities[spanId];
          (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.log("[Tracing] new activities count", Object.keys(this.activities).length);
        }
        if (Object.keys(this.activities).length === 0) {
          const endTimestamp = timestampWithMs() + this._idleTimeout / 1e3;
          this._startIdleTimeout(endTimestamp);
        }
      }
      _beat() {
        if (this._finished) {
          return;
        }
        const heartbeatString = Object.keys(this.activities).join("");
        if (heartbeatString === this._prevHeartbeatString) {
          this._heartbeatCounter++;
        } else {
          this._heartbeatCounter = 1;
        }
        this._prevHeartbeatString = heartbeatString;
        if (this._heartbeatCounter >= 3) {
          (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.log("[Tracing] Transaction finished because of no change for 3 heart beats");
          this.setStatus("deadline_exceeded");
          this.finish();
        } else {
          this._pingHeartbeat();
        }
      }
      _pingHeartbeat() {
        (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.log(`pinging Heartbeat -> current counter: ${this._heartbeatCounter}`);
        setTimeout(() => {
          this._beat();
        }, this._heartbeatInterval);
      }
    }
    function clearActiveTransaction(hub) {
      const scope = hub.getScope();
      if (scope) {
        const transaction = scope.getTransaction();
        if (transaction) {
          scope.setSpan(void 0);
        }
      }
    }
    function traceHeaders() {
      const scope = this.getScope();
      if (scope) {
        const span = scope.getSpan();
        if (span) {
          return {
            "sentry-trace": span.toTraceparent()
          };
        }
      }
      return {};
    }
    function sample(transaction, options, samplingContext) {
      if (!hasTracingEnabled(options)) {
        transaction.sampled = false;
        return transaction;
      }
      if (transaction.sampled !== void 0) {
        transaction.setMetadata({
          sampleRate: Number(transaction.sampled)
        });
        return transaction;
      }
      let sampleRate;
      if (typeof options.tracesSampler === "function") {
        sampleRate = options.tracesSampler(samplingContext);
        transaction.setMetadata({
          sampleRate: Number(sampleRate)
        });
      } else if (samplingContext.parentSampled !== void 0) {
        sampleRate = samplingContext.parentSampled;
      } else {
        sampleRate = options.tracesSampleRate;
        transaction.setMetadata({
          sampleRate: Number(sampleRate)
        });
      }
      if (!isValidSampleRate(sampleRate)) {
        (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.warn("[Tracing] Discarding transaction because of invalid sample rate.");
        transaction.sampled = false;
        return transaction;
      }
      if (!sampleRate) {
        (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.log(
          `[Tracing] Discarding transaction because ${typeof options.tracesSampler === "function" ? "tracesSampler returned 0 or false" : "a negative sampling decision was inherited or tracesSampleRate is set to 0"}`
        );
        transaction.sampled = false;
        return transaction;
      }
      transaction.sampled = Math.random() < sampleRate;
      if (!transaction.sampled) {
        (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.log(
          `[Tracing] Discarding transaction because it's not included in the random sample (sampling rate = ${Number(
            sampleRate
          )})`
        );
        return transaction;
      }
      (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.log(`[Tracing] starting ${transaction.op} transaction - ${transaction.name}`);
      return transaction;
    }
    function isValidSampleRate(rate) {
      if (isNaN$1(rate) || !(typeof rate === "number" || typeof rate === "boolean")) {
        (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.warn(
          `[Tracing] Given sample rate is invalid. Sample rate must be a boolean or a number between 0 and 1. Got ${JSON.stringify(
            rate
          )} of type ${JSON.stringify(typeof rate)}.`
        );
        return false;
      }
      if (rate < 0 || rate > 1) {
        (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.warn(`[Tracing] Given sample rate is invalid. Sample rate must be between 0 and 1. Got ${rate}.`);
        return false;
      }
      return true;
    }
    function _startTransaction(transactionContext, customSamplingContext) {
      const client = this.getClient();
      const options = client && client.getOptions() || {};
      const configInstrumenter = options.instrumenter || "sentry";
      const transactionInstrumenter = transactionContext.instrumenter || "sentry";
      if (configInstrumenter !== transactionInstrumenter) {
        (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.error(
          `A transaction was started with instrumenter=\`${transactionInstrumenter}\`, but the SDK is configured with the \`${configInstrumenter}\` instrumenter.
The transaction will not be sampled. Please use the ${configInstrumenter} instrumentation to start transactions.`
        );
        transactionContext.sampled = false;
      }
      let transaction = new Transaction(transactionContext, this);
      transaction = sample(transaction, options, {
        parentSampled: transactionContext.parentSampled,
        transactionContext,
        ...customSamplingContext
      });
      if (transaction.sampled) {
        transaction.initSpanRecorder(options._experiments && options._experiments.maxSpans);
      }
      return transaction;
    }
    function startIdleTransaction(hub, transactionContext, idleTimeout, finalTimeout, onScope, customSamplingContext, heartbeatInterval) {
      const client = hub.getClient();
      const options = client && client.getOptions() || {};
      let transaction = new IdleTransaction(transactionContext, hub, idleTimeout, finalTimeout, heartbeatInterval, onScope);
      transaction = sample(transaction, options, {
        parentSampled: transactionContext.parentSampled,
        transactionContext,
        ...customSamplingContext
      });
      if (transaction.sampled) {
        transaction.initSpanRecorder(options._experiments && options._experiments.maxSpans);
      }
      return transaction;
    }
    function _addTracingExtensions() {
      const carrier = getMainCarrier();
      if (!carrier.__SENTRY__) {
        return;
      }
      carrier.__SENTRY__.extensions = carrier.__SENTRY__.extensions || {};
      if (!carrier.__SENTRY__.extensions.startTransaction) {
        carrier.__SENTRY__.extensions.startTransaction = _startTransaction;
      }
      if (!carrier.__SENTRY__.extensions.traceHeaders) {
        carrier.__SENTRY__.extensions.traceHeaders = traceHeaders;
      }
    }
    function _autoloadDatabaseIntegrations() {
      const carrier = getMainCarrier();
      if (!carrier.__SENTRY__) {
        return;
      }
      const packageToIntegrationMapping = {
        mongodb() {
          const integration = dynamicRequire(module, "./integrations/node/mongo");
          return new integration.Mongo();
        },
        mongoose() {
          const integration = dynamicRequire(module, "./integrations/node/mongo");
          return new integration.Mongo({ mongoose: true });
        },
        mysql() {
          const integration = dynamicRequire(module, "./integrations/node/mysql");
          return new integration.Mysql();
        },
        pg() {
          const integration = dynamicRequire(module, "./integrations/node/postgres");
          return new integration.Postgres();
        }
      };
      const mappedPackages = Object.keys(packageToIntegrationMapping).filter((moduleName) => !!loadModule(moduleName)).map((pkg) => {
        try {
          return packageToIntegrationMapping[pkg]();
        } catch (e) {
          return void 0;
        }
      }).filter((p2) => p2);
      if (mappedPackages.length > 0) {
        carrier.__SENTRY__.integrations = [...carrier.__SENTRY__.integrations || [], ...mappedPackages];
      }
    }
    function addExtensionMethods() {
      _addTracingExtensions();
      if (isNodeEnv()) {
        _autoloadDatabaseIntegrations();
      }
      registerErrorInstrumentation();
    }
    const WINDOW = GLOBAL_OBJ$1;
    function registerBackgroundTabDetection() {
      if (WINDOW && WINDOW.document) {
        WINDOW.document.addEventListener("visibilitychange", () => {
          const activeTransaction = getActiveTransaction();
          if (WINDOW.document.hidden && activeTransaction) {
            const statusType = "cancelled";
            (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.log(
              `[Tracing] Transaction: ${statusType} -> since tab moved to the background, op: ${activeTransaction.op}`
            );
            if (!activeTransaction.status) {
              activeTransaction.setStatus(statusType);
            }
            activeTransaction.setTag("visibilitychange", "document.hidden");
            activeTransaction.finish();
          }
        });
      } else {
        (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.warn("[Tracing] Could not set up background tab detection due to lack of global document");
      }
    }
    const bindReporter = (callback, metric, reportAllChanges) => {
      let prevValue;
      let delta;
      return (forceReport) => {
        if (metric.value >= 0) {
          if (forceReport || reportAllChanges) {
            delta = metric.value - (prevValue || 0);
            if (delta || prevValue === void 0) {
              prevValue = metric.value;
              metric.delta = delta;
              callback(metric);
            }
          }
        }
      };
    };
    const generateUniqueID = () => {
      return `v3-${Date.now()}-${Math.floor(Math.random() * (9e12 - 1)) + 1e12}`;
    };
    const getNavigationEntryFromPerformanceTiming = () => {
      const timing = WINDOW.performance.timing;
      const type = WINDOW.performance.navigation.type;
      const navigationEntry = {
        entryType: "navigation",
        startTime: 0,
        type: type == 2 ? "back_forward" : type === 1 ? "reload" : "navigate"
      };
      for (const key in timing) {
        if (key !== "navigationStart" && key !== "toJSON") {
          navigationEntry[key] = Math.max(timing[key] - timing.navigationStart, 0);
        }
      }
      return navigationEntry;
    };
    const getNavigationEntry = () => {
      if (WINDOW.__WEB_VITALS_POLYFILL__) {
        return WINDOW.performance && (performance.getEntriesByType && performance.getEntriesByType("navigation")[0] || getNavigationEntryFromPerformanceTiming());
      } else {
        return WINDOW.performance && performance.getEntriesByType && performance.getEntriesByType("navigation")[0];
      }
    };
    const getActivationStart = () => {
      const navEntry = getNavigationEntry();
      return navEntry && navEntry.activationStart || 0;
    };
    const initMetric = (name, value) => {
      const navEntry = getNavigationEntry();
      let navigationType = "navigate";
      if (navEntry) {
        if (WINDOW.document.prerendering || getActivationStart() > 0) {
          navigationType = "prerender";
        } else {
          navigationType = navEntry.type.replace(/_/g, "-");
        }
      }
      return {
        name,
        value: typeof value === "undefined" ? -1 : value,
        rating: "good",
        delta: 0,
        entries: [],
        id: generateUniqueID(),
        navigationType
      };
    };
    const observe = (type, callback, opts) => {
      try {
        if (PerformanceObserver.supportedEntryTypes.includes(type)) {
          const po = new PerformanceObserver((list) => {
            callback(list.getEntries());
          });
          po.observe(
            Object.assign(
              {
                type,
                buffered: true
              },
              opts || {}
            )
          );
          return po;
        }
      } catch (e) {
      }
      return;
    };
    const onHidden = (cb, once) => {
      const onHiddenOrPageHide = (event) => {
        if (event.type === "pagehide" || WINDOW.document.visibilityState === "hidden") {
          cb(event);
          if (once) {
            removeEventListener("visibilitychange", onHiddenOrPageHide, true);
            removeEventListener("pagehide", onHiddenOrPageHide, true);
          }
        }
      };
      addEventListener("visibilitychange", onHiddenOrPageHide, true);
      addEventListener("pagehide", onHiddenOrPageHide, true);
    };
    const onCLS = (onReport, opts = {}) => {
      const metric = initMetric("CLS", 0);
      let report;
      let sessionValue = 0;
      let sessionEntries = [];
      const handleEntries = (entries) => {
        entries.forEach((entry) => {
          if (!entry.hadRecentInput) {
            const firstSessionEntry = sessionEntries[0];
            const lastSessionEntry = sessionEntries[sessionEntries.length - 1];
            if (sessionValue && sessionEntries.length !== 0 && entry.startTime - lastSessionEntry.startTime < 1e3 && entry.startTime - firstSessionEntry.startTime < 5e3) {
              sessionValue += entry.value;
              sessionEntries.push(entry);
            } else {
              sessionValue = entry.value;
              sessionEntries = [entry];
            }
            if (sessionValue > metric.value) {
              metric.value = sessionValue;
              metric.entries = sessionEntries;
              if (report) {
                report();
              }
            }
          }
        });
      };
      const po = observe("layout-shift", handleEntries);
      if (po) {
        report = bindReporter(onReport, metric, opts.reportAllChanges);
        onHidden(() => {
          handleEntries(po.takeRecords());
          report(true);
        });
      }
    };
    let firstHiddenTime = -1;
    const initHiddenTime = () => {
      return WINDOW.document.visibilityState === "hidden" && !WINDOW.document.prerendering ? 0 : Infinity;
    };
    const trackChanges = () => {
      onHidden(({ timeStamp }) => {
        firstHiddenTime = timeStamp;
      }, true);
    };
    const getVisibilityWatcher = () => {
      if (firstHiddenTime < 0) {
        firstHiddenTime = initHiddenTime();
        trackChanges();
      }
      return {
        get firstHiddenTime() {
          return firstHiddenTime;
        }
      };
    };
    const onFID = (onReport, opts = {}) => {
      const visibilityWatcher = getVisibilityWatcher();
      const metric = initMetric("FID");
      let report;
      const handleEntry = (entry) => {
        if (entry.startTime < visibilityWatcher.firstHiddenTime) {
          metric.value = entry.processingStart - entry.startTime;
          metric.entries.push(entry);
          report(true);
        }
      };
      const handleEntries = (entries) => {
        entries.forEach(handleEntry);
      };
      const po = observe("first-input", handleEntries);
      report = bindReporter(onReport, metric, opts.reportAllChanges);
      if (po) {
        onHidden(() => {
          handleEntries(po.takeRecords());
          po.disconnect();
        }, true);
      }
    };
    const reportedMetricIDs = {};
    const onLCP = (onReport, opts = {}) => {
      const visibilityWatcher = getVisibilityWatcher();
      const metric = initMetric("LCP");
      let report;
      const handleEntries = (entries) => {
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          const value = Math.max(lastEntry.startTime - getActivationStart(), 0);
          if (value < visibilityWatcher.firstHiddenTime) {
            metric.value = value;
            metric.entries = [lastEntry];
            report();
          }
        }
      };
      const po = observe("largest-contentful-paint", handleEntries);
      if (po) {
        report = bindReporter(onReport, metric, opts.reportAllChanges);
        const stopListening = () => {
          if (!reportedMetricIDs[metric.id]) {
            handleEntries(po.takeRecords());
            po.disconnect();
            reportedMetricIDs[metric.id] = true;
            report(true);
          }
        };
        ["keydown", "click"].forEach((type) => {
          addEventListener(type, stopListening, { once: true, capture: true });
        });
        onHidden(stopListening, true);
      }
    };
    function isMeasurementValue(value) {
      return typeof value === "number" && isFinite(value);
    }
    function _startChild(transaction, { startTimestamp, ...ctx }) {
      if (startTimestamp && transaction.startTimestamp > startTimestamp) {
        transaction.startTimestamp = startTimestamp;
      }
      return transaction.startChild({
        startTimestamp,
        ...ctx
      });
    }
    function getBrowserPerformanceAPI() {
      return WINDOW && WINDOW.addEventListener && WINDOW.performance;
    }
    let _performanceCursor = 0;
    let _measurements = {};
    let _lcpEntry;
    let _clsEntry;
    function startTrackingWebVitals(reportAllChanges = false) {
      const performance2 = getBrowserPerformanceAPI();
      if (performance2 && browserPerformanceTimeOrigin) {
        if (performance2.mark) {
          WINDOW.performance.mark("sentry-tracing-init");
        }
        _trackCLS();
        _trackLCP(reportAllChanges);
        _trackFID();
      }
    }
    function startTrackingLongTasks() {
      const entryHandler = (entries) => {
        for (const entry of entries) {
          const transaction = getActiveTransaction();
          if (!transaction) {
            return;
          }
          const startTime = msToSec(browserPerformanceTimeOrigin + entry.startTime);
          const duration = msToSec(entry.duration);
          transaction.startChild({
            description: "Main UI thread blocked",
            op: "ui.long-task",
            startTimestamp: startTime,
            endTimestamp: startTime + duration
          });
        }
      };
      observe("longtask", entryHandler);
    }
    function _trackCLS() {
      onCLS((metric) => {
        const entry = metric.entries.pop();
        if (!entry) {
          return;
        }
        (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.log("[Measurements] Adding CLS");
        _measurements["cls"] = { value: metric.value, unit: "" };
        _clsEntry = entry;
      });
    }
    function _trackLCP(reportAllChanges) {
      onLCP(
        (metric) => {
          const entry = metric.entries.pop();
          if (!entry) {
            return;
          }
          (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.log("[Measurements] Adding LCP");
          _measurements["lcp"] = { value: metric.value, unit: "millisecond" };
          _lcpEntry = entry;
        },
        { reportAllChanges }
      );
    }
    function _trackFID() {
      onFID((metric) => {
        const entry = metric.entries.pop();
        if (!entry) {
          return;
        }
        const timeOrigin = msToSec(browserPerformanceTimeOrigin);
        const startTime = msToSec(entry.startTime);
        (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.log("[Measurements] Adding FID");
        _measurements["fid"] = { value: metric.value, unit: "millisecond" };
        _measurements["mark.fid"] = { value: timeOrigin + startTime, unit: "second" };
      });
    }
    function addPerformanceEntries(transaction) {
      const performance2 = getBrowserPerformanceAPI();
      if (!performance2 || !WINDOW.performance.getEntries || !browserPerformanceTimeOrigin) {
        return;
      }
      (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.log("[Tracing] Adding & adjusting spans using Performance API");
      const timeOrigin = msToSec(browserPerformanceTimeOrigin);
      const performanceEntries = performance2.getEntries();
      let responseStartTimestamp;
      let requestStartTimestamp;
      performanceEntries.slice(_performanceCursor).forEach((entry) => {
        const startTime = msToSec(entry.startTime);
        const duration = msToSec(entry.duration);
        if (transaction.op === "navigation" && timeOrigin + startTime < transaction.startTimestamp) {
          return;
        }
        switch (entry.entryType) {
          case "navigation": {
            _addNavigationSpans(transaction, entry, timeOrigin);
            responseStartTimestamp = timeOrigin + msToSec(entry.responseStart);
            requestStartTimestamp = timeOrigin + msToSec(entry.requestStart);
            break;
          }
          case "mark":
          case "paint":
          case "measure": {
            _addMeasureSpans(transaction, entry, startTime, duration, timeOrigin);
            const firstHidden = getVisibilityWatcher();
            const shouldRecord = entry.startTime < firstHidden.firstHiddenTime;
            if (entry.name === "first-paint" && shouldRecord) {
              (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.log("[Measurements] Adding FP");
              _measurements["fp"] = { value: entry.startTime, unit: "millisecond" };
            }
            if (entry.name === "first-contentful-paint" && shouldRecord) {
              (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.log("[Measurements] Adding FCP");
              _measurements["fcp"] = { value: entry.startTime, unit: "millisecond" };
            }
            break;
          }
          case "resource": {
            const resourceName = entry.name.replace(WINDOW.location.origin, "");
            _addResourceSpans(transaction, entry, resourceName, startTime, duration, timeOrigin);
            break;
          }
        }
      });
      _performanceCursor = Math.max(performanceEntries.length - 1, 0);
      _trackNavigator(transaction);
      if (transaction.op === "pageload") {
        if (typeof responseStartTimestamp === "number") {
          (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.log("[Measurements] Adding TTFB");
          _measurements["ttfb"] = {
            value: (responseStartTimestamp - transaction.startTimestamp) * 1e3,
            unit: "millisecond"
          };
          if (typeof requestStartTimestamp === "number" && requestStartTimestamp <= responseStartTimestamp) {
            _measurements["ttfb.requestTime"] = {
              value: (responseStartTimestamp - requestStartTimestamp) * 1e3,
              unit: "millisecond"
            };
          }
        }
        ["fcp", "fp", "lcp"].forEach((name) => {
          if (!_measurements[name] || timeOrigin >= transaction.startTimestamp) {
            return;
          }
          const oldValue = _measurements[name].value;
          const measurementTimestamp = timeOrigin + msToSec(oldValue);
          const normalizedValue = Math.abs((measurementTimestamp - transaction.startTimestamp) * 1e3);
          const delta = normalizedValue - oldValue;
          (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.log(`[Measurements] Normalized ${name} from ${oldValue} to ${normalizedValue} (${delta})`);
          _measurements[name].value = normalizedValue;
        });
        const fidMark = _measurements["mark.fid"];
        if (fidMark && _measurements["fid"]) {
          _startChild(transaction, {
            description: "first input delay",
            endTimestamp: fidMark.value + msToSec(_measurements["fid"].value),
            op: "ui.action",
            startTimestamp: fidMark.value
          });
          delete _measurements["mark.fid"];
        }
        if (!("fcp" in _measurements)) {
          delete _measurements.cls;
        }
        Object.keys(_measurements).forEach((measurementName) => {
          transaction.setMeasurement(
            measurementName,
            _measurements[measurementName].value,
            _measurements[measurementName].unit
          );
        });
        _tagMetricInfo(transaction);
      }
      _lcpEntry = void 0;
      _clsEntry = void 0;
      _measurements = {};
    }
    function _addMeasureSpans(transaction, entry, startTime, duration, timeOrigin) {
      const measureStartTimestamp = timeOrigin + startTime;
      const measureEndTimestamp = measureStartTimestamp + duration;
      _startChild(transaction, {
        description: entry.name,
        endTimestamp: measureEndTimestamp,
        op: entry.entryType,
        startTimestamp: measureStartTimestamp
      });
      return measureStartTimestamp;
    }
    function _addNavigationSpans(transaction, entry, timeOrigin) {
      ["unloadEvent", "redirect", "domContentLoadedEvent", "loadEvent", "connect"].forEach((event) => {
        _addPerformanceNavigationTiming(transaction, entry, event, timeOrigin);
      });
      _addPerformanceNavigationTiming(transaction, entry, "secureConnection", timeOrigin, "TLS/SSL", "connectEnd");
      _addPerformanceNavigationTiming(transaction, entry, "fetch", timeOrigin, "cache", "domainLookupStart");
      _addPerformanceNavigationTiming(transaction, entry, "domainLookup", timeOrigin, "DNS");
      _addRequest(transaction, entry, timeOrigin);
    }
    function _addPerformanceNavigationTiming(transaction, entry, event, timeOrigin, description, eventEnd) {
      const end = eventEnd ? entry[eventEnd] : entry[`${event}End`];
      const start = entry[`${event}Start`];
      if (!start || !end) {
        return;
      }
      _startChild(transaction, {
        op: "browser",
        description: _nullishCoalesce(description, () => event),
        startTimestamp: timeOrigin + msToSec(start),
        endTimestamp: timeOrigin + msToSec(end)
      });
    }
    function _addRequest(transaction, entry, timeOrigin) {
      _startChild(transaction, {
        op: "browser",
        description: "request",
        startTimestamp: timeOrigin + msToSec(entry.requestStart),
        endTimestamp: timeOrigin + msToSec(entry.responseEnd)
      });
      _startChild(transaction, {
        op: "browser",
        description: "response",
        startTimestamp: timeOrigin + msToSec(entry.responseStart),
        endTimestamp: timeOrigin + msToSec(entry.responseEnd)
      });
    }
    function _addResourceSpans(transaction, entry, resourceName, startTime, duration, timeOrigin) {
      if (entry.initiatorType === "xmlhttprequest" || entry.initiatorType === "fetch") {
        return;
      }
      const data = {};
      if ("transferSize" in entry) {
        data["Transfer Size"] = entry.transferSize;
      }
      if ("encodedBodySize" in entry) {
        data["Encoded Body Size"] = entry.encodedBodySize;
      }
      if ("decodedBodySize" in entry) {
        data["Decoded Body Size"] = entry.decodedBodySize;
      }
      const startTimestamp = timeOrigin + startTime;
      const endTimestamp = startTimestamp + duration;
      _startChild(transaction, {
        description: resourceName,
        endTimestamp,
        op: entry.initiatorType ? `resource.${entry.initiatorType}` : "resource.other",
        startTimestamp,
        data
      });
    }
    function _trackNavigator(transaction) {
      const navigator = WINDOW.navigator;
      if (!navigator) {
        return;
      }
      const connection = navigator.connection;
      if (connection) {
        if (connection.effectiveType) {
          transaction.setTag("effectiveConnectionType", connection.effectiveType);
        }
        if (connection.type) {
          transaction.setTag("connectionType", connection.type);
        }
        if (isMeasurementValue(connection.rtt)) {
          _measurements["connection.rtt"] = { value: connection.rtt, unit: "millisecond" };
        }
      }
      if (isMeasurementValue(navigator.deviceMemory)) {
        transaction.setTag("deviceMemory", `${navigator.deviceMemory} GB`);
      }
      if (isMeasurementValue(navigator.hardwareConcurrency)) {
        transaction.setTag("hardwareConcurrency", String(navigator.hardwareConcurrency));
      }
    }
    function _tagMetricInfo(transaction) {
      if (_lcpEntry) {
        (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.log("[Measurements] Adding LCP Data");
        if (_lcpEntry.element) {
          transaction.setTag("lcp.element", htmlTreeAsString(_lcpEntry.element));
        }
        if (_lcpEntry.id) {
          transaction.setTag("lcp.id", _lcpEntry.id);
        }
        if (_lcpEntry.url) {
          transaction.setTag("lcp.url", _lcpEntry.url.trim().slice(0, 200));
        }
        transaction.setTag("lcp.size", _lcpEntry.size);
      }
      if (_clsEntry && _clsEntry.sources) {
        (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.log("[Measurements] Adding CLS Data");
        _clsEntry.sources.forEach(
          (source, index2) => transaction.setTag(`cls.source.${index2 + 1}`, htmlTreeAsString(source.node))
        );
      }
    }
    const DEFAULT_TRACE_PROPAGATION_TARGETS = ["localhost", /^\//];
    const defaultRequestInstrumentationOptions = {
      traceFetch: true,
      traceXHR: true,
      tracingOrigins: DEFAULT_TRACE_PROPAGATION_TARGETS,
      tracePropagationTargets: DEFAULT_TRACE_PROPAGATION_TARGETS
    };
    function instrumentOutgoingRequests(_options) {
      const { traceFetch, traceXHR, tracePropagationTargets, tracingOrigins, shouldCreateSpanForRequest } = {
        traceFetch: defaultRequestInstrumentationOptions.traceFetch,
        traceXHR: defaultRequestInstrumentationOptions.traceXHR,
        ..._options
      };
      const shouldCreateSpan = typeof shouldCreateSpanForRequest === "function" ? shouldCreateSpanForRequest : (_) => true;
      const shouldAttachHeadersWithTargets = (url) => shouldAttachHeaders(url, tracePropagationTargets || tracingOrigins);
      const spans = {};
      if (traceFetch) {
        addInstrumentationHandler("fetch", (handlerData) => {
          fetchCallback(handlerData, shouldCreateSpan, shouldAttachHeadersWithTargets, spans);
        });
      }
      if (traceXHR) {
        addInstrumentationHandler("xhr", (handlerData) => {
          xhrCallback(handlerData, shouldCreateSpan, shouldAttachHeadersWithTargets, spans);
        });
      }
    }
    function shouldAttachHeaders(url, tracePropagationTargets) {
      return stringMatchesSomePattern(url, tracePropagationTargets || DEFAULT_TRACE_PROPAGATION_TARGETS);
    }
    function fetchCallback(handlerData, shouldCreateSpan, shouldAttachHeaders2, spans) {
      if (!hasTracingEnabled() || !(handlerData.fetchData && shouldCreateSpan(handlerData.fetchData.url))) {
        return;
      }
      if (handlerData.endTimestamp) {
        const spanId = handlerData.fetchData.__span;
        if (!spanId)
          return;
        const span = spans[spanId];
        if (span) {
          if (handlerData.response) {
            span.setHttpStatus(handlerData.response.status);
          } else if (handlerData.error) {
            span.setStatus("internal_error");
          }
          span.finish();
          delete spans[spanId];
        }
        return;
      }
      const activeTransaction = getActiveTransaction();
      if (activeTransaction) {
        const span = activeTransaction.startChild({
          data: {
            ...handlerData.fetchData,
            type: "fetch"
          },
          description: `${handlerData.fetchData.method} ${handlerData.fetchData.url}`,
          op: "http.client"
        });
        handlerData.fetchData.__span = span.spanId;
        spans[span.spanId] = span;
        const request = handlerData.args[0];
        handlerData.args[1] = handlerData.args[1] || {};
        const options = handlerData.args[1];
        if (shouldAttachHeaders2(handlerData.fetchData.url)) {
          options.headers = addTracingHeadersToFetchRequest(
            request,
            activeTransaction.getDynamicSamplingContext(),
            span,
            options
          );
          activeTransaction.metadata.propagations++;
        }
      }
    }
    function addTracingHeadersToFetchRequest(request, dynamicSamplingContext, span, options) {
      const sentryBaggageHeader = dynamicSamplingContextToSentryBaggageHeader(dynamicSamplingContext);
      const sentryTraceHeader = span.toTraceparent();
      const headers = typeof Request !== "undefined" && isInstanceOf(request, Request) ? request.headers : options.headers;
      if (!headers) {
        return { "sentry-trace": sentryTraceHeader, baggage: sentryBaggageHeader };
      } else if (typeof Headers !== "undefined" && isInstanceOf(headers, Headers)) {
        const newHeaders = new Headers(headers);
        newHeaders.append("sentry-trace", sentryTraceHeader);
        if (sentryBaggageHeader) {
          newHeaders.append(BAGGAGE_HEADER_NAME, sentryBaggageHeader);
        }
        return newHeaders;
      } else if (Array.isArray(headers)) {
        const newHeaders = [...headers, ["sentry-trace", sentryTraceHeader]];
        if (sentryBaggageHeader) {
          newHeaders.push([BAGGAGE_HEADER_NAME, sentryBaggageHeader]);
        }
        return newHeaders;
      } else {
        const existingBaggageHeader = "baggage" in headers ? headers.baggage : void 0;
        const newBaggageHeaders = [];
        if (Array.isArray(existingBaggageHeader)) {
          newBaggageHeaders.push(...existingBaggageHeader);
        } else if (existingBaggageHeader) {
          newBaggageHeaders.push(existingBaggageHeader);
        }
        if (sentryBaggageHeader) {
          newBaggageHeaders.push(sentryBaggageHeader);
        }
        return {
          ...headers,
          "sentry-trace": sentryTraceHeader,
          baggage: newBaggageHeaders.length > 0 ? newBaggageHeaders.join(",") : void 0
        };
      }
    }
    function xhrCallback(handlerData, shouldCreateSpan, shouldAttachHeaders2, spans) {
      if (!hasTracingEnabled() || handlerData.xhr && handlerData.xhr.__sentry_own_request__ || !(handlerData.xhr && handlerData.xhr.__sentry_xhr__ && shouldCreateSpan(handlerData.xhr.__sentry_xhr__.url))) {
        return;
      }
      const xhr = handlerData.xhr.__sentry_xhr__;
      if (handlerData.endTimestamp) {
        const spanId = handlerData.xhr.__sentry_xhr_span_id__;
        if (!spanId)
          return;
        const span = spans[spanId];
        if (span) {
          span.setHttpStatus(xhr.status_code);
          span.finish();
          delete spans[spanId];
        }
        return;
      }
      const activeTransaction = getActiveTransaction();
      if (activeTransaction) {
        const span = activeTransaction.startChild({
          data: {
            ...xhr.data,
            type: "xhr",
            method: xhr.method,
            url: xhr.url
          },
          description: `${xhr.method} ${xhr.url}`,
          op: "http.client"
        });
        handlerData.xhr.__sentry_xhr_span_id__ = span.spanId;
        spans[handlerData.xhr.__sentry_xhr_span_id__] = span;
        if (handlerData.xhr.setRequestHeader && shouldAttachHeaders2(handlerData.xhr.__sentry_xhr__.url)) {
          try {
            handlerData.xhr.setRequestHeader("sentry-trace", span.toTraceparent());
            const dynamicSamplingContext = activeTransaction.getDynamicSamplingContext();
            const sentryBaggageHeader = dynamicSamplingContextToSentryBaggageHeader(dynamicSamplingContext);
            if (sentryBaggageHeader) {
              handlerData.xhr.setRequestHeader(BAGGAGE_HEADER_NAME, sentryBaggageHeader);
            }
            activeTransaction.metadata.propagations++;
          } catch (_) {
          }
        }
      }
    }
    function instrumentRoutingWithDefaults(customStartTransaction, startTransactionOnPageLoad = true, startTransactionOnLocationChange = true) {
      if (!WINDOW || !WINDOW.location) {
        (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.warn("Could not initialize routing instrumentation due to invalid location");
        return;
      }
      let startingUrl = WINDOW.location.href;
      let activeTransaction;
      if (startTransactionOnPageLoad) {
        activeTransaction = customStartTransaction({
          name: WINDOW.location.pathname,
          op: "pageload",
          metadata: { source: "url" }
        });
      }
      if (startTransactionOnLocationChange) {
        addInstrumentationHandler("history", ({ to, from }) => {
          if (from === void 0 && startingUrl && startingUrl.indexOf(to) !== -1) {
            startingUrl = void 0;
            return;
          }
          if (from !== to) {
            startingUrl = void 0;
            if (activeTransaction) {
              (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.log(`[Tracing] Finishing current transaction with op: ${activeTransaction.op}`);
              activeTransaction.finish();
            }
            activeTransaction = customStartTransaction({
              name: WINDOW.location.pathname,
              op: "navigation",
              metadata: { source: "url" }
            });
          }
        });
      }
    }
    const BROWSER_TRACING_INTEGRATION_ID = "BrowserTracing";
    const DEFAULT_BROWSER_TRACING_OPTIONS = {
      idleTimeout: DEFAULT_IDLE_TIMEOUT,
      finalTimeout: DEFAULT_FINAL_TIMEOUT,
      heartbeatInterval: DEFAULT_HEARTBEAT_INTERVAL,
      markBackgroundTransactions: true,
      routingInstrumentation: instrumentRoutingWithDefaults,
      startTransactionOnLocationChange: true,
      startTransactionOnPageLoad: true,
      _experiments: { enableLongTask: true },
      ...defaultRequestInstrumentationOptions
    };
    class BrowserTracing {
      __init() {
        this.name = BROWSER_TRACING_INTEGRATION_ID;
      }
      constructor(_options) {
        BrowserTracing.prototype.__init.call(this);
        this.options = {
          ...DEFAULT_BROWSER_TRACING_OPTIONS,
          ..._options
        };
        if (_options && !_options.tracePropagationTargets && _options.tracingOrigins) {
          this.options.tracePropagationTargets = _options.tracingOrigins;
        }
        const { _metricOptions } = this.options;
        startTrackingWebVitals(_metricOptions && _metricOptions._reportAllChanges);
        if (_optionalChain([this, "access", (_2) => _2.options, "access", (_3) => _3._experiments, "optionalAccess", (_4) => _4.enableLongTask])) {
          startTrackingLongTasks();
        }
      }
      setupOnce(_, getCurrentHub2) {
        this._getCurrentHub = getCurrentHub2;
        const {
          routingInstrumentation: instrumentRouting,
          startTransactionOnLocationChange,
          startTransactionOnPageLoad,
          markBackgroundTransactions,
          traceFetch,
          traceXHR,
          tracePropagationTargets,
          shouldCreateSpanForRequest
        } = this.options;
        instrumentRouting(
          (context) => this._createRouteTransaction(context),
          startTransactionOnPageLoad,
          startTransactionOnLocationChange
        );
        if (markBackgroundTransactions) {
          registerBackgroundTabDetection();
        }
        instrumentOutgoingRequests({
          traceFetch,
          traceXHR,
          tracePropagationTargets,
          shouldCreateSpanForRequest
        });
      }
      _createRouteTransaction(context) {
        if (!this._getCurrentHub) {
          (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.warn(`[Tracing] Did not create ${context.op} transaction because _getCurrentHub is invalid.`);
          return void 0;
        }
        const { beforeNavigate, idleTimeout, finalTimeout, heartbeatInterval } = this.options;
        const isPageloadTransaction = context.op === "pageload";
        const sentryTraceMetaTagValue = isPageloadTransaction ? getMetaContent("sentry-trace") : null;
        const baggageMetaTagValue = isPageloadTransaction ? getMetaContent("baggage") : null;
        const traceParentData = sentryTraceMetaTagValue ? extractTraceparentData(sentryTraceMetaTagValue) : void 0;
        const dynamicSamplingContext = baggageMetaTagValue ? baggageHeaderToDynamicSamplingContext(baggageMetaTagValue) : void 0;
        const expandedContext = {
          ...context,
          ...traceParentData,
          metadata: {
            ...context.metadata,
            dynamicSamplingContext: traceParentData && !dynamicSamplingContext ? {} : dynamicSamplingContext
          },
          trimEnd: true
        };
        const modifiedContext = typeof beforeNavigate === "function" ? beforeNavigate(expandedContext) : expandedContext;
        const finalContext = modifiedContext === void 0 ? { ...expandedContext, sampled: false } : modifiedContext;
        finalContext.metadata = finalContext.name !== expandedContext.name ? { ...finalContext.metadata, source: "custom" } : finalContext.metadata;
        if (finalContext.sampled === false) {
          (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.log(`[Tracing] Will not send ${finalContext.op} transaction because of beforeNavigate.`);
        }
        (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.log(`[Tracing] Starting ${finalContext.op} transaction on scope`);
        const hub = this._getCurrentHub();
        const { location } = WINDOW;
        const idleTransaction = startIdleTransaction(
          hub,
          finalContext,
          idleTimeout,
          finalTimeout,
          true,
          { location },
          heartbeatInterval
        );
        idleTransaction.registerBeforeFinishCallback((transaction) => {
          addPerformanceEntries(transaction);
        });
        return idleTransaction;
      }
    }
    function getMetaContent(metaName) {
      const metaTag = getDomElement(`meta[name=${metaName}]`);
      return metaTag ? metaTag.getAttribute("content") : null;
    }
    if (typeof __SENTRY_TRACING__ === "undefined" || __SENTRY_TRACING__) {
      addExtensionMethods();
    }
    function isGlobalObj(obj) {
      return obj && obj.Math == Math ? obj : void 0;
    }
    const GLOBAL_OBJ = typeof globalThis == "object" && isGlobalObj(globalThis) || typeof window == "object" && isGlobalObj(window) || typeof self == "object" && isGlobalObj(self) || typeof global == "object" && isGlobalObj(global) || function() {
      return this;
    }() || {};
    function getGlobalSingleton(name, creator, obj) {
      const gbl = obj || GLOBAL_OBJ;
      const __SENTRY__ = gbl.__SENTRY__ = gbl.__SENTRY__ || {};
      const singleton = __SENTRY__[name] || (__SENTRY__[name] = creator());
      return singleton;
    }
    const PREFIX = "Sentry Logger ";
    const CONSOLE_LEVELS = ["debug", "info", "warn", "error", "log", "assert", "trace"];
    function consoleSandbox(callback) {
      if (!("console" in GLOBAL_OBJ)) {
        return callback();
      }
      const originalConsole = GLOBAL_OBJ.console;
      const wrappedLevels = {};
      CONSOLE_LEVELS.forEach((level) => {
        const originalWrappedFunc = originalConsole[level] && originalConsole[level].__sentry_original__;
        if (level in originalConsole && originalWrappedFunc) {
          wrappedLevels[level] = originalConsole[level];
          originalConsole[level] = originalWrappedFunc;
        }
      });
      try {
        return callback();
      } finally {
        Object.keys(wrappedLevels).forEach((level) => {
          originalConsole[level] = wrappedLevels[level];
        });
      }
    }
    function makeLogger() {
      let enabled = false;
      const logger2 = {
        enable: () => {
          enabled = true;
        },
        disable: () => {
          enabled = false;
        }
      };
      if (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) {
        CONSOLE_LEVELS.forEach((name) => {
          logger2[name] = (...args) => {
            if (enabled) {
              consoleSandbox(() => {
                GLOBAL_OBJ.console[name](`${PREFIX}[${name}]:`, ...args);
              });
            }
          };
        });
      } else {
        CONSOLE_LEVELS.forEach((name) => {
          logger2[name] = () => void 0;
        });
      }
      return logger2;
    }
    if (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) {
      getGlobalSingleton("logger", makeLogger);
    } else {
      makeLogger();
    }
    function safeJoin(input, delimiter) {
      if (!Array.isArray(input)) {
        return "";
      }
      const output = [];
      for (let i = 0; i < input.length; i++) {
        const value = input[i];
        try {
          output.push(String(value));
        } catch (e) {
          output.push("[value cannot be serialized]");
        }
      }
      return output.join(delimiter);
    }
    function fill(source, name, replacementFactory) {
      if (!(name in source)) {
        return;
      }
      const original = source[name];
      const wrapped = replacementFactory(original);
      if (typeof wrapped === "function") {
        try {
          markFunctionWrapped(wrapped, original);
        } catch (_Oo) {
        }
      }
      source[name] = wrapped;
    }
    function addNonEnumerableProperty(obj, name, value) {
      Object.defineProperty(obj, name, {
        value,
        writable: true,
        configurable: true
      });
    }
    function markFunctionWrapped(wrapped, original) {
      const proto = original.prototype || {};
      wrapped.prototype = original.prototype = proto;
      addNonEnumerableProperty(wrapped, "__sentry_original__", original);
    }
    const validSeverityLevels = ["fatal", "error", "warning", "log", "info", "debug"];
    function severityLevelFromString(level) {
      return level === "warn" ? "warning" : validSeverityLevels.includes(level) ? level : "log";
    }
    class CaptureConsole {
      static __initStatic() {
        this.id = "CaptureConsole";
      }
      __init() {
        this.name = CaptureConsole.id;
      }
      __init2() {
        this._levels = CONSOLE_LEVELS;
      }
      constructor(options = {}) {
        CaptureConsole.prototype.__init.call(this);
        CaptureConsole.prototype.__init2.call(this);
        if (options.levels) {
          this._levels = options.levels;
        }
      }
      setupOnce(_, getCurrentHub2) {
        if (!("console" in GLOBAL_OBJ)) {
          return;
        }
        this._levels.forEach((level) => {
          if (!(level in GLOBAL_OBJ.console)) {
            return;
          }
          fill(GLOBAL_OBJ.console, level, (originalConsoleMethod) => (...args) => {
            const hub = getCurrentHub2();
            if (hub.getIntegration(CaptureConsole)) {
              hub.withScope((scope) => {
                scope.setLevel(severityLevelFromString(level));
                scope.setExtra("arguments", args);
                scope.addEventProcessor((event) => {
                  event.logger = "console";
                  return event;
                });
                let message = safeJoin(args, " ");
                if (level === "assert") {
                  if (args[0] === false) {
                    message = `Assertion failed: ${safeJoin(args.slice(1), " ") || "console.assert"}`;
                    scope.setExtra("arguments", args.slice(1));
                    hub.captureMessage(message);
                  }
                } else if (level === "error" && args[0] instanceof Error) {
                  hub.captureException(args[0]);
                } else {
                  hub.captureMessage(message);
                }
              });
            }
            if (originalConsoleMethod) {
              originalConsoleMethod.apply(GLOBAL_OBJ.console, args);
            }
          });
        });
      }
    }
    CaptureConsole.__initStatic();
    const SentryConfig = {
      key: "https://6077af841fa940379f007d6cf64b488b@o4504111096004608.ingest.sentry.io/4504111104720896",
      sampleRate: 0.15
    };
    const main = "";
    const app = createApp(App);
    app.component("QuizQuestion", QuizQuestion).component("QuizSuggestion", QuizSuggestion).component("QuizOption", QuizOption).component("HotkeyLabel", HotkeyLabel).component("LerCoin", LerCoin).component("LerHeart", LerHeart).component("TopRowView", TopRowView).component("CollectAfterGame", CollectAfterGame).component(index.name, index);
    app.config.errorHandler = (err, instance, info) => {
      console.error("GEH", err, info);
    };
    init({
      app,
      dsn: SentryConfig.key,
      integrations: [
        new CaptureConsole({
          levels: ["error"]
        }),
        new BrowserTracing({
          tracingOrigins: [
            "localhost",
            "hepmnpdgpljeekpkccemnnoajoombagagpkcncca",
            /^\//
          ]
        })
      ],
      tracesSampleRate: SentryConfig.sampleRate
    });
    app.mount("#app");
  }
});
export default require_index_ed96434e();
