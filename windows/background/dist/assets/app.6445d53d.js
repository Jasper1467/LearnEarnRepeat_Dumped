var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_app_6445d53d = __commonJS({
  "assets/app.6445d53d.js"(exports, module) {
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
    const kWindowNames = {
      BACKGROUND: "background",
      DESKTOP: "desktop",
      IN_GAME: "in_game"
    };
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
    class RunningGameService {
      constructor() {
        this._gameRunningChangedListeners = [];
        this._onGameInfoUpdatedBound = this._onGameInfoUpdated.bind(this);
        this.curGameId = null;
        this.prevGameId = null;
        this.isRunningCached = null;
        overwolf.games.onGameInfoUpdated.removeListener(this._onGameInfoUpdatedBound);
        overwolf.games.onGameInfoUpdated.addListener(this._onGameInfoUpdatedBound);
      }
      _onGameInfoUpdated(event) {
        if (event && (event.runningChanged || event.gameChanged)) {
          const isRunning = event.gameInfo && event.gameInfo.isRunning;
          const gameId = event && event.gameInfo && event.gameInfo.classId;
          this._notifyRunningChanged(event, isRunning, gameId);
        }
      }
      _notifyRunningChanged(event, isRunning, gameId) {
        console.log("_onGameInfoUpdated", event);
        for (let listener of this._gameRunningChangedListeners) {
          listener(isRunning, gameId);
        }
      }
      _updateInternalVars(runningGameInfo) {
        const isRunning = runningGameInfo && runningGameInfo.isRunning;
        const gameId = isRunning ? runningGameInfo && runningGameInfo.classId : null;
        if (gameId !== this.prevGameId) {
          this.prevGameId = this.curGameId;
        }
        this.curGameId = gameId;
        let prevRunning = this.isRunningCached;
        this.isRunningCached = isRunning;
        if (this.isRunningCached !== prevRunning) {
          setTimeout(() => this._notifyRunningChanged("_updateInternalVars", this.isRunningCached, this.curGameId), 50);
        }
      }
      isGameRunning() {
        console.log(`running-game-service isGameRunning.1`);
        return new Promise((resolve) => {
          overwolf.games.getRunningGameInfo((runningGameInfo) => {
            this._updateInternalVars(runningGameInfo);
            console.log(`running-game-service isGameRunning.2`, this.isRunningCached);
            resolve({ gameId: this.curGameId, isRunning: this.isRunningCached });
          });
        });
      }
      getRunningGameInfo() {
        return new Promise((resolve) => {
          overwolf.games.getRunningGameInfo((runningGameInfo) => {
            this._updateInternalVars(runningGameInfo);
            resolve(runningGameInfo);
          });
        });
      }
      async getCurrentRunningGameId() {
        await this.isGameRunning();
        return this.curGameId;
      }
      addGameRunningChangedListener(callback) {
        this._gameRunningChangedListeners.push(callback);
      }
    }
    const kEventKeys = {
      APP_NETWORK_CHANGE: "APP_NETWORK_CHANGE",
      HOTKEY_PRESSED: "HOTKEY_PRESSED",
      UPDATE_TO_STATE: "UPDATE_TO_STATE",
      STORE_DATA_UPDATE: "STORE_DATA_UPDATE"
    };
    const kStores = {
      USER: "USER",
      CLOCK: "CLOCK",
      STATE: "STATE",
      MODAL_STATE: "MODAL_STATE",
      ERROR_MESSAGE: "ERROR_MESSAGE"
    };
    class StateHolderService {
      constructor() {
        this.state = {};
        Object.keys(kStores).forEach((store) => {
          this.state[store] = [];
        });
      }
      get(store) {
        return this.state[store];
      }
      set(store, value) {
        this.state[store] = value;
        window.owEventBus.trigger(kEventKeys.STORE_DATA_UPDATE, { store, value });
      }
    }
    class WindowsService {
      static obtainWindow(name) {
        return new Promise((resolve, reject) => {
          overwolf.windows.obtainDeclaredWindow(name, (result) => {
            if (result.success) {
              resolve(result);
            } else {
              console.warn("WindowsService.obtainWindow(): error:", name, result);
              reject(new Error(result.error));
            }
          });
        });
      }
      static getCurrentWindow() {
        return new Promise((resolve, reject) => {
          overwolf.windows.getCurrentWindow((result) => {
            if (result.success) {
              resolve(result);
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
        return new Promise((resolve, reject) => {
          overwolf.windows.restore(window2.id, (result) => {
            if (result.success) {
              resolve();
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
        return new Promise((resolve, reject) => {
          overwolf.windows.hide(window2.id, (result) => {
            if (result.success) {
              resolve();
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
        return new Promise((resolve, reject) => {
          overwolf.windows.minimize(window2.id, (result) => {
            if (result.success) {
              resolve();
            } else {
              console.warn("WindowsService.minimize(): error:", name, result);
              reject(new Error(result.error));
            }
          });
        });
      }
      static async maximize(name) {
        const { window: window2 } = await WindowsService.obtainWindow(name);
        return new Promise((resolve, reject) => {
          overwolf.windows.maximize(window2.id, (result) => {
            if (result.success) {
              resolve();
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
        await new Promise((resolve) => overwolf.windows.close(window2.id, resolve));
      }
      static async changePosition(name, left, top) {
        const { window: window2 } = await WindowsService.obtainWindow(name);
        return new Promise((resolve, reject) => {
          overwolf.windows.changePosition(window2.id, left, top, (result) => {
            if (result && result.success) {
              resolve(result);
            } else {
              console.warn("WindowsService.changePosition(): error:", name, result);
              reject(new Error(result.error));
            }
          });
        });
      }
      static getWindowState(name) {
        return new Promise((resolve, reject) => {
          overwolf.windows.getWindowState(name, (result) => {
            if (result.success) {
              resolve(result.window_state_ex);
            } else {
              console.warn("WindowsService.getWindowState(): error:", name, result);
              reject(new Error(result.error));
            }
          });
        });
      }
      static async setTopmost(name, shouldBeTopmost) {
        const { window: window2 } = await WindowsService.obtainWindow(name);
        return new Promise((resolve, reject) => {
          overwolf.windows.setTopmost(window2.id, shouldBeTopmost, (result) => {
            if (result.success) {
              resolve(result);
            } else {
              console.warn("WindowsService.setTopmost(): error:", name, result);
              reject(new Error(result.error));
            }
          });
        });
      }
      static async bringToFront(name, grabFocus = false) {
        const { window: window2 } = await WindowsService.obtainWindow(name);
        return new Promise((resolve, reject) => {
          overwolf.windows.bringToFront(window2.id, grabFocus, (result) => {
            if (result.success) {
              resolve(result);
            } else {
              console.warn("WindowsService.bringToFront(): error:", name, result);
              reject(new Error(result.error));
            }
          });
        });
      }
      static getWindowsStates() {
        return new Promise((resolve, reject) => {
          overwolf.windows.getWindowsStates((state) => {
            if (state.success) {
              resolve(state.resultV2);
            } else {
              reject(state);
            }
          });
        });
      }
      static getMonitorsList() {
        return new Promise((resolve, reject) => {
          overwolf.utils.getMonitorsList((result) => {
            if (result && result.success && result.displays) {
              resolve(result.displays);
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
    class HotkeysService {
      constructor() {
        this.toggleHotkeys = {};
        this.holdHotkeys = {};
        this.init();
      }
      init() {
        overwolf.settings.hotkeys.onPressed.addListener((e) => {
          if (e.name in this.toggleHotkeys) {
            const listener = this.toggleHotkeys[e.name];
            listener();
          }
        });
        overwolf.settings.hotkeys.onHold.addListener((e) => {
          if (e.name in this.holdHotkeys) {
            const listener = this.holdHotkeys[e.name];
            listener(e.state);
          }
        });
      }
      _getHotkey(hotkeyId, gameId, callback) {
        overwolf.settings.hotkeys.get((result) => {
          if (result && result.success) {
            if (gameId) {
              if (result.games && result.games[gameId] && result.games[gameId].length) {
                const hotkey = result.games[gameId].find((hotkey2) => {
                  return hotkey2.name === hotkeyId;
                });
                if (hotkey) {
                  callback(hotkey.binding);
                  return;
                }
              }
            }
            const globalHotkey = result.globals.find((hotkey) => {
              return hotkey.name === hotkeyId;
            });
            if (globalHotkey) {
              callback(globalHotkey.binding);
              return;
            }
            callback(null);
          } else {
            setTimeout(() => this._getHotkey(hotkeyId, gameId, callback), 2e3);
          }
        });
      }
      setToggleHotkeyListener(hotkeyId, action) {
        this.toggleHotkeys[hotkeyId] = action;
      }
      setHoldHotkeyListener(hotkeyId, action) {
        this.holdHotkeys[hotkeyId] = action;
      }
      getHotkey(hotkeyId, gameId) {
        return new Promise((resolve) => {
          this._getHotkey(hotkeyId, gameId, resolve);
        });
      }
      assignHotkey(hotkeyNewData) {
        return new Promise((resolve) => {
          overwolf.settings.hotkeys.assign(hotkeyNewData, (result) => {
            resolve(result && result.success);
          });
        });
      }
      addHotkeyChangeListener(listener) {
        overwolf.settings.hotkeys.onChanged.addListener(listener);
      }
    }
    const REGISTER_RETRY_TIMEOUT = 1e4;
    class GepService {
      static setRequiredFeatures(features, eventsListener, infoListener) {
        if (!features.length)
          this.setListeners(eventsListener, infoListener);
        else {
          overwolf.games.events.setRequiredFeatures(features, (response) => {
            if (response.success) {
              console.log(`Successfully registered to GEP.`);
              this.setListeners(eventsListener, infoListener);
            } else {
              console.log(`Failed to register to GEP: ${response.error}. Retrying in ${REGISTER_RETRY_TIMEOUT / 1e3}s...`);
              setTimeout(() => {
                GepService.setRequiredFeatures(
                  features,
                  eventsListener,
                  infoListener
                );
              }, REGISTER_RETRY_TIMEOUT);
            }
          });
        }
      }
      static setListeners(eventsListener, infoListener) {
        overwolf.games.events.onNewEvents.removeListener(eventsListener);
        overwolf.games.events.onNewEvents.addListener(eventsListener);
        overwolf.games.events.onInfoUpdates2.removeListener(infoListener);
        overwolf.games.events.onInfoUpdates2.addListener(infoListener);
      }
    }
    class EventBus {
      constructor() {
        this._listeners = {};
        this._sequence = 1;
        this._owners = {};
      }
      addListener(eventHandler) {
        const key = `l_${this._sequence++}`;
        this._listeners[key] = eventHandler;
        return key;
      }
      addOwnedListener(ownerName, eventHandler) {
        if (!this._owners[ownerName]) {
          this._owners[ownerName] = [];
        }
        const listener = this.addListener(eventHandler);
        this._owners[ownerName].push(listener);
        return listener;
      }
      removeOwner(ownerName) {
        if (!this._owners[ownerName])
          return;
        this._owners[ownerName].forEach((listener) => this.removeListener(listener));
        delete this._owners[ownerName];
      }
      removeListener(key) {
        delete this._listeners[key];
      }
      trigger(eventName, eventValue) {
        Object.values(this._listeners).forEach((listener) => listener(eventName, eventValue));
      }
    }
    const kGamesFeatures = /* @__PURE__ */ new Map([
      [
        22092,
        []
      ],
      [
        21652,
        []
      ],
      [
        21566,
        [
          "death",
          "match_state"
        ]
      ],
      [
        21216,
        [
          "kill",
          "killed",
          "killer",
          "revived",
          "death",
          "match",
          "match_info",
          "rank",
          "me",
          "phase",
          "location",
          "team",
          "items",
          "counters"
        ]
      ],
      [
        7764,
        [
          "death",
          "round_start",
          "match_start",
          "match_end",
          "team_round_win",
          "player_activity_change",
          "team_set",
          "info",
          "scene",
          "match_info",
          "replay"
        ]
      ],
      [
        5426,
        [
          "live_client_data",
          "matchState",
          "match_info",
          "death",
          "respawn",
          "abilities",
          "kill",
          "assist",
          "gold",
          "minions",
          "summoner_info",
          "gameMode",
          "teams",
          "level",
          "announcer",
          "counters",
          "damage",
          "heal"
        ]
      ],
      [
        21634,
        [
          "match_info",
          "game_info"
        ]
      ],
      [
        8032,
        [
          "game_info",
          "match_info"
        ]
      ],
      [
        10844,
        [
          "game_info",
          "match_info",
          "kill",
          "death"
        ]
      ],
      [
        10906,
        [
          "kill",
          "revived",
          "death",
          "killer",
          "match",
          "match_info",
          "rank",
          "counters",
          "location",
          "me",
          "team",
          "phase",
          "map",
          "roster"
        ]
      ],
      [
        10826,
        [
          "game_info",
          "match",
          "match_info",
          "roster",
          "kill",
          "death",
          "me",
          "defuser"
        ]
      ],
      [
        21404,
        [
          "game_info",
          "match_info",
          "player",
          "location",
          "match",
          "feed",
          "connection",
          "kill",
          "death",
          "portal",
          "assist"
        ]
      ],
      [
        7212,
        [
          "kill",
          "death",
          "me",
          "match_info"
        ]
      ],
      [
        21640,
        [
          "me",
          "game_info",
          "match_info",
          "kill",
          "death",
          "gep_internal"
        ]
      ],
      [
        7314,
        [
          "game_state_changed",
          "match_state_changed",
          "match_detected",
          "daytime_changed",
          "clock_time_changed",
          "ward_purchase_cooldown_changed",
          "match_ended",
          "kill",
          "assist",
          "death",
          "cs",
          "xpm",
          "gpm",
          "gold",
          "hero_leveled_up",
          "hero_respawned",
          "hero_buyback_info_changed",
          "hero_boughtback",
          "hero_health_mana_info",
          "hero_status_effect_changed",
          "hero_attributes_skilled",
          "hero_ability_skilled",
          "hero_ability_used",
          "hero_ability_cooldown_changed",
          "hero_ability_changed",
          "hero_item_cooldown_changed",
          "hero_item_changed",
          "hero_item_used",
          "hero_item_consumed",
          "hero_item_charged",
          "match_info",
          "roster",
          "party",
          "error",
          "hero_pool",
          "me",
          "game"
        ]
      ],
      [
        21626,
        [
          "match_info",
          "game_info",
          "kill",
          "death"
        ]
      ],
      [
        8954,
        [
          "game_info",
          "match_info"
        ]
      ],
      [
        10798,
        [
          "stats",
          "roster",
          "match",
          "me",
          "match_info",
          "death",
          "game_info"
        ]
      ]
    ]);
    const kGameClassIds = Array.from(kGamesFeatures.keys());
    const props = {
      gamePropsPaths: {
        "21640": {
          valorantGameMode: "info.match_info.game_mode.mode"
        }
      }
    };
    const hkOk = "learn_earn_repeat_ok";
    const hkCancel = "learn_earn_repeat_cancel";
    const hkA1 = "learn_earn_repeat_a1";
    const hkA2 = "learn_earn_repeat_a2";
    const hkA3 = "learn_earn_repeat_a3";
    const hkA4 = "learn_earn_repeat_a4";
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
    const kEventOwners = {
      inGameApp: "ingame.app",
      desktopApp: "desktop.app"
    };
    const kStatesConfig = {
      "*": {
        processUpdate: {
          "launchedWithGameEvent": kAppStates.IN_NO_EVENTS_GAME_QUESTION_SUGGESTION,
          "gameProcessStart": kAppStates.IN_NO_EVENTS_GAME_QUESTION_SUGGESTION,
          "gameProcessEnd": kAppStates.DESKTOP_AFTER_GAME
        },
        firstQuestionDelay: 10,
        questionInterval: 999999999
      },
      "5426": {
        processUpdate: {
          "launchedWithGameEvent": kAppStates.IN_GAME_QUESTION_SUGGESTION,
          "gameProcessStart": kAppStates.IN_GAME_QUESTION_SUGGESTION,
          "gameProcessEnd": kAppStates.DESKTOP_AFTER_GAME
        },
        infoUpdate: null,
        eventUpdate: {
          "event.name": {
            "matchEnd": null
          }
        }
      },
      "6738": {
        processUpdate: {
          "launchedWithGameEvent": kAppStates.IN_NO_EVENTS_GAME_QUESTION_SUGGESTION,
          "gameProcessStart": kAppStates.IN_NO_EVENTS_GAME_QUESTION_SUGGESTION,
          "gameProcessEnd": kAppStates.DESKTOP_AFTER_GAME
        },
        firstQuestionDelay: 5,
        questionInterval: 600
      },
      "21652": {
        processUpdate: {
          "launchedWithGameEvent": kAppStates.IN_NO_EVENTS_GAME_QUESTION_SUGGESTION,
          "gameProcessStart": kAppStates.IN_NO_EVENTS_GAME_QUESTION_SUGGESTION,
          "gameProcessEnd": kAppStates.DESKTOP_AFTER_GAME
        },
        firstQuestionDelay: 1
      },
      "21566": {
        processUpdate: {
          "gameProcessEnd": kAppStates.DESKTOP_AFTER_GAME
        },
        infoUpdate: {
          "info.game_info.phase": {}
        },
        eventUpdate: {
          "name": {
            "death": kAppStates.IN_GAME_QUESTION_SUGGESTION,
            "match_end": kAppStates.IN_GAME_QUESTION_SUGGESTION
          },
          "event.name": {
            "death": kAppStates.IN_GAME_QUESTION_SUGGESTION,
            "match_end": kAppStates.IN_GAME_QUESTION_SUGGESTION
          }
        }
      },
      "7764": {
        processUpdate: {
          "launchedWithGameEvent": kAppStates.IN_GAME_HIDDEN,
          "gameProcessStart": kAppStates.IN_GAME_HIDDEN,
          "gameProcessEnd": kAppStates.DESKTOP_AFTER_GAME
        },
        infoUpdate: {
          "info.scene.scene": {
            "LoadingScreen": kAppStates.IN_GAME_QUESTION_SUGGESTION,
            "ClientLoading": kAppStates.IN_GAME_QUESTION_SUGGESTION
          },
          "info.round.phase": {
            "gameover": kAppStates.IN_GAME_QUESTION_SUGGESTION
          }
        },
        eventUpdate: {
          "name": {
            "death": kAppStates.IN_GAME_QUESTION_SUGGESTION,
            "match_end": kAppStates.IN_GAME_QUESTION_SUGGESTION
          },
          "event.name": {
            "death": kAppStates.IN_GAME_QUESTION_SUGGESTION,
            "match_end": kAppStates.IN_GAME_QUESTION_SUGGESTION
          }
        }
      },
      "21640": {
        processUpdate: {
          "launchedWithGameEvent": kAppStates.IN_GAME_HIDDEN,
          "gameProcessStart": kAppStates.IN_GAME_HIDDEN,
          "gameProcessEnd": kAppStates.DESKTOP_AFTER_GAME
        },
        infoUpdate: {
          "info.game_info.scene": {
            "CharacterSelectPersistentLevel": kAppStates.IN_GAME_QUESTION_SUGGESTION
          }
        },
        eventUpdate: {
          "name": {
            "death": {
              "conditions": [{ key: "valorantGameMode", value: ["deathmatch", "escalation"], operator: "nin" }],
              "targetState": kAppStates.IN_GAME_QUESTION_SUGGESTION
            },
            "match_end": kAppStates.IN_GAME_QUESTION_SUGGESTION
          },
          "event.name": {
            "death": {
              "conditions": [{ key: "valorantGameMode", value: ["deathmatch", "escalation"], operator: "nin" }],
              "targetState": kAppStates.IN_GAME_QUESTION_SUGGESTION
            },
            "match_end": kAppStates.IN_GAME_QUESTION_SUGGESTION
          }
        }
      },
      "21216": {
        processUpdate: {
          "launchedWithGameEvent": null,
          "gameProcessStart": null,
          "gameProcessEnd": kAppStates.DESKTOP_AFTER_GAME
        },
        infoUpdate: {
          "info.match_info.partyID": {
            "#EXISTS#": kAppStates.IN_GAME_QUESTION_SUGGESTION
          },
          "info.game_info.phase": {
            "loading_screen": kAppStates.IN_GAME_QUESTION_SUGGESTION
          }
        },
        eventUpdate: {
          "event.name": {
            "matchEnd": null
          }
        }
      }
    };
    class UtilsService {
      static getObjNestedValue(obj, path) {
        return path.split(".").reduce((p, c) => {
          if (!p)
            return null;
          try {
            const r = JSON.parse(p[c]);
            return r || null;
          } catch (e) {
            return p[c] || null;
          }
        }, obj);
      }
      static async waitForLoadingToggleOff(loadingStartTime) {
        const minTime = 400;
        const elapsedTime = Date.now() - loadingStartTime;
        if (elapsedTime < minTime) {
          await new Promise((resolve) => setTimeout(resolve, minTime - elapsedTime));
        }
      }
      static replaceAssetPathToAbsoluteLocalPath(assetPath) {
        if (assetPath.startsWith("./../assets/")) {
          return assetPath.replace(
            "./../assets/",
            "overwolf-extension://hepmnpdgpljeekpkccemnnoajoombagagpkcncca/windows/desktop/static-assets/"
          );
        } else if (assetPath.startsWith("../static-assets")) {
          return assetPath.replace(
            "../static-assets/",
            "overwolf-extension://hepmnpdgpljeekpkccemnnoajoombagagpkcncca/windows/desktop/static-assets/"
          );
        }
        return assetPath;
      }
    }
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
    const kQuizType = {
      REGULAR: "REGULAR",
      BUY_LIVES: "BUY_LIVES",
      BONUS_FREE: "BONUS_FREE"
    };
    const TIMEOUT = 5e3;
    const RELOGIN_URL = "/api/users/relogin";
    class ApiService {
      constructor(axios2) {
        this.axios = axios2;
        axios2.defaults.baseURL = kConsts.baseUrl;
        axios2.defaults.timeout = TIMEOUT;
        const self2 = this;
        function retryPolicy(axios3) {
          return async function(err) {
            var _a;
            console.warn("RETRY POLICY");
            let { config, message } = err;
            if (!config || !config.retry) {
              return Promise.reject(err);
            }
            if (!(message.includes("timeout") || message.includes("Network Error") || message.includes("401"))) {
              return Promise.reject(err);
            }
            const token = await window.repo.get(kRepoKeys.AUTH_TOKEN);
            if (((_a = err == null ? void 0 : err.response) == null ? void 0 : _a.status) === 401 && token && config.url !== RELOGIN_URL) {
              await self2.relogin();
              const newToken = await window.repo.get(kRepoKeys.AUTH_TOKEN);
              if (newToken) {
                config.headers = config.headers || {};
                config.headers["Authorization"] = newToken;
              }
            }
            config.geniz2 = 1;
            config.retry -= 1;
            const delayRetryRequest = new Promise((resolve) => {
              setTimeout(() => {
                console.log("retry the request", config.url);
                resolve();
              }, config.retryDelay || 1e3);
            });
            return delayRetryRequest.then(() => axios3(config));
          };
        }
        axios2.interceptors.response.use((response) => response, retryPolicy(axios2));
        axios2.interceptors.request.use(async function(config) {
          config.headers["Content-Type"] = "application/json";
          config.headers["x-ler-tag"] = "lerlerler";
          const token = await window.repo.get(kRepoKeys.AUTH_TOKEN);
          if (token) {
            config.headers["Authorization"] = token;
          }
          return config;
        });
        this.lastPurchaseTime = null;
      }
      async getConfig(retryPolicy) {
        const config = {};
        const token = await window.repo.get(kRepoKeys.AUTH_TOKEN);
        config.headers = {};
        config.headers["Content-Type"] = "application/json";
        config.headers["x-ler-tag"] = "lerlerler";
        if (token) {
          config.headers["Authorization"] = token;
        }
        config.retry = (retryPolicy == null ? void 0 : retryPolicy.retry) || 3;
        config.retryDelay = (retryPolicy == null ? void 0 : retryPolicy.retryDelay) || 3e3;
        return config;
      }
      async executeAxiosRequest(url, body, retryPolicy) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const config = await this.getConfig(retryPolicy);
        const source = this.axios.CancelToken.source();
        const timeout = setTimeout(() => {
          source.cancel();
        }, TIMEOUT);
        try {
          const response = body ? await this.axios.post(url, body, config) : await this.axios.get(url, config);
          clearTimeout(timeout);
          if (this.offline) {
            window.owEventBus.trigger(kEventKeys.APP_NETWORK_CHANGE, "online");
            this.offline = false;
          }
          return response;
        } catch (err) {
          const token = await window.repo.get(kRepoKeys.AUTH_TOKEN);
          if (((_a = err == null ? void 0 : err.response) == null ? void 0 : _a.status) === 401 && token && url !== RELOGIN_URL) {
            await this.relogin();
          }
          if ((err == null ? void 0 : err.code) === "ERR_NETWORK") {
            window.owEventBus.trigger(kEventKeys.APP_NETWORK_CHANGE, "offline");
            this.offline = true;
          } else if (this.offline) {
            window.owEventBus.trigger(kEventKeys.APP_NETWORK_CHANGE, "online");
            this.offline = false;
          }
          const errorString = JSON.stringify(err);
          const errorMessage = ((_d = (_c = (_b = err == null ? void 0 : err.response) == null ? void 0 : _b.data) == null ? void 0 : _c.errorMessage) == null ? void 0 : _d.message) || ((_f = (_e = err == null ? void 0 : err.response) == null ? void 0 : _e.data) == null ? void 0 : _f.errorMessage) || (err == null ? void 0 : err.message) || (err == null ? void 0 : err.errorMessage) || ((_g = err == null ? void 0 : err.response) == null ? void 0 : _g.data);
          console.error(`${url}: ${errorMessage} | JSON.stringify(err): ${errorString}`);
          return { errorMessage: errorMessage || errorString, data: (_h = err == null ? void 0 : err.response) == null ? void 0 : _h.data };
        }
      }
      async ping() {
        const config = await this.getConfig();
        const source = this.axios.CancelToken.source();
        const timeout = setTimeout(() => {
          source.cancel();
        }, TIMEOUT);
        try {
          const randomString = Math.random().toString(36).substring(2, 15);
          await this.axios.head(`/ping?a=${randomString}`, config);
          clearTimeout(timeout);
          return true;
        } catch (err) {
          return (err == null ? void 0 : err.code) !== "ERR_NETWORK";
        }
      }
      async get(url) {
        return this.executeAxiosRequest(url);
      }
      async post(url, body = {}) {
        return this.executeAxiosRequest(url, body);
      }
      async getHeartsStatus() {
        try {
          const response = await this.post("/api/questions");
          if (response.data) {
            return response.data;
          } else {
            console.log(`getHeartsStatus Error no response.data`, response);
            return null;
          }
        } catch (err) {
          console.log(`getHeartsStatus Error: ${JSON.stringify(err)}`);
          return null;
        }
      }
      async acceptChallenge(quizType) {
        try {
          let url = "";
          console.log(`API: acceptChallenge: quizType: ${quizType}`);
          switch (quizType) {
            case kQuizType.REGULAR:
              url = "/api/questions";
              break;
            case kQuizType.BONUS_FREE:
              url = "/api/questions/bonus";
              break;
            case kQuizType.BUY_LIVES:
              url = "/api/questions/buy";
              break;
          }
          const response = await this.post(url);
          if (response.data) {
            let quizQuestionObject = response.data;
            quizQuestionObject.option1 = quizQuestionObject.options["0"];
            quizQuestionObject.option2 = quizQuestionObject.options["1"];
            quizQuestionObject.option3 = quizQuestionObject.options["2"];
            quizQuestionObject.option4 = quizQuestionObject.options["3"];
            quizQuestionObject.timeLimitMs = quizQuestionObject.time;
            quizQuestionObject.timeLimitForPopularMs = quizQuestionObject.time;
            return quizQuestionObject;
          } else {
            console.log(`acceptChallenge Error: no response.data`, response);
            return null;
          }
        } catch (err) {
          console.log(`acceptChallenge Error: ${JSON.stringify(err)}`);
          return null;
        }
      }
      async verifyEmail(code) {
        const response = await this.post("/api/users/verify-email", { code });
        this.handleToken(response);
        return response;
      }
      handleToken(response) {
        var _a, _b;
        if (((_a = response == null ? void 0 : response.data) == null ? void 0 : _a.token) && ((_b = response == null ? void 0 : response.data) == null ? void 0 : _b.expiresIn)) {
          window.repo.set(kRepoKeys.AUTH_TOKEN, response.data.token);
          window.repo.set(kRepoKeys.AUTH_EXPIRATION, response.data.expiresIn);
        } else if (!response.errorMessage) {
          response.errorMessage = "Token expected but wasn't found";
        }
      }
      async signupGuestUser(userId, machineId) {
        const response = await this.post("/users/signup", { userId, machineId });
        this.handleToken(response);
        return response;
      }
      async loginGuestUser(userId, machineId) {
        const response = await this.post("/users/login", { userId, machineId });
        this.handleToken(response);
        return response;
      }
      async relogin() {
        var _a, _b;
        const response = await this.get(RELOGIN_URL);
        if (!(((_a = response == null ? void 0 : response.data) == null ? void 0 : _a.token) && ((_b = response == null ? void 0 : response.data) == null ? void 0 : _b.expiresIn))) {
          await window.repo.remove(kRepoKeys.AUTH_TOKEN);
          await window.repo.remove(kRepoKeys.AUTH_EXPIRATION);
        } else {
          this.handleToken(response);
        }
        return response;
      }
      async completeRegistration(email, username) {
        return await this.post("/api/users/complete-registration", { username, email });
      }
      async manualSignup(email, username) {
        const response = await this.post("/users/manual-signup", { username, email });
        this.handleToken(response);
        return response;
      }
      storeTempToken(response) {
        var _a;
        const token = (_a = response == null ? void 0 : response.data) == null ? void 0 : _a.token;
        if (token) {
          if (this.tempTokenTimeoutId) {
            clearTimeout(this.tempTokenTimeoutId);
            this.tempTokenTimeoutId = null;
          }
          this.tempToken = token;
          this.tempTokenTimeoutId = setTimeout(() => {
            this.tempToken = null;
          }, 2.5 * 60 * 1e3);
        } else if (!(response == null ? void 0 : response.errorMessage)) {
          response.errorMessage = "Failed to login";
        }
      }
      clearTempToken() {
        if (this.tempTokenTimeoutId) {
          clearTimeout(this.tempTokenTimeoutId);
          this.tempTokenTimeoutId = null;
        }
        this.tempToken = null;
      }
      async usernameLogin(username) {
        const response = await this.post("/users/username-login", { username });
        this.storeTempToken(response);
        return response;
      }
      async emailLogin(email) {
        const response = await this.post("/users/email-login", { email });
        this.storeTempToken(response);
        return response;
      }
      async completeLoginByVerifyingPinCode(code) {
        if (!this.tempToken) {
          return { errorMessage: "Pincode expired, send a new one" };
        }
        const response = await this.post(`/users/recover/${this.tempToken}`, { code });
        if (!response.errorMessage) {
          this.clearTempToken();
        }
        this.handleToken(response);
        return response;
      }
      async sendPopularAnswer(questionId, option) {
        try {
          const response = await this.post("/api/questions/answer2", {
            question: questionId,
            answer: option
          });
          return response.data;
        } catch (err) {
          console.log(`sendPopularAnswer Error: ${JSON.stringify(err)}`);
          return null;
        }
      }
      async sendAnswer(questionId, option, trigger) {
        try {
          const response = await this.post("/api/questions/answer1", {
            question: questionId,
            answer: option
          });
          return response.data;
        } catch (err) {
          console.log(`sendAnswer Error: ${JSON.stringify(err)}`);
          return null;
        }
      }
      async getMe() {
        try {
          const response = await this.get("/api/users/me");
          console.log(response);
          return response.data;
        } catch (err) {
          console.log(`getMe Error: ${JSON.stringify(err)}`);
          return null;
        }
      }
      async getMyTicketsCount() {
        const response = await this.get("/api/users/ticketCount");
        return response.data;
      }
      async collectReward(qId) {
        try {
          const response = await this.post(`/api/questions/${qId}/claim`, {});
          return response.data;
        } catch (err) {
          console.log(`collectReward Error: ${JSON.stringify(err)}`);
          return null;
        }
      }
      async getPendingRewards() {
        try {
          const response = await this.get("/api/questions/pending");
          return response.data;
        } catch (err) {
          console.log(`getPendingRewards Error: ${JSON.stringify(err)}`);
          return null;
        }
      }
      async getRaffles() {
        let url = "/public/raffles.js";
        if (this.lastPurchaseTime && new Date().getTime() - this.lastPurchaseTime < 60 * 1e3) {
          url += `?lut=${this.lastPurchaseTime}`;
        }
        const response = await this.get(url);
        return response.data;
      }
      async getFaq() {
        let url = "/public/faq.js";
        const response = await this.get(url);
        return response.data;
      }
      async claimRaffleReward(ticketId, name, email) {
        return await this.post(`/api/raffles/${ticketId}/claim`, {
          claimInfo: {
            name,
            email
          }
        });
      }
      async getStore() {
        const response = await this.get("/public/store.js");
        return response.data;
      }
      async getVars() {
        var _a;
        const response = await this.get("/public/v.js");
        return (_a = response == null ? void 0 : response.data) == null ? void 0 : _a.vars;
      }
      async buyStoreItem(itemId, expectedPrice) {
        this.lastPurchaseTime = new Date().getTime();
        return await this.post(`/api/store/${itemId}/buy`, { expectedPrice });
      }
    }
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
    const kTriggers = {
      MOUSE_CLICK: "MOUSE_CLICK",
      HOTKEY_PRESSED: "HOTKEY_PRESSED",
      COUNTDOWN_END: "COUNTDOWN_END",
      GAME_EVENT: "GAME_EVENT",
      DOCK: "DOCK"
    };
    const SentryConfig = {
      key: "https://6077af841fa940379f007d6cf64b488b@o4504111096004608.ingest.sentry.io/4504111104720896",
      sampleRate: 0.15
    };
    function bind(fn, thisArg) {
      return function wrap2() {
        return fn.apply(thisArg, arguments);
      };
    }
    const { toString } = Object.prototype;
    const { getPrototypeOf } = Object;
    const kindOf = ((cache) => (thing) => {
      const str = toString.call(thing);
      return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
    })(/* @__PURE__ */ Object.create(null));
    const kindOfTest = (type) => {
      type = type.toLowerCase();
      return (thing) => kindOf(thing) === type;
    };
    const typeOfTest = (type) => (thing) => typeof thing === type;
    const { isArray } = Array;
    const isUndefined = typeOfTest("undefined");
    function isBuffer(val) {
      return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
    }
    const isArrayBuffer = kindOfTest("ArrayBuffer");
    function isArrayBufferView(val) {
      let result;
      if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
        result = ArrayBuffer.isView(val);
      } else {
        result = val && val.buffer && isArrayBuffer(val.buffer);
      }
      return result;
    }
    const isString$1 = typeOfTest("string");
    const isFunction = typeOfTest("function");
    const isNumber = typeOfTest("number");
    const isObject = (thing) => thing !== null && typeof thing === "object";
    const isBoolean = (thing) => thing === true || thing === false;
    const isPlainObject$1 = (val) => {
      if (kindOf(val) !== "object") {
        return false;
      }
      const prototype2 = getPrototypeOf(val);
      return (prototype2 === null || prototype2 === Object.prototype || Object.getPrototypeOf(prototype2) === null) && !(Symbol.toStringTag in val) && !(Symbol.iterator in val);
    };
    const isDate = kindOfTest("Date");
    const isFile = kindOfTest("File");
    const isBlob = kindOfTest("Blob");
    const isFileList = kindOfTest("FileList");
    const isStream = (val) => isObject(val) && isFunction(val.pipe);
    const isFormData = (thing) => {
      const pattern = "[object FormData]";
      return thing && (typeof FormData === "function" && thing instanceof FormData || toString.call(thing) === pattern || isFunction(thing.toString) && thing.toString() === pattern);
    };
    const isURLSearchParams = kindOfTest("URLSearchParams");
    const trim = (str) => str.trim ? str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
    function forEach(obj, fn, { allOwnKeys = false } = {}) {
      if (obj === null || typeof obj === "undefined") {
        return;
      }
      let i;
      let l;
      if (typeof obj !== "object") {
        obj = [obj];
      }
      if (isArray(obj)) {
        for (i = 0, l = obj.length; i < l; i++) {
          fn.call(null, obj[i], i, obj);
        }
      } else {
        const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
        const len = keys.length;
        let key;
        for (i = 0; i < len; i++) {
          key = keys[i];
          fn.call(null, obj[key], key, obj);
        }
      }
    }
    function findKey(obj, key) {
      key = key.toLowerCase();
      const keys = Object.keys(obj);
      let i = keys.length;
      let _key;
      while (i-- > 0) {
        _key = keys[i];
        if (key === _key.toLowerCase()) {
          return _key;
        }
      }
      return null;
    }
    const _global = (() => {
      if (typeof globalThis !== "undefined")
        return globalThis;
      return typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : global;
    })();
    const isContextDefined = (context) => !isUndefined(context) && context !== _global;
    function merge() {
      const { caseless } = isContextDefined(this) && this || {};
      const result = {};
      const assignValue = (val, key) => {
        const targetKey = caseless && findKey(result, key) || key;
        if (isPlainObject$1(result[targetKey]) && isPlainObject$1(val)) {
          result[targetKey] = merge(result[targetKey], val);
        } else if (isPlainObject$1(val)) {
          result[targetKey] = merge({}, val);
        } else if (isArray(val)) {
          result[targetKey] = val.slice();
        } else {
          result[targetKey] = val;
        }
      };
      for (let i = 0, l = arguments.length; i < l; i++) {
        arguments[i] && forEach(arguments[i], assignValue);
      }
      return result;
    }
    const extend = (a, b, thisArg, { allOwnKeys } = {}) => {
      forEach(b, (val, key) => {
        if (thisArg && isFunction(val)) {
          a[key] = bind(val, thisArg);
        } else {
          a[key] = val;
        }
      }, { allOwnKeys });
      return a;
    };
    const stripBOM = (content) => {
      if (content.charCodeAt(0) === 65279) {
        content = content.slice(1);
      }
      return content;
    };
    const inherits = (constructor, superConstructor, props2, descriptors2) => {
      constructor.prototype = Object.create(superConstructor.prototype, descriptors2);
      constructor.prototype.constructor = constructor;
      Object.defineProperty(constructor, "super", {
        value: superConstructor.prototype
      });
      props2 && Object.assign(constructor.prototype, props2);
    };
    const toFlatObject = (sourceObj, destObj, filter, propFilter) => {
      let props2;
      let i;
      let prop;
      const merged = {};
      destObj = destObj || {};
      if (sourceObj == null)
        return destObj;
      do {
        props2 = Object.getOwnPropertyNames(sourceObj);
        i = props2.length;
        while (i-- > 0) {
          prop = props2[i];
          if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
            destObj[prop] = sourceObj[prop];
            merged[prop] = true;
          }
        }
        sourceObj = filter !== false && getPrototypeOf(sourceObj);
      } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);
      return destObj;
    };
    const endsWith = (str, searchString, position) => {
      str = String(str);
      if (position === void 0 || position > str.length) {
        position = str.length;
      }
      position -= searchString.length;
      const lastIndex = str.indexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
    };
    const toArray = (thing) => {
      if (!thing)
        return null;
      if (isArray(thing))
        return thing;
      let i = thing.length;
      if (!isNumber(i))
        return null;
      const arr = new Array(i);
      while (i-- > 0) {
        arr[i] = thing[i];
      }
      return arr;
    };
    const isTypedArray = ((TypedArray) => {
      return (thing) => {
        return TypedArray && thing instanceof TypedArray;
      };
    })(typeof Uint8Array !== "undefined" && getPrototypeOf(Uint8Array));
    const forEachEntry = (obj, fn) => {
      const generator = obj && obj[Symbol.iterator];
      const iterator = generator.call(obj);
      let result;
      while ((result = iterator.next()) && !result.done) {
        const pair = result.value;
        fn.call(obj, pair[0], pair[1]);
      }
    };
    const matchAll = (regExp, str) => {
      let matches;
      const arr = [];
      while ((matches = regExp.exec(str)) !== null) {
        arr.push(matches);
      }
      return arr;
    };
    const isHTMLForm = kindOfTest("HTMLFormElement");
    const toCamelCase = (str) => {
      return str.toLowerCase().replace(
        /[_-\s]([a-z\d])(\w*)/g,
        function replacer(m, p1, p2) {
          return p1.toUpperCase() + p2;
        }
      );
    };
    const hasOwnProperty = (({ hasOwnProperty: hasOwnProperty2 }) => (obj, prop) => hasOwnProperty2.call(obj, prop))(Object.prototype);
    const isRegExp$1 = kindOfTest("RegExp");
    const reduceDescriptors = (obj, reducer) => {
      const descriptors2 = Object.getOwnPropertyDescriptors(obj);
      const reducedDescriptors = {};
      forEach(descriptors2, (descriptor, name) => {
        if (reducer(descriptor, name, obj) !== false) {
          reducedDescriptors[name] = descriptor;
        }
      });
      Object.defineProperties(obj, reducedDescriptors);
    };
    const freezeMethods = (obj) => {
      reduceDescriptors(obj, (descriptor, name) => {
        if (isFunction(obj) && ["arguments", "caller", "callee"].indexOf(name) !== -1) {
          return false;
        }
        const value = obj[name];
        if (!isFunction(value))
          return;
        descriptor.enumerable = false;
        if ("writable" in descriptor) {
          descriptor.writable = false;
          return;
        }
        if (!descriptor.set) {
          descriptor.set = () => {
            throw Error("Can not rewrite read-only method '" + name + "'");
          };
        }
      });
    };
    const toObjectSet = (arrayOrString, delimiter) => {
      const obj = {};
      const define = (arr) => {
        arr.forEach((value) => {
          obj[value] = true;
        });
      };
      isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));
      return obj;
    };
    const noop = () => {
    };
    const toFiniteNumber = (value, defaultValue) => {
      value = +value;
      return Number.isFinite(value) ? value : defaultValue;
    };
    const toJSONObject = (obj) => {
      const stack = new Array(10);
      const visit2 = (source, i) => {
        if (isObject(source)) {
          if (stack.indexOf(source) >= 0) {
            return;
          }
          if (!("toJSON" in source)) {
            stack[i] = source;
            const target = isArray(source) ? [] : {};
            forEach(source, (value, key) => {
              const reducedValue = visit2(value, i + 1);
              !isUndefined(reducedValue) && (target[key] = reducedValue);
            });
            stack[i] = void 0;
            return target;
          }
        }
        return source;
      };
      return visit2(obj, 0);
    };
    const utils = {
      isArray,
      isArrayBuffer,
      isBuffer,
      isFormData,
      isArrayBufferView,
      isString: isString$1,
      isNumber,
      isBoolean,
      isObject,
      isPlainObject: isPlainObject$1,
      isUndefined,
      isDate,
      isFile,
      isBlob,
      isRegExp: isRegExp$1,
      isFunction,
      isStream,
      isURLSearchParams,
      isTypedArray,
      isFileList,
      forEach,
      merge,
      extend,
      trim,
      stripBOM,
      inherits,
      toFlatObject,
      kindOf,
      kindOfTest,
      endsWith,
      toArray,
      forEachEntry,
      matchAll,
      isHTMLForm,
      hasOwnProperty,
      hasOwnProp: hasOwnProperty,
      reduceDescriptors,
      freezeMethods,
      toObjectSet,
      toCamelCase,
      noop,
      toFiniteNumber,
      findKey,
      global: _global,
      isContextDefined,
      toJSONObject
    };
    function AxiosError(message, code, config, request, response) {
      Error.call(this);
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
      } else {
        this.stack = new Error().stack;
      }
      this.message = message;
      this.name = "AxiosError";
      code && (this.code = code);
      config && (this.config = config);
      request && (this.request = request);
      response && (this.response = response);
    }
    utils.inherits(AxiosError, Error, {
      toJSON: function toJSON() {
        return {
          message: this.message,
          name: this.name,
          description: this.description,
          number: this.number,
          fileName: this.fileName,
          lineNumber: this.lineNumber,
          columnNumber: this.columnNumber,
          stack: this.stack,
          config: utils.toJSONObject(this.config),
          code: this.code,
          status: this.response && this.response.status ? this.response.status : null
        };
      }
    });
    const prototype$1 = AxiosError.prototype;
    const descriptors = {};
    [
      "ERR_BAD_OPTION_VALUE",
      "ERR_BAD_OPTION",
      "ECONNABORTED",
      "ETIMEDOUT",
      "ERR_NETWORK",
      "ERR_FR_TOO_MANY_REDIRECTS",
      "ERR_DEPRECATED",
      "ERR_BAD_RESPONSE",
      "ERR_BAD_REQUEST",
      "ERR_CANCELED",
      "ERR_NOT_SUPPORT",
      "ERR_INVALID_URL"
    ].forEach((code) => {
      descriptors[code] = { value: code };
    });
    Object.defineProperties(AxiosError, descriptors);
    Object.defineProperty(prototype$1, "isAxiosError", { value: true });
    AxiosError.from = (error, code, config, request, response, customProps) => {
      const axiosError = Object.create(prototype$1);
      utils.toFlatObject(error, axiosError, function filter(obj) {
        return obj !== Error.prototype;
      }, (prop) => {
        return prop !== "isAxiosError";
      });
      AxiosError.call(axiosError, error.message, code, config, request, response);
      axiosError.cause = error;
      axiosError.name = error.name;
      customProps && Object.assign(axiosError, customProps);
      return axiosError;
    };
    var browser = typeof self == "object" ? self.FormData : window.FormData;
    const FormData$2 = browser;
    function isVisitable(thing) {
      return utils.isPlainObject(thing) || utils.isArray(thing);
    }
    function removeBrackets(key) {
      return utils.endsWith(key, "[]") ? key.slice(0, -2) : key;
    }
    function renderKey(path, key, dots) {
      if (!path)
        return key;
      return path.concat(key).map(function each(token, i) {
        token = removeBrackets(token);
        return !dots && i ? "[" + token + "]" : token;
      }).join(dots ? "." : "");
    }
    function isFlatArray(arr) {
      return utils.isArray(arr) && !arr.some(isVisitable);
    }
    const predicates = utils.toFlatObject(utils, {}, null, function filter(prop) {
      return /^is[A-Z]/.test(prop);
    });
    function isSpecCompliant(thing) {
      return thing && utils.isFunction(thing.append) && thing[Symbol.toStringTag] === "FormData" && thing[Symbol.iterator];
    }
    function toFormData(obj, formData, options) {
      if (!utils.isObject(obj)) {
        throw new TypeError("target must be an object");
      }
      formData = formData || new (FormData$2 || FormData)();
      options = utils.toFlatObject(options, {
        metaTokens: true,
        dots: false,
        indexes: false
      }, false, function defined(option, source) {
        return !utils.isUndefined(source[option]);
      });
      const metaTokens = options.metaTokens;
      const visitor = options.visitor || defaultVisitor;
      const dots = options.dots;
      const indexes = options.indexes;
      const _Blob = options.Blob || typeof Blob !== "undefined" && Blob;
      const useBlob = _Blob && isSpecCompliant(formData);
      if (!utils.isFunction(visitor)) {
        throw new TypeError("visitor must be a function");
      }
      function convertValue(value) {
        if (value === null)
          return "";
        if (utils.isDate(value)) {
          return value.toISOString();
        }
        if (!useBlob && utils.isBlob(value)) {
          throw new AxiosError("Blob is not supported. Use a Buffer instead.");
        }
        if (utils.isArrayBuffer(value) || utils.isTypedArray(value)) {
          return useBlob && typeof Blob === "function" ? new Blob([value]) : Buffer.from(value);
        }
        return value;
      }
      function defaultVisitor(value, key, path) {
        let arr = value;
        if (value && !path && typeof value === "object") {
          if (utils.endsWith(key, "{}")) {
            key = metaTokens ? key : key.slice(0, -2);
            value = JSON.stringify(value);
          } else if (utils.isArray(value) && isFlatArray(value) || (utils.isFileList(value) || utils.endsWith(key, "[]") && (arr = utils.toArray(value)))) {
            key = removeBrackets(key);
            arr.forEach(function each(el, index) {
              !(utils.isUndefined(el) || el === null) && formData.append(
                indexes === true ? renderKey([key], index, dots) : indexes === null ? key : key + "[]",
                convertValue(el)
              );
            });
            return false;
          }
        }
        if (isVisitable(value)) {
          return true;
        }
        formData.append(renderKey(path, key, dots), convertValue(value));
        return false;
      }
      const stack = [];
      const exposedHelpers = Object.assign(predicates, {
        defaultVisitor,
        convertValue,
        isVisitable
      });
      function build(value, path) {
        if (utils.isUndefined(value))
          return;
        if (stack.indexOf(value) !== -1) {
          throw Error("Circular reference detected in " + path.join("."));
        }
        stack.push(value);
        utils.forEach(value, function each(el, key) {
          const result = !(utils.isUndefined(el) || el === null) && visitor.call(
            formData,
            el,
            utils.isString(key) ? key.trim() : key,
            path,
            exposedHelpers
          );
          if (result === true) {
            build(el, path ? path.concat(key) : [key]);
          }
        });
        stack.pop();
      }
      if (!utils.isObject(obj)) {
        throw new TypeError("data must be an object");
      }
      build(obj);
      return formData;
    }
    function encode$1(str) {
      const charMap = {
        "!": "%21",
        "'": "%27",
        "(": "%28",
        ")": "%29",
        "~": "%7E",
        "%20": "+",
        "%00": "\0"
      };
      return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
        return charMap[match];
      });
    }
    function AxiosURLSearchParams(params, options) {
      this._pairs = [];
      params && toFormData(params, this, options);
    }
    const prototype = AxiosURLSearchParams.prototype;
    prototype.append = function append(name, value) {
      this._pairs.push([name, value]);
    };
    prototype.toString = function toString2(encoder) {
      const _encode = encoder ? function(value) {
        return encoder.call(this, value, encode$1);
      } : encode$1;
      return this._pairs.map(function each(pair) {
        return _encode(pair[0]) + "=" + _encode(pair[1]);
      }, "").join("&");
    };
    function encode(val) {
      return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
    }
    function buildURL(url, params, options) {
      if (!params) {
        return url;
      }
      const _encode = options && options.encode || encode;
      const serializeFn = options && options.serialize;
      let serializedParams;
      if (serializeFn) {
        serializedParams = serializeFn(params, options);
      } else {
        serializedParams = utils.isURLSearchParams(params) ? params.toString() : new AxiosURLSearchParams(params, options).toString(_encode);
      }
      if (serializedParams) {
        const hashmarkIndex = url.indexOf("#");
        if (hashmarkIndex !== -1) {
          url = url.slice(0, hashmarkIndex);
        }
        url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
      }
      return url;
    }
    class InterceptorManager {
      constructor() {
        this.handlers = [];
      }
      use(fulfilled, rejected, options) {
        this.handlers.push({
          fulfilled,
          rejected,
          synchronous: options ? options.synchronous : false,
          runWhen: options ? options.runWhen : null
        });
        return this.handlers.length - 1;
      }
      eject(id) {
        if (this.handlers[id]) {
          this.handlers[id] = null;
        }
      }
      clear() {
        if (this.handlers) {
          this.handlers = [];
        }
      }
      forEach(fn) {
        utils.forEach(this.handlers, function forEachHandler(h) {
          if (h !== null) {
            fn(h);
          }
        });
      }
    }
    const InterceptorManager$1 = InterceptorManager;
    const transitionalDefaults = {
      silentJSONParsing: true,
      forcedJSONParsing: true,
      clarifyTimeoutError: false
    };
    const URLSearchParams$1 = typeof URLSearchParams !== "undefined" ? URLSearchParams : AxiosURLSearchParams;
    const FormData$1 = FormData;
    const isStandardBrowserEnv = (() => {
      let product;
      if (typeof navigator !== "undefined" && ((product = navigator.product) === "ReactNative" || product === "NativeScript" || product === "NS")) {
        return false;
      }
      return typeof window !== "undefined" && typeof document !== "undefined";
    })();
    const isStandardBrowserWebWorkerEnv = (() => {
      return typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope && typeof self.importScripts === "function";
    })();
    const platform = {
      isBrowser: true,
      classes: {
        URLSearchParams: URLSearchParams$1,
        FormData: FormData$1,
        Blob
      },
      isStandardBrowserEnv,
      isStandardBrowserWebWorkerEnv,
      protocols: ["http", "https", "file", "blob", "url", "data"]
    };
    function toURLEncodedForm(data, options) {
      return toFormData(data, new platform.classes.URLSearchParams(), Object.assign({
        visitor: function(value, key, path, helpers) {
          if (platform.isNode && utils.isBuffer(value)) {
            this.append(key, value.toString("base64"));
            return false;
          }
          return helpers.defaultVisitor.apply(this, arguments);
        }
      }, options));
    }
    function parsePropPath(name) {
      return utils.matchAll(/\w+|\[(\w*)]/g, name).map((match) => {
        return match[0] === "[]" ? "" : match[1] || match[0];
      });
    }
    function arrayToObject(arr) {
      const obj = {};
      const keys = Object.keys(arr);
      let i;
      const len = keys.length;
      let key;
      for (i = 0; i < len; i++) {
        key = keys[i];
        obj[key] = arr[key];
      }
      return obj;
    }
    function formDataToJSON(formData) {
      function buildPath(path, value, target, index) {
        let name = path[index++];
        const isNumericKey = Number.isFinite(+name);
        const isLast = index >= path.length;
        name = !name && utils.isArray(target) ? target.length : name;
        if (isLast) {
          if (utils.hasOwnProp(target, name)) {
            target[name] = [target[name], value];
          } else {
            target[name] = value;
          }
          return !isNumericKey;
        }
        if (!target[name] || !utils.isObject(target[name])) {
          target[name] = [];
        }
        const result = buildPath(path, value, target[name], index);
        if (result && utils.isArray(target[name])) {
          target[name] = arrayToObject(target[name]);
        }
        return !isNumericKey;
      }
      if (utils.isFormData(formData) && utils.isFunction(formData.entries)) {
        const obj = {};
        utils.forEachEntry(formData, (name, value) => {
          buildPath(parsePropPath(name), value, obj, 0);
        });
        return obj;
      }
      return null;
    }
    const DEFAULT_CONTENT_TYPE = {
      "Content-Type": void 0
    };
    function stringifySafely(rawValue, parser, encoder) {
      if (utils.isString(rawValue)) {
        try {
          (parser || JSON.parse)(rawValue);
          return utils.trim(rawValue);
        } catch (e) {
          if (e.name !== "SyntaxError") {
            throw e;
          }
        }
      }
      return (encoder || JSON.stringify)(rawValue);
    }
    const defaults = {
      transitional: transitionalDefaults,
      adapter: ["xhr", "http"],
      transformRequest: [function transformRequest(data, headers) {
        const contentType = headers.getContentType() || "";
        const hasJSONContentType = contentType.indexOf("application/json") > -1;
        const isObjectPayload = utils.isObject(data);
        if (isObjectPayload && utils.isHTMLForm(data)) {
          data = new FormData(data);
        }
        const isFormData2 = utils.isFormData(data);
        if (isFormData2) {
          if (!hasJSONContentType) {
            return data;
          }
          return hasJSONContentType ? JSON.stringify(formDataToJSON(data)) : data;
        }
        if (utils.isArrayBuffer(data) || utils.isBuffer(data) || utils.isStream(data) || utils.isFile(data) || utils.isBlob(data)) {
          return data;
        }
        if (utils.isArrayBufferView(data)) {
          return data.buffer;
        }
        if (utils.isURLSearchParams(data)) {
          headers.setContentType("application/x-www-form-urlencoded;charset=utf-8", false);
          return data.toString();
        }
        let isFileList2;
        if (isObjectPayload) {
          if (contentType.indexOf("application/x-www-form-urlencoded") > -1) {
            return toURLEncodedForm(data, this.formSerializer).toString();
          }
          if ((isFileList2 = utils.isFileList(data)) || contentType.indexOf("multipart/form-data") > -1) {
            const _FormData = this.env && this.env.FormData;
            return toFormData(
              isFileList2 ? { "files[]": data } : data,
              _FormData && new _FormData(),
              this.formSerializer
            );
          }
        }
        if (isObjectPayload || hasJSONContentType) {
          headers.setContentType("application/json", false);
          return stringifySafely(data);
        }
        return data;
      }],
      transformResponse: [function transformResponse(data) {
        const transitional = this.transitional || defaults.transitional;
        const forcedJSONParsing = transitional && transitional.forcedJSONParsing;
        const JSONRequested = this.responseType === "json";
        if (data && utils.isString(data) && (forcedJSONParsing && !this.responseType || JSONRequested)) {
          const silentJSONParsing = transitional && transitional.silentJSONParsing;
          const strictJSONParsing = !silentJSONParsing && JSONRequested;
          try {
            return JSON.parse(data);
          } catch (e) {
            if (strictJSONParsing) {
              if (e.name === "SyntaxError") {
                throw AxiosError.from(e, AxiosError.ERR_BAD_RESPONSE, this, null, this.response);
              }
              throw e;
            }
          }
        }
        return data;
      }],
      timeout: 0,
      xsrfCookieName: "XSRF-TOKEN",
      xsrfHeaderName: "X-XSRF-TOKEN",
      maxContentLength: -1,
      maxBodyLength: -1,
      env: {
        FormData: platform.classes.FormData,
        Blob: platform.classes.Blob
      },
      validateStatus: function validateStatus(status) {
        return status >= 200 && status < 300;
      },
      headers: {
        common: {
          "Accept": "application/json, text/plain, */*"
        }
      }
    };
    utils.forEach(["delete", "get", "head"], function forEachMethodNoData(method) {
      defaults.headers[method] = {};
    });
    utils.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
      defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
    });
    const defaults$1 = defaults;
    const ignoreDuplicateOf = utils.toObjectSet([
      "age",
      "authorization",
      "content-length",
      "content-type",
      "etag",
      "expires",
      "from",
      "host",
      "if-modified-since",
      "if-unmodified-since",
      "last-modified",
      "location",
      "max-forwards",
      "proxy-authorization",
      "referer",
      "retry-after",
      "user-agent"
    ]);
    const parseHeaders = (rawHeaders) => {
      const parsed = {};
      let key;
      let val;
      let i;
      rawHeaders && rawHeaders.split("\n").forEach(function parser(line) {
        i = line.indexOf(":");
        key = line.substring(0, i).trim().toLowerCase();
        val = line.substring(i + 1).trim();
        if (!key || parsed[key] && ignoreDuplicateOf[key]) {
          return;
        }
        if (key === "set-cookie") {
          if (parsed[key]) {
            parsed[key].push(val);
          } else {
            parsed[key] = [val];
          }
        } else {
          parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
        }
      });
      return parsed;
    };
    const $internals = Symbol("internals");
    function normalizeHeader(header) {
      return header && String(header).trim().toLowerCase();
    }
    function normalizeValue(value) {
      if (value === false || value == null) {
        return value;
      }
      return utils.isArray(value) ? value.map(normalizeValue) : String(value);
    }
    function parseTokens(str) {
      const tokens = /* @__PURE__ */ Object.create(null);
      const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
      let match;
      while (match = tokensRE.exec(str)) {
        tokens[match[1]] = match[2];
      }
      return tokens;
    }
    function isValidHeaderName(str) {
      return /^[-_a-zA-Z]+$/.test(str.trim());
    }
    function matchHeaderValue(context, value, header, filter) {
      if (utils.isFunction(filter)) {
        return filter.call(this, value, header);
      }
      if (!utils.isString(value))
        return;
      if (utils.isString(filter)) {
        return value.indexOf(filter) !== -1;
      }
      if (utils.isRegExp(filter)) {
        return filter.test(value);
      }
    }
    function formatHeader(header) {
      return header.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
        return char.toUpperCase() + str;
      });
    }
    function buildAccessors(obj, header) {
      const accessorName = utils.toCamelCase(" " + header);
      ["get", "set", "has"].forEach((methodName) => {
        Object.defineProperty(obj, methodName + accessorName, {
          value: function(arg1, arg2, arg3) {
            return this[methodName].call(this, header, arg1, arg2, arg3);
          },
          configurable: true
        });
      });
    }
    class AxiosHeaders {
      constructor(headers) {
        headers && this.set(headers);
      }
      set(header, valueOrRewrite, rewrite) {
        const self2 = this;
        function setHeader(_value, _header, _rewrite) {
          const lHeader = normalizeHeader(_header);
          if (!lHeader) {
            throw new Error("header name must be a non-empty string");
          }
          const key = utils.findKey(self2, lHeader);
          if (!key || self2[key] === void 0 || _rewrite === true || _rewrite === void 0 && self2[key] !== false) {
            self2[key || _header] = normalizeValue(_value);
          }
        }
        const setHeaders = (headers, _rewrite) => utils.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));
        if (utils.isPlainObject(header) || header instanceof this.constructor) {
          setHeaders(header, valueOrRewrite);
        } else if (utils.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
          setHeaders(parseHeaders(header), valueOrRewrite);
        } else {
          header != null && setHeader(valueOrRewrite, header, rewrite);
        }
        return this;
      }
      get(header, parser) {
        header = normalizeHeader(header);
        if (header) {
          const key = utils.findKey(this, header);
          if (key) {
            const value = this[key];
            if (!parser) {
              return value;
            }
            if (parser === true) {
              return parseTokens(value);
            }
            if (utils.isFunction(parser)) {
              return parser.call(this, value, key);
            }
            if (utils.isRegExp(parser)) {
              return parser.exec(value);
            }
            throw new TypeError("parser must be boolean|regexp|function");
          }
        }
      }
      has(header, matcher) {
        header = normalizeHeader(header);
        if (header) {
          const key = utils.findKey(this, header);
          return !!(key && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
        }
        return false;
      }
      delete(header, matcher) {
        const self2 = this;
        let deleted = false;
        function deleteHeader(_header) {
          _header = normalizeHeader(_header);
          if (_header) {
            const key = utils.findKey(self2, _header);
            if (key && (!matcher || matchHeaderValue(self2, self2[key], key, matcher))) {
              delete self2[key];
              deleted = true;
            }
          }
        }
        if (utils.isArray(header)) {
          header.forEach(deleteHeader);
        } else {
          deleteHeader(header);
        }
        return deleted;
      }
      clear() {
        return Object.keys(this).forEach(this.delete.bind(this));
      }
      normalize(format) {
        const self2 = this;
        const headers = {};
        utils.forEach(this, (value, header) => {
          const key = utils.findKey(headers, header);
          if (key) {
            self2[key] = normalizeValue(value);
            delete self2[header];
            return;
          }
          const normalized = format ? formatHeader(header) : String(header).trim();
          if (normalized !== header) {
            delete self2[header];
          }
          self2[normalized] = normalizeValue(value);
          headers[normalized] = true;
        });
        return this;
      }
      concat(...targets) {
        return this.constructor.concat(this, ...targets);
      }
      toJSON(asStrings) {
        const obj = /* @__PURE__ */ Object.create(null);
        utils.forEach(this, (value, header) => {
          value != null && value !== false && (obj[header] = asStrings && utils.isArray(value) ? value.join(", ") : value);
        });
        return obj;
      }
      [Symbol.iterator]() {
        return Object.entries(this.toJSON())[Symbol.iterator]();
      }
      toString() {
        return Object.entries(this.toJSON()).map(([header, value]) => header + ": " + value).join("\n");
      }
      get [Symbol.toStringTag]() {
        return "AxiosHeaders";
      }
      static from(thing) {
        return thing instanceof this ? thing : new this(thing);
      }
      static concat(first, ...targets) {
        const computed = new this(first);
        targets.forEach((target) => computed.set(target));
        return computed;
      }
      static accessor(header) {
        const internals = this[$internals] = this[$internals] = {
          accessors: {}
        };
        const accessors = internals.accessors;
        const prototype2 = this.prototype;
        function defineAccessor(_header) {
          const lHeader = normalizeHeader(_header);
          if (!accessors[lHeader]) {
            buildAccessors(prototype2, _header);
            accessors[lHeader] = true;
          }
        }
        utils.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);
        return this;
      }
    }
    AxiosHeaders.accessor(["Content-Type", "Content-Length", "Accept", "Accept-Encoding", "User-Agent"]);
    utils.freezeMethods(AxiosHeaders.prototype);
    utils.freezeMethods(AxiosHeaders);
    const AxiosHeaders$1 = AxiosHeaders;
    function transformData(fns, response) {
      const config = this || defaults$1;
      const context = response || config;
      const headers = AxiosHeaders$1.from(context.headers);
      let data = context.data;
      utils.forEach(fns, function transform(fn) {
        data = fn.call(config, data, headers.normalize(), response ? response.status : void 0);
      });
      headers.normalize();
      return data;
    }
    function isCancel(value) {
      return !!(value && value.__CANCEL__);
    }
    function CanceledError(message, config, request) {
      AxiosError.call(this, message == null ? "canceled" : message, AxiosError.ERR_CANCELED, config, request);
      this.name = "CanceledError";
    }
    utils.inherits(CanceledError, AxiosError, {
      __CANCEL__: true
    });
    const httpAdapter = null;
    function settle(resolve, reject, response) {
      const validateStatus = response.config.validateStatus;
      if (!response.status || !validateStatus || validateStatus(response.status)) {
        resolve(response);
      } else {
        reject(new AxiosError(
          "Request failed with status code " + response.status,
          [AxiosError.ERR_BAD_REQUEST, AxiosError.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
          response.config,
          response.request,
          response
        ));
      }
    }
    const cookies = platform.isStandardBrowserEnv ? function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          const cookie = [];
          cookie.push(name + "=" + encodeURIComponent(value));
          if (utils.isNumber(expires)) {
            cookie.push("expires=" + new Date(expires).toGMTString());
          }
          if (utils.isString(path)) {
            cookie.push("path=" + path);
          }
          if (utils.isString(domain)) {
            cookie.push("domain=" + domain);
          }
          if (secure === true) {
            cookie.push("secure");
          }
          document.cookie = cookie.join("; ");
        },
        read: function read(name) {
          const match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
          return match ? decodeURIComponent(match[3]) : null;
        },
        remove: function remove(name) {
          this.write(name, "", Date.now() - 864e5);
        }
      };
    }() : function nonStandardBrowserEnv() {
      return {
        write: function write() {
        },
        read: function read() {
          return null;
        },
        remove: function remove() {
        }
      };
    }();
    function isAbsoluteURL(url) {
      return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
    }
    function combineURLs(baseURL, relativeURL) {
      return relativeURL ? baseURL.replace(/\/+$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
    }
    function buildFullPath(baseURL, requestedURL) {
      if (baseURL && !isAbsoluteURL(requestedURL)) {
        return combineURLs(baseURL, requestedURL);
      }
      return requestedURL;
    }
    const isURLSameOrigin = platform.isStandardBrowserEnv ? function standardBrowserEnv() {
      const msie = /(msie|trident)/i.test(navigator.userAgent);
      const urlParsingNode = document.createElement("a");
      let originURL;
      function resolveURL(url) {
        let href = url;
        if (msie) {
          urlParsingNode.setAttribute("href", href);
          href = urlParsingNode.href;
        }
        urlParsingNode.setAttribute("href", href);
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, "") : "",
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, "") : "",
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, "") : "",
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: urlParsingNode.pathname.charAt(0) === "/" ? urlParsingNode.pathname : "/" + urlParsingNode.pathname
        };
      }
      originURL = resolveURL(window.location.href);
      return function isURLSameOrigin2(requestURL) {
        const parsed = utils.isString(requestURL) ? resolveURL(requestURL) : requestURL;
        return parsed.protocol === originURL.protocol && parsed.host === originURL.host;
      };
    }() : function nonStandardBrowserEnv() {
      return function isURLSameOrigin2() {
        return true;
      };
    }();
    function parseProtocol(url) {
      const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
      return match && match[1] || "";
    }
    function speedometer(samplesCount, min) {
      samplesCount = samplesCount || 10;
      const bytes = new Array(samplesCount);
      const timestamps = new Array(samplesCount);
      let head = 0;
      let tail = 0;
      let firstSampleTS;
      min = min !== void 0 ? min : 1e3;
      return function push(chunkLength) {
        const now = Date.now();
        const startedAt = timestamps[tail];
        if (!firstSampleTS) {
          firstSampleTS = now;
        }
        bytes[head] = chunkLength;
        timestamps[head] = now;
        let i = tail;
        let bytesCount = 0;
        while (i !== head) {
          bytesCount += bytes[i++];
          i = i % samplesCount;
        }
        head = (head + 1) % samplesCount;
        if (head === tail) {
          tail = (tail + 1) % samplesCount;
        }
        if (now - firstSampleTS < min) {
          return;
        }
        const passed = startedAt && now - startedAt;
        return passed ? Math.round(bytesCount * 1e3 / passed) : void 0;
      };
    }
    function progressEventReducer(listener, isDownloadStream) {
      let bytesNotified = 0;
      const _speedometer = speedometer(50, 250);
      return (e) => {
        const loaded = e.loaded;
        const total = e.lengthComputable ? e.total : void 0;
        const progressBytes = loaded - bytesNotified;
        const rate = _speedometer(progressBytes);
        const inRange = loaded <= total;
        bytesNotified = loaded;
        const data = {
          loaded,
          total,
          progress: total ? loaded / total : void 0,
          bytes: progressBytes,
          rate: rate ? rate : void 0,
          estimated: rate && total && inRange ? (total - loaded) / rate : void 0,
          event: e
        };
        data[isDownloadStream ? "download" : "upload"] = true;
        listener(data);
      };
    }
    const isXHRAdapterSupported = typeof XMLHttpRequest !== "undefined";
    const xhrAdapter = isXHRAdapterSupported && function(config) {
      return new Promise(function dispatchXhrRequest(resolve, reject) {
        let requestData = config.data;
        const requestHeaders = AxiosHeaders$1.from(config.headers).normalize();
        const responseType = config.responseType;
        let onCanceled;
        function done() {
          if (config.cancelToken) {
            config.cancelToken.unsubscribe(onCanceled);
          }
          if (config.signal) {
            config.signal.removeEventListener("abort", onCanceled);
          }
        }
        if (utils.isFormData(requestData) && (platform.isStandardBrowserEnv || platform.isStandardBrowserWebWorkerEnv)) {
          requestHeaders.setContentType(false);
        }
        let request = new XMLHttpRequest();
        if (config.auth) {
          const username = config.auth.username || "";
          const password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : "";
          requestHeaders.set("Authorization", "Basic " + btoa(username + ":" + password));
        }
        const fullPath = buildFullPath(config.baseURL, config.url);
        request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);
        request.timeout = config.timeout;
        function onloadend() {
          if (!request) {
            return;
          }
          const responseHeaders = AxiosHeaders$1.from(
            "getAllResponseHeaders" in request && request.getAllResponseHeaders()
          );
          const responseData = !responseType || responseType === "text" || responseType === "json" ? request.responseText : request.response;
          const response = {
            data: responseData,
            status: request.status,
            statusText: request.statusText,
            headers: responseHeaders,
            config,
            request
          };
          settle(function _resolve(value) {
            resolve(value);
            done();
          }, function _reject(err) {
            reject(err);
            done();
          }, response);
          request = null;
        }
        if ("onloadend" in request) {
          request.onloadend = onloadend;
        } else {
          request.onreadystatechange = function handleLoad() {
            if (!request || request.readyState !== 4) {
              return;
            }
            if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf("file:") === 0)) {
              return;
            }
            setTimeout(onloadend);
          };
        }
        request.onabort = function handleAbort() {
          if (!request) {
            return;
          }
          reject(new AxiosError("Request aborted", AxiosError.ECONNABORTED, config, request));
          request = null;
        };
        request.onerror = function handleError() {
          reject(new AxiosError("Network Error", AxiosError.ERR_NETWORK, config, request));
          request = null;
        };
        request.ontimeout = function handleTimeout() {
          let timeoutErrorMessage = config.timeout ? "timeout of " + config.timeout + "ms exceeded" : "timeout exceeded";
          const transitional = config.transitional || transitionalDefaults;
          if (config.timeoutErrorMessage) {
            timeoutErrorMessage = config.timeoutErrorMessage;
          }
          reject(new AxiosError(
            timeoutErrorMessage,
            transitional.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED,
            config,
            request
          ));
          request = null;
        };
        if (platform.isStandardBrowserEnv) {
          const xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName && cookies.read(config.xsrfCookieName);
          if (xsrfValue) {
            requestHeaders.set(config.xsrfHeaderName, xsrfValue);
          }
        }
        requestData === void 0 && requestHeaders.setContentType(null);
        if ("setRequestHeader" in request) {
          utils.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
            request.setRequestHeader(key, val);
          });
        }
        if (!utils.isUndefined(config.withCredentials)) {
          request.withCredentials = !!config.withCredentials;
        }
        if (responseType && responseType !== "json") {
          request.responseType = config.responseType;
        }
        if (typeof config.onDownloadProgress === "function") {
          request.addEventListener("progress", progressEventReducer(config.onDownloadProgress, true));
        }
        if (typeof config.onUploadProgress === "function" && request.upload) {
          request.upload.addEventListener("progress", progressEventReducer(config.onUploadProgress));
        }
        if (config.cancelToken || config.signal) {
          onCanceled = (cancel) => {
            if (!request) {
              return;
            }
            reject(!cancel || cancel.type ? new CanceledError(null, config, request) : cancel);
            request.abort();
            request = null;
          };
          config.cancelToken && config.cancelToken.subscribe(onCanceled);
          if (config.signal) {
            config.signal.aborted ? onCanceled() : config.signal.addEventListener("abort", onCanceled);
          }
        }
        const protocol = parseProtocol(fullPath);
        if (protocol && platform.protocols.indexOf(protocol) === -1) {
          reject(new AxiosError("Unsupported protocol " + protocol + ":", AxiosError.ERR_BAD_REQUEST, config));
          return;
        }
        request.send(requestData || null);
      });
    };
    const knownAdapters = {
      http: httpAdapter,
      xhr: xhrAdapter
    };
    utils.forEach(knownAdapters, (fn, value) => {
      if (fn) {
        try {
          Object.defineProperty(fn, "name", { value });
        } catch (e) {
        }
        Object.defineProperty(fn, "adapterName", { value });
      }
    });
    const adapters = {
      getAdapter: (adapters2) => {
        adapters2 = utils.isArray(adapters2) ? adapters2 : [adapters2];
        const { length } = adapters2;
        let nameOrAdapter;
        let adapter;
        for (let i = 0; i < length; i++) {
          nameOrAdapter = adapters2[i];
          if (adapter = utils.isString(nameOrAdapter) ? knownAdapters[nameOrAdapter.toLowerCase()] : nameOrAdapter) {
            break;
          }
        }
        if (!adapter) {
          if (adapter === false) {
            throw new AxiosError(
              `Adapter ${nameOrAdapter} is not supported by the environment`,
              "ERR_NOT_SUPPORT"
            );
          }
          throw new Error(
            utils.hasOwnProp(knownAdapters, nameOrAdapter) ? `Adapter '${nameOrAdapter}' is not available in the build` : `Unknown adapter '${nameOrAdapter}'`
          );
        }
        if (!utils.isFunction(adapter)) {
          throw new TypeError("adapter is not a function");
        }
        return adapter;
      },
      adapters: knownAdapters
    };
    function throwIfCancellationRequested(config) {
      if (config.cancelToken) {
        config.cancelToken.throwIfRequested();
      }
      if (config.signal && config.signal.aborted) {
        throw new CanceledError(null, config);
      }
    }
    function dispatchRequest(config) {
      throwIfCancellationRequested(config);
      config.headers = AxiosHeaders$1.from(config.headers);
      config.data = transformData.call(
        config,
        config.transformRequest
      );
      if (["post", "put", "patch"].indexOf(config.method) !== -1) {
        config.headers.setContentType("application/x-www-form-urlencoded", false);
      }
      const adapter = adapters.getAdapter(config.adapter || defaults$1.adapter);
      return adapter(config).then(function onAdapterResolution(response) {
        throwIfCancellationRequested(config);
        response.data = transformData.call(
          config,
          config.transformResponse,
          response
        );
        response.headers = AxiosHeaders$1.from(response.headers);
        return response;
      }, function onAdapterRejection(reason) {
        if (!isCancel(reason)) {
          throwIfCancellationRequested(config);
          if (reason && reason.response) {
            reason.response.data = transformData.call(
              config,
              config.transformResponse,
              reason.response
            );
            reason.response.headers = AxiosHeaders$1.from(reason.response.headers);
          }
        }
        return Promise.reject(reason);
      });
    }
    const headersToObject = (thing) => thing instanceof AxiosHeaders$1 ? thing.toJSON() : thing;
    function mergeConfig(config1, config2) {
      config2 = config2 || {};
      const config = {};
      function getMergedValue(target, source, caseless) {
        if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
          return utils.merge.call({ caseless }, target, source);
        } else if (utils.isPlainObject(source)) {
          return utils.merge({}, source);
        } else if (utils.isArray(source)) {
          return source.slice();
        }
        return source;
      }
      function mergeDeepProperties(a, b, caseless) {
        if (!utils.isUndefined(b)) {
          return getMergedValue(a, b, caseless);
        } else if (!utils.isUndefined(a)) {
          return getMergedValue(void 0, a, caseless);
        }
      }
      function valueFromConfig2(a, b) {
        if (!utils.isUndefined(b)) {
          return getMergedValue(void 0, b);
        }
      }
      function defaultToConfig2(a, b) {
        if (!utils.isUndefined(b)) {
          return getMergedValue(void 0, b);
        } else if (!utils.isUndefined(a)) {
          return getMergedValue(void 0, a);
        }
      }
      function mergeDirectKeys(a, b, prop) {
        if (prop in config2) {
          return getMergedValue(a, b);
        } else if (prop in config1) {
          return getMergedValue(void 0, a);
        }
      }
      const mergeMap = {
        url: valueFromConfig2,
        method: valueFromConfig2,
        data: valueFromConfig2,
        baseURL: defaultToConfig2,
        transformRequest: defaultToConfig2,
        transformResponse: defaultToConfig2,
        paramsSerializer: defaultToConfig2,
        timeout: defaultToConfig2,
        timeoutMessage: defaultToConfig2,
        withCredentials: defaultToConfig2,
        adapter: defaultToConfig2,
        responseType: defaultToConfig2,
        xsrfCookieName: defaultToConfig2,
        xsrfHeaderName: defaultToConfig2,
        onUploadProgress: defaultToConfig2,
        onDownloadProgress: defaultToConfig2,
        decompress: defaultToConfig2,
        maxContentLength: defaultToConfig2,
        maxBodyLength: defaultToConfig2,
        beforeRedirect: defaultToConfig2,
        transport: defaultToConfig2,
        httpAgent: defaultToConfig2,
        httpsAgent: defaultToConfig2,
        cancelToken: defaultToConfig2,
        socketPath: defaultToConfig2,
        responseEncoding: defaultToConfig2,
        validateStatus: mergeDirectKeys,
        headers: (a, b) => mergeDeepProperties(headersToObject(a), headersToObject(b), true)
      };
      utils.forEach(Object.keys(config1).concat(Object.keys(config2)), function computeConfigValue(prop) {
        const merge2 = mergeMap[prop] || mergeDeepProperties;
        const configValue = merge2(config1[prop], config2[prop], prop);
        utils.isUndefined(configValue) && merge2 !== mergeDirectKeys || (config[prop] = configValue);
      });
      return config;
    }
    const VERSION = "1.2.2";
    const validators$1 = {};
    ["object", "boolean", "number", "function", "string", "symbol"].forEach((type, i) => {
      validators$1[type] = function validator2(thing) {
        return typeof thing === type || "a" + (i < 1 ? "n " : " ") + type;
      };
    });
    const deprecatedWarnings = {};
    validators$1.transitional = function transitional(validator2, version, message) {
      function formatMessage(opt, desc) {
        return "[Axios v" + VERSION + "] Transitional option '" + opt + "'" + desc + (message ? ". " + message : "");
      }
      return (value, opt, opts) => {
        if (validator2 === false) {
          throw new AxiosError(
            formatMessage(opt, " has been removed" + (version ? " in " + version : "")),
            AxiosError.ERR_DEPRECATED
          );
        }
        if (version && !deprecatedWarnings[opt]) {
          deprecatedWarnings[opt] = true;
          console.warn(
            formatMessage(
              opt,
              " has been deprecated since v" + version + " and will be removed in the near future"
            )
          );
        }
        return validator2 ? validator2(value, opt, opts) : true;
      };
    };
    function assertOptions(options, schema, allowUnknown) {
      if (typeof options !== "object") {
        throw new AxiosError("options must be an object", AxiosError.ERR_BAD_OPTION_VALUE);
      }
      const keys = Object.keys(options);
      let i = keys.length;
      while (i-- > 0) {
        const opt = keys[i];
        const validator2 = schema[opt];
        if (validator2) {
          const value = options[opt];
          const result = value === void 0 || validator2(value, opt, options);
          if (result !== true) {
            throw new AxiosError("option " + opt + " must be " + result, AxiosError.ERR_BAD_OPTION_VALUE);
          }
          continue;
        }
        if (allowUnknown !== true) {
          throw new AxiosError("Unknown option " + opt, AxiosError.ERR_BAD_OPTION);
        }
      }
    }
    const validator = {
      assertOptions,
      validators: validators$1
    };
    const validators = validator.validators;
    class Axios {
      constructor(instanceConfig) {
        this.defaults = instanceConfig;
        this.interceptors = {
          request: new InterceptorManager$1(),
          response: new InterceptorManager$1()
        };
      }
      request(configOrUrl, config) {
        if (typeof configOrUrl === "string") {
          config = config || {};
          config.url = configOrUrl;
        } else {
          config = configOrUrl || {};
        }
        config = mergeConfig(this.defaults, config);
        const { transitional, paramsSerializer, headers } = config;
        if (transitional !== void 0) {
          validator.assertOptions(transitional, {
            silentJSONParsing: validators.transitional(validators.boolean),
            forcedJSONParsing: validators.transitional(validators.boolean),
            clarifyTimeoutError: validators.transitional(validators.boolean)
          }, false);
        }
        if (paramsSerializer !== void 0) {
          validator.assertOptions(paramsSerializer, {
            encode: validators.function,
            serialize: validators.function
          }, true);
        }
        config.method = (config.method || this.defaults.method || "get").toLowerCase();
        let contextHeaders;
        contextHeaders = headers && utils.merge(
          headers.common,
          headers[config.method]
        );
        contextHeaders && utils.forEach(
          ["delete", "get", "head", "post", "put", "patch", "common"],
          (method) => {
            delete headers[method];
          }
        );
        config.headers = AxiosHeaders$1.concat(contextHeaders, headers);
        const requestInterceptorChain = [];
        let synchronousRequestInterceptors = true;
        this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
          if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config) === false) {
            return;
          }
          synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
          requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
        });
        const responseInterceptorChain = [];
        this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
          responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
        });
        let promise;
        let i = 0;
        let len;
        if (!synchronousRequestInterceptors) {
          const chain = [dispatchRequest.bind(this), void 0];
          chain.unshift.apply(chain, requestInterceptorChain);
          chain.push.apply(chain, responseInterceptorChain);
          len = chain.length;
          promise = Promise.resolve(config);
          while (i < len) {
            promise = promise.then(chain[i++], chain[i++]);
          }
          return promise;
        }
        len = requestInterceptorChain.length;
        let newConfig = config;
        i = 0;
        while (i < len) {
          const onFulfilled = requestInterceptorChain[i++];
          const onRejected = requestInterceptorChain[i++];
          try {
            newConfig = onFulfilled(newConfig);
          } catch (error) {
            onRejected.call(this, error);
            break;
          }
        }
        try {
          promise = dispatchRequest.call(this, newConfig);
        } catch (error) {
          return Promise.reject(error);
        }
        i = 0;
        len = responseInterceptorChain.length;
        while (i < len) {
          promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
        }
        return promise;
      }
      getUri(config) {
        config = mergeConfig(this.defaults, config);
        const fullPath = buildFullPath(config.baseURL, config.url);
        return buildURL(fullPath, config.params, config.paramsSerializer);
      }
    }
    utils.forEach(["delete", "get", "head", "options"], function forEachMethodNoData(method) {
      Axios.prototype[method] = function(url, config) {
        return this.request(mergeConfig(config || {}, {
          method,
          url,
          data: (config || {}).data
        }));
      };
    });
    utils.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
      function generateHTTPMethod(isForm) {
        return function httpMethod(url, data, config) {
          return this.request(mergeConfig(config || {}, {
            method,
            headers: isForm ? {
              "Content-Type": "multipart/form-data"
            } : {},
            url,
            data
          }));
        };
      }
      Axios.prototype[method] = generateHTTPMethod();
      Axios.prototype[method + "Form"] = generateHTTPMethod(true);
    });
    const Axios$1 = Axios;
    class CancelToken {
      constructor(executor) {
        if (typeof executor !== "function") {
          throw new TypeError("executor must be a function.");
        }
        let resolvePromise;
        this.promise = new Promise(function promiseExecutor(resolve) {
          resolvePromise = resolve;
        });
        const token = this;
        this.promise.then((cancel) => {
          if (!token._listeners)
            return;
          let i = token._listeners.length;
          while (i-- > 0) {
            token._listeners[i](cancel);
          }
          token._listeners = null;
        });
        this.promise.then = (onfulfilled) => {
          let _resolve;
          const promise = new Promise((resolve) => {
            token.subscribe(resolve);
            _resolve = resolve;
          }).then(onfulfilled);
          promise.cancel = function reject() {
            token.unsubscribe(_resolve);
          };
          return promise;
        };
        executor(function cancel(message, config, request) {
          if (token.reason) {
            return;
          }
          token.reason = new CanceledError(message, config, request);
          resolvePromise(token.reason);
        });
      }
      throwIfRequested() {
        if (this.reason) {
          throw this.reason;
        }
      }
      subscribe(listener) {
        if (this.reason) {
          listener(this.reason);
          return;
        }
        if (this._listeners) {
          this._listeners.push(listener);
        } else {
          this._listeners = [listener];
        }
      }
      unsubscribe(listener) {
        if (!this._listeners) {
          return;
        }
        const index = this._listeners.indexOf(listener);
        if (index !== -1) {
          this._listeners.splice(index, 1);
        }
      }
      static source() {
        let cancel;
        const token = new CancelToken(function executor(c) {
          cancel = c;
        });
        return {
          token,
          cancel
        };
      }
    }
    const CancelToken$1 = CancelToken;
    function spread(callback) {
      return function wrap2(arr) {
        return callback.apply(null, arr);
      };
    }
    function isAxiosError(payload) {
      return utils.isObject(payload) && payload.isAxiosError === true;
    }
    const HttpStatusCode = {
      Continue: 100,
      SwitchingProtocols: 101,
      Processing: 102,
      EarlyHints: 103,
      Ok: 200,
      Created: 201,
      Accepted: 202,
      NonAuthoritativeInformation: 203,
      NoContent: 204,
      ResetContent: 205,
      PartialContent: 206,
      MultiStatus: 207,
      AlreadyReported: 208,
      ImUsed: 226,
      MultipleChoices: 300,
      MovedPermanently: 301,
      Found: 302,
      SeeOther: 303,
      NotModified: 304,
      UseProxy: 305,
      Unused: 306,
      TemporaryRedirect: 307,
      PermanentRedirect: 308,
      BadRequest: 400,
      Unauthorized: 401,
      PaymentRequired: 402,
      Forbidden: 403,
      NotFound: 404,
      MethodNotAllowed: 405,
      NotAcceptable: 406,
      ProxyAuthenticationRequired: 407,
      RequestTimeout: 408,
      Conflict: 409,
      Gone: 410,
      LengthRequired: 411,
      PreconditionFailed: 412,
      PayloadTooLarge: 413,
      UriTooLong: 414,
      UnsupportedMediaType: 415,
      RangeNotSatisfiable: 416,
      ExpectationFailed: 417,
      ImATeapot: 418,
      MisdirectedRequest: 421,
      UnprocessableEntity: 422,
      Locked: 423,
      FailedDependency: 424,
      TooEarly: 425,
      UpgradeRequired: 426,
      PreconditionRequired: 428,
      TooManyRequests: 429,
      RequestHeaderFieldsTooLarge: 431,
      UnavailableForLegalReasons: 451,
      InternalServerError: 500,
      NotImplemented: 501,
      BadGateway: 502,
      ServiceUnavailable: 503,
      GatewayTimeout: 504,
      HttpVersionNotSupported: 505,
      VariantAlsoNegotiates: 506,
      InsufficientStorage: 507,
      LoopDetected: 508,
      NotExtended: 510,
      NetworkAuthenticationRequired: 511
    };
    Object.entries(HttpStatusCode).forEach(([key, value]) => {
      HttpStatusCode[value] = key;
    });
    const HttpStatusCode$1 = HttpStatusCode;
    function createInstance(defaultConfig) {
      const context = new Axios$1(defaultConfig);
      const instance = bind(Axios$1.prototype.request, context);
      utils.extend(instance, Axios$1.prototype, context, { allOwnKeys: true });
      utils.extend(instance, context, null, { allOwnKeys: true });
      instance.create = function create(instanceConfig) {
        return createInstance(mergeConfig(defaultConfig, instanceConfig));
      };
      return instance;
    }
    const axios = createInstance(defaults$1);
    axios.Axios = Axios$1;
    axios.CanceledError = CanceledError;
    axios.CancelToken = CancelToken$1;
    axios.isCancel = isCancel;
    axios.VERSION = VERSION;
    axios.toFormData = toFormData;
    axios.AxiosError = AxiosError;
    axios.Cancel = axios.CanceledError;
    axios.all = function all(promises) {
      return Promise.all(promises);
    };
    axios.spread = spread;
    axios.isAxiosError = isAxiosError;
    axios.mergeConfig = mergeConfig;
    axios.AxiosHeaders = AxiosHeaders$1;
    axios.formToJSON = (thing) => formDataToJSON(utils.isHTMLForm(thing) ? new FormData(thing) : thing);
    axios.HttpStatusCode = HttpStatusCode$1;
    axios.default = axios;
    const axios$1 = axios;
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
    function isErrorEvent$1(wat) {
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
    function isGlobalObj(obj) {
      return obj && obj.Math == Math ? obj : void 0;
    }
    const GLOBAL_OBJ = typeof globalThis == "object" && isGlobalObj(globalThis) || typeof window == "object" && isGlobalObj(window) || typeof self == "object" && isGlobalObj(self) || typeof global == "object" && isGlobalObj(global) || function() {
      return this;
    }() || {};
    function getGlobalObject() {
      return GLOBAL_OBJ;
    }
    function getGlobalSingleton(name, creator, obj) {
      const gbl = obj || GLOBAL_OBJ;
      const __SENTRY__ = gbl.__SENTRY__ = gbl.__SENTRY__ || {};
      const singleton = __SENTRY__[name] || (__SENTRY__[name] = creator());
      return singleton;
    }
    const WINDOW$5 = getGlobalObject();
    const DEFAULT_MAX_STRING_LENGTH = 80;
    function htmlTreeAsString(elem, options = {}) {
      try {
        let currentElem = elem;
        const MAX_TRAVERSE_HEIGHT = 5;
        const out = [];
        let height = 0;
        let len = 0;
        const separator = " > ";
        const sepLength = separator.length;
        let nextStr;
        const keyAttrs = Array.isArray(options) ? options : options.keyAttrs;
        const maxStringLength = !Array.isArray(options) && options.maxStringLength || DEFAULT_MAX_STRING_LENGTH;
        while (currentElem && height++ < MAX_TRAVERSE_HEIGHT) {
          nextStr = _htmlElementAsString(currentElem, keyAttrs);
          if (nextStr === "html" || height > 1 && len + out.length * sepLength + nextStr.length >= maxStringLength) {
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
    let logger;
    if (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) {
      logger = getGlobalSingleton("logger", makeLogger);
    } else {
      logger = makeLogger();
    }
    function truncate(str, max = 0) {
      if (typeof str !== "string" || max === 0) {
        return str;
      }
      return str.length <= max ? str : `${str.substr(0, max)}...`;
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
      const sortedParsers = parsers.sort((a, b) => a[0] - b[0]).map((p) => p[1]);
      return (stack, skipFirst = 0) => {
        const frames = [];
        for (const line of stack.split("\n").slice(skipFirst)) {
          if (line.length > 1024) {
            continue;
          }
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
      const doc = WINDOW$4.document;
      if (doc && typeof doc.createElement === "function") {
        try {
          const sandbox = doc.createElement("iframe");
          sandbox.hidden = true;
          doc.head.appendChild(sandbox);
          if (sandbox.contentWindow && sandbox.contentWindow.fetch) {
            result = isNativeFetch(sandbox.contentWindow.fetch);
          }
          doc.head.removeChild(sandbox);
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
      CONSOLE_LEVELS.forEach(function(level) {
        if (!(level in WINDOW$3.console)) {
          return;
        }
        fill(WINDOW$3.console, level, function(originalConsoleMethod) {
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
      fill(WINDOW$3, "fetch", function(originalFetch) {
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
      fill(xhrproto, "open", function(originalOpen) {
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
            fill(xhr, "onreadystatechange", function(original) {
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
      fill(xhrproto, "send", function(originalSend) {
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
      fill(WINDOW$3.history, "pushState", historyReplacementFunction);
      fill(WINDOW$3.history, "replaceState", historyReplacementFunction);
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
        fill(proto, "addEventListener", function(originalAddEventListener) {
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
        fill(
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
      const gbl = GLOBAL_OBJ;
      const crypto = gbl.crypto || gbl.msCrypto;
      if (crypto && crypto.randomUUID) {
        return crypto.randomUUID().replace(/-/g, "");
      }
      const getRandomByte = crypto && crypto.getRandomValues ? () => crypto.getRandomValues(new Uint8Array(1))[0] : () => Math.random() * 16;
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
        addNonEnumerableProperty(exception, "__sentry_captured__", true);
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
      return new SyncPromise((resolve) => {
        resolve(value);
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
        return new SyncPromise((resolve, reject) => {
          this._handlers.push([
            false,
            (result) => {
              if (!onfulfilled) {
                resolve(result);
              } else {
                try {
                  resolve(onfulfilled(result));
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
                  resolve(onrejected(reason));
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
        return new SyncPromise((resolve, reject) => {
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
            resolve(val);
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
      function remove(task) {
        return buffer.splice(buffer.indexOf(task), 1)[0];
      }
      function add(taskProducer) {
        if (!isReady()) {
          return rejectedSyncPromise(new SentryError("Not adding Promise because buffer limit was reached."));
        }
        const task = taskProducer();
        if (buffer.indexOf(task) === -1) {
          buffer.push(task);
        }
        void task.then(() => remove(task)).then(
          null,
          () => remove(task).then(null, () => {
          })
        );
        return task;
      }
      function drain(timeout) {
        return new SyncPromise((resolve, reject) => {
          let counter = buffer.length;
          if (!counter) {
            return resolve(true);
          }
          const capturedSetTimeout = setTimeout(() => {
            if (timeout && timeout > 0) {
              resolve(false);
            }
          }, timeout);
          buffer.forEach((item) => {
            void resolvedSyncPromise(item).then(() => {
              if (!--counter) {
                clearTimeout(capturedSetTimeout);
                resolve(true);
              }
            }, reject);
          });
        });
      }
      return {
        $: buffer,
        add,
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
    const validSeverityLevels = ["fatal", "error", "warning", "log", "info", "debug"];
    function severityLevelFromString(level) {
      return level === "warn" ? "warning" : validSeverityLevels.includes(level) ? level : "log";
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
      user_report: "default",
      profile: "profile",
      replay_event: "replay_event",
      replay_recording: "replay_recording"
    };
    function envelopeItemTypeToDataCategory(type) {
      return ITEM_TYPE_TO_DATA_CATEGORY_MAP[type];
    }
    function getSdkMetadataForEnvelopeHeader(metadataOrEvent) {
      if (!metadataOrEvent || !metadataOrEvent.sdk) {
        return;
      }
      const { name, version } = metadataOrEvent.sdk;
      return { name, version };
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
      getLastBreadcrumb() {
        return this._breadcrumbs[this._breadcrumbs.length - 1];
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
      _notifyEventProcessors(processors, event, hint, index = 0) {
        return new SyncPromise((resolve, reject) => {
          const processor = processors[index];
          if (event === null || typeof processor !== "function") {
            resolve(event);
          } else {
            const result = processor({ ...event }, hint);
            (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && processor.id && result === null && logger.log(`Event processor "${processor.id}" dropped event`);
            if (isThenable(result)) {
              void result.then((final) => this._notifyEventProcessors(processors, final, hint, index + 1).then(resolve)).then(null, reject);
            } else {
              void this._notifyEventProcessors(processors, result, hint, index + 1).then(resolve).then(null, reject);
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
      return getGlobalSingleton("globalEventProcessors", () => []);
    }
    function addGlobalEventProcessor(callback) {
      getGlobalEventProcessors().push(callback);
    }
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
      isOlderThan(version) {
        return this._version < version;
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
        const eventId = this._lastEventId = hint && hint.event_id ? hint.event_id : uuid4();
        const syntheticException = new Error("Sentry syntheticException");
        this._withClient((client, scope) => {
          client.captureException(
            exception,
            {
              originalException: exception,
              syntheticException,
              ...hint,
              event_id: eventId
            },
            scope
          );
        });
        return eventId;
      }
      captureMessage(message, level, hint) {
        const eventId = this._lastEventId = hint && hint.event_id ? hint.event_id : uuid4();
        const syntheticException = new Error(message);
        this._withClient((client, scope) => {
          client.captureMessage(
            message,
            level,
            {
              originalException: message,
              syntheticException,
              ...hint,
              event_id: eventId
            },
            scope
          );
        });
        return eventId;
      }
      captureEvent(event, hint) {
        const eventId = hint && hint.event_id ? hint.event_id : uuid4();
        if (!event.type) {
          this._lastEventId = eventId;
        }
        this._withClient((client, scope) => {
          client.captureEvent(event, { ...hint, event_id: eventId }, scope);
        });
        return eventId;
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
        const finalBreadcrumb = beforeBreadcrumb ? consoleSandbox(() => beforeBreadcrumb(mergedBreadcrumb, hint)) : mergedBreadcrumb;
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
        const { userAgent } = GLOBAL_OBJ.navigator || {};
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
        if (client) {
          callback(client, scope);
        }
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
      GLOBAL_OBJ.__SENTRY__ = GLOBAL_OBJ.__SENTRY__ || {
        extensions: {},
        hub: void 0
      };
      return GLOBAL_OBJ;
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
      return getGlobalSingleton("hub", () => new Hub(), carrier);
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
      const eventType = event.type && event.type !== "replay_event" ? event.type : "event";
      enhanceEventWithSdkInfo(event, metadata && metadata.sdk);
      const envelopeHeaders = createEventEnvelopeHeaders(event, sdkInfo, tunnel, dsn);
      delete event.sdkProcessingMetadata;
      const eventItem = [{ type: eventType }, event];
      return createEnvelope(envelopeHeaders, [eventItem]);
    }
    const installedIntegrations = [];
    function filterDuplicates(integrations) {
      const integrationsByName = {};
      integrations.forEach((currentInstance) => {
        const { name } = currentInstance;
        const existingInstance = integrationsByName[name];
        if (existingInstance && !existingInstance.isDefaultInstance && currentInstance.isDefaultInstance) {
          return;
        }
        integrationsByName[name] = currentInstance;
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
        setupIntegration(integration, integrationIndex);
      });
      return integrationIndex;
    }
    function setupIntegration(integration, integrationIndex) {
      integrationIndex[integration.name] = integration;
      if (installedIntegrations.indexOf(integration.name) === -1) {
        integration.setupOnce(addGlobalEventProcessor, getCurrentHub);
        installedIntegrations.push(integration.name);
        (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.log(`Integration installed: ${integration.name}`);
      }
    }
    function prepareEvent(options, event, hint, scope) {
      const { normalizeDepth = 3, normalizeMaxBreadth = 1e3 } = options;
      const prepared = {
        ...event,
        event_id: event.event_id || hint.event_id || uuid4(),
        timestamp: event.timestamp || dateTimestampInSeconds()
      };
      applyClientOptions(prepared, options);
      applyIntegrationsMetadata(
        prepared,
        options.integrations.map((i) => i.name)
      );
      let finalScope = scope;
      if (hint.captureContext) {
        finalScope = Scope.clone(finalScope).update(hint.captureContext);
      }
      let result = resolvedSyncPromise(prepared);
      if (finalScope) {
        if (finalScope.getAttachments) {
          const attachments = [...hint.attachments || [], ...finalScope.getAttachments()];
          if (attachments.length) {
            hint.attachments = attachments;
          }
        }
        result = finalScope.applyToEvent(prepared, hint);
      }
      return result.then((evt) => {
        if (typeof normalizeDepth === "number" && normalizeDepth > 0) {
          return normalizeEvent(evt, normalizeDepth, normalizeMaxBreadth);
        }
        return evt;
      });
    }
    function applyClientOptions(event, options) {
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
    function applyIntegrationsMetadata(event, integrationNames) {
      if (integrationNames.length > 0) {
        event.sdk = event.sdk || {};
        event.sdk.integrations = [...event.sdk.integrations || [], ...integrationNames];
      }
    }
    function normalizeEvent(event, depth, maxBreadth) {
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
        let eventId = hint && hint.event_id;
        this._process(
          this.eventFromException(exception, hint).then((event) => this._captureEvent(event, hint, scope)).then((result) => {
            eventId = result;
          })
        );
        return eventId;
      }
      captureMessage(message, level, hint, scope) {
        let eventId = hint && hint.event_id;
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
        let eventId = hint && hint.event_id;
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
      getSdkMetadata() {
        return this._options._metadata;
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
      addIntegration(integration) {
        setupIntegration(integration, this._integrations);
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
        return new SyncPromise((resolve) => {
          let ticked = 0;
          const tick = 1;
          const interval = setInterval(() => {
            if (this._numProcessing == 0) {
              clearInterval(interval);
              resolve(true);
            } else {
              ticked += tick;
              if (timeout && ticked >= timeout) {
                clearInterval(interval);
                resolve(false);
              }
            }
          }, tick);
        });
      }
      _isEnabled() {
        return this.getOptions().enabled !== false && this._dsn !== void 0;
      }
      _prepareEvent(event, hint, scope) {
        const options = this.getOptions();
        return prepareEvent(options, event, hint, scope);
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
        const isTransaction = isTransactionEvent(event);
        const isError2 = isErrorEvent(event);
        const eventType = event.type || "error";
        const beforeSendLabel = `before send for type \`${eventType}\``;
        if (isError2 && typeof sampleRate === "number" && Math.random() > sampleRate) {
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
            this.recordDroppedEvent("event_processor", eventType, event);
            throw new SentryError("An event processor returned `null`, will not send event.", "log");
          }
          const isInternalException = hint.data && hint.data.__sentry__ === true;
          if (isInternalException) {
            return prepared;
          }
          const result = processBeforeSend(options, prepared, hint);
          return _validateBeforeSendResult(result, beforeSendLabel);
        }).then((processedEvent) => {
          if (processedEvent === null) {
            this.recordDroppedEvent("before_send", event.type || "error", event);
            throw new SentryError(`${beforeSendLabel} returned \`null\`, will not send event.`, "log");
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
    function _validateBeforeSendResult(beforeSendResult, beforeSendLabel) {
      const invalidValueError = `${beforeSendLabel} must return \`null\` or a valid event.`;
      if (isThenable(beforeSendResult)) {
        return beforeSendResult.then(
          (event) => {
            if (!isPlainObject(event) && event !== null) {
              throw new SentryError(invalidValueError);
            }
            return event;
          },
          (e) => {
            throw new SentryError(`${beforeSendLabel} rejected with ${e}`);
          }
        );
      } else if (!isPlainObject(beforeSendResult) && beforeSendResult !== null) {
        throw new SentryError(invalidValueError);
      }
      return beforeSendResult;
    }
    function processBeforeSend(options, event, hint) {
      const { beforeSend, beforeSendTransaction } = options;
      if (isErrorEvent(event) && beforeSend) {
        return beforeSend(event, hint);
      }
      if (isTransactionEvent(event) && beforeSendTransaction) {
        return beforeSendTransaction(event, hint);
      }
      return event;
    }
    function isErrorEvent(event) {
      return event.type === void 0;
    }
    function isTransactionEvent(event) {
      return event.type === "transaction";
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
    function createTransport(options, makeRequest, buffer = makePromiseBuffer(
      options.bufferSize || DEFAULT_TRANSPORT_BUFFER_SIZE
    )) {
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
            return response;
          },
          (error) => {
            recordEnvelopeLoss("network_error");
            throw error;
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
    const SDK_VERSION = "7.30.0";
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
    const WINDOW$1 = GLOBAL_OBJ;
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
      markFunctionWrapped(sentryWrapped, fn);
      addNonEnumerableProperty(fn, "__sentry_wrapped__", sentryWrapped);
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
      if (isErrorEvent$1(exception) && exception.error) {
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
    const MAX_ALLOWED_STRING_LENGTH = 1024;
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
        let maxStringLength = typeof dom === "object" && typeof dom.maxStringLength === "number" ? dom.maxStringLength : void 0;
        if (maxStringLength && maxStringLength > MAX_ALLOWED_STRING_LENGTH) {
          (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.warn(
            `\`dom.maxStringLength\` cannot exceed ${MAX_ALLOWED_STRING_LENGTH}, but a value of ${maxStringLength} was configured. Sentry will use ${MAX_ALLOWED_STRING_LENGTH} instead.`
          );
          maxStringLength = MAX_ALLOWED_STRING_LENGTH;
        }
        if (typeof keyAttrs === "string") {
          keyAttrs = [keyAttrs];
        }
        try {
          target = handlerData.event.target ? htmlTreeAsString(handlerData.event.target, { keyAttrs, maxStringLength }) : htmlTreeAsString(handlerData.event, { keyAttrs, maxStringLength });
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
        level: severityLevelFromString(handlerData.level),
        message: safeJoin(handlerData.args, " ")
      };
      if (handlerData.level === "assert") {
        if (handlerData.args[0] === false) {
          breadcrumb.message = `Assertion failed: ${safeJoin(handlerData.args.slice(1), " ") || "console.assert"}`;
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
        return new SyncPromise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onerror = reject;
          xhr.onreadystatechange = () => {
            if (xhr.readyState === XHR_READYSTATE_DONE) {
              resolve({
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
      let message = isErrorEvent$1(msg) ? msg.message : msg;
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
          fill(WINDOW$1, "setTimeout", _wrapTimeFunction);
        }
        if (this._options.setInterval) {
          fill(WINDOW$1, "setInterval", _wrapTimeFunction);
        }
        if (this._options.requestAnimationFrame) {
          fill(WINDOW$1, "requestAnimationFrame", _wrapRAF);
        }
        if (this._options.XMLHttpRequest && "XMLHttpRequest" in WINDOW$1) {
          fill(XMLHttpRequest.prototype, "send", _wrapXHR);
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
            fill(xhr, prop, function(original) {
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
      fill(proto, "addEventListener", function(original) {
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
      fill(
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
            const request = { ...event.request, ...url && { url }, headers };
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
    function init(options = {}) {
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
      }).filter((p) => p);
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
    const WINDOW = GLOBAL_OBJ;
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
    const onCLS = (onReport) => {
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
        report = bindReporter(onReport, metric);
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
    const onFID = (onReport) => {
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
      report = bindReporter(onReport, metric);
      if (po) {
        onHidden(() => {
          handleEntries(po.takeRecords());
          po.disconnect();
        }, true);
      }
    };
    const reportedMetricIDs = {};
    const onLCP = (onReport) => {
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
        report = bindReporter(onReport, metric);
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
    function startTrackingWebVitals() {
      const performance2 = getBrowserPerformanceAPI();
      if (performance2 && browserPerformanceTimeOrigin) {
        if (performance2.mark) {
          WINDOW.performance.mark("sentry-tracing-init");
        }
        _trackCLS();
        _trackLCP();
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
    function _trackLCP() {
      onLCP((metric) => {
        const entry = metric.entries.pop();
        if (!entry) {
          return;
        }
        (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.log("[Measurements] Adding LCP");
        _measurements["lcp"] = { value: metric.value, unit: "millisecond" };
        _lcpEntry = entry;
      });
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
      const navigator2 = WINDOW.navigator;
      if (!navigator2) {
        return;
      }
      const connection = navigator2.connection;
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
      if (isMeasurementValue(navigator2.deviceMemory)) {
        transaction.setTag("deviceMemory", `${navigator2.deviceMemory} GB`);
      }
      if (isMeasurementValue(navigator2.hardwareConcurrency)) {
        transaction.setTag("hardwareConcurrency", String(navigator2.hardwareConcurrency));
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
          (source, index) => transaction.setTag(`cls.source.${index + 1}`, htmlTreeAsString(source.node))
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
      _experiments: { enableLongTask: true, enableInteractions: false },
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
        startTrackingWebVitals();
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
          shouldCreateSpanForRequest,
          _experiments
        } = this.options;
        instrumentRouting(
          (context) => this._createRouteTransaction(context),
          startTransactionOnPageLoad,
          startTransactionOnLocationChange
        );
        if (markBackgroundTransactions) {
          registerBackgroundTabDetection();
        }
        if (_optionalChain([_experiments, "optionalAccess", (_5) => _5.enableInteractions])) {
          this._registerInteractionListener();
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
        this._latestRouteName = finalContext.name;
        this._latestRouteSource = _optionalChain([finalContext, "access", (_6) => _6.metadata, "optionalAccess", (_7) => _7.source]);
        if (finalContext.sampled === false) {
          (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.log(`[Tracing] Will not send ${finalContext.op} transaction because of beforeNavigate.`);
        }
        (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.log(`[Tracing] Starting ${finalContext.op} transaction on scope`);
        const hub = this._getCurrentHub();
        const { location: location2 } = WINDOW;
        const idleTransaction = startIdleTransaction(
          hub,
          finalContext,
          idleTimeout,
          finalTimeout,
          true,
          { location: location2 },
          heartbeatInterval
        );
        idleTransaction.registerBeforeFinishCallback((transaction) => {
          addPerformanceEntries(transaction);
        });
        return idleTransaction;
      }
      _registerInteractionListener() {
        let inflightInteractionTransaction;
        const registerInteractionTransaction = () => {
          const { idleTimeout, finalTimeout, heartbeatInterval } = this.options;
          const op = "ui.action.click";
          if (inflightInteractionTransaction) {
            inflightInteractionTransaction.finish();
            inflightInteractionTransaction = void 0;
          }
          if (!this._getCurrentHub) {
            (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.warn(`[Tracing] Did not create ${op} transaction because _getCurrentHub is invalid.`);
            return void 0;
          }
          if (!this._latestRouteName) {
            (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.warn(`[Tracing] Did not create ${op} transaction because _latestRouteName is missing.`);
            return void 0;
          }
          const hub = this._getCurrentHub();
          const { location: location2 } = WINDOW;
          const context = {
            name: this._latestRouteName,
            op,
            trimEnd: true,
            metadata: {
              source: _nullishCoalesce(this._latestRouteSource, () => "url")
            }
          };
          inflightInteractionTransaction = startIdleTransaction(
            hub,
            context,
            idleTimeout,
            finalTimeout,
            true,
            { location: location2 },
            heartbeatInterval
          );
        };
        ["click"].forEach((type) => {
          addEventListener(type, registerInteractionTransaction, { once: false, capture: true });
        });
      }
    }
    function getMetaContent(metaName) {
      const metaTag = getDomElement(`meta[name=${metaName}]`);
      return metaTag ? metaTag.getAttribute("content") : null;
    }
    if (typeof __SENTRY_TRACING__ === "undefined" || __SENTRY_TRACING__) {
      addExtensionMethods();
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
    class BackgroundController {
      constructor() {
        this.verbose = true;
        this.runningGameService = new RunningGameService();
        this.hotkeysService = new HotkeysService();
        this.owEventBus = new EventBus();
        this.stateHolderService = new StateHolderService();
        this.apiService = new ApiService(axios$1);
        this.repoService = new RepoService();
        this.shutdownTimeout = null;
        this.hasMultipleMonitors = null;
        this.suggestionTimer = null;
        this.isSuggestionRetry = false;
        this.isAcceptChallengeInProgress = false;
        this.curGameProps = {};
        this.vars = {};
        init({
          dsn: SentryConfig.key,
          release: "my-project-name@2.3.12",
          integrations: [
            new CaptureConsole({
              levels: ["error"]
            }),
            new BrowserTracing()
          ],
          tracesSampleRate: SentryConfig.sampleRate
        });
      }
      _handleAppOffline() {
        console.log("No network connection");
        this.stateHolderService.set(
          kStores.ERROR_MESSAGE,
          "You seem to be offline. Please check your network connection"
        );
        this.updateOnlineStatusInterval && clearInterval(this.updateOnlineStatusInterval);
        this.updateOnlineStatusInterval = setInterval(
          async () => {
            if (!window.navigator.onLine || this.networkOffline) {
              this.stateHolderService.set(
                kStores.ERROR_MESSAGE,
                "You seem to be offline. Please check your network connection"
              );
            }
            if (this.networkOffline) {
              const online = await this.apiService.ping();
              if (online === this.networkOffline) {
                this.owEventBus.trigger(kEventKeys.APP_NETWORK_CHANGE, online ? "online" : "offline");
              }
            }
          },
          5e3
        );
      }
      _handleAppOnline() {
        this.updateOnlineStatusInterval && clearInterval(this.updateOnlineStatusInterval);
      }
      initOnlineStatusHandler() {
        window.addEventListener("offline", (e) => {
          this._handleAppOffline();
        });
        window.addEventListener("online", (e) => {
          this._handleAppOnline();
        });
      }
      async run() {
        window.owEventBus = this.owEventBus;
        window.runningGameService = this.runningGameService;
        window.hotkeysService = this.hotkeysService;
        window.setState = this.setState.bind(this);
        window.stateHolderService = this.stateHolderService;
        window.storeUpdateSubscribe = (listener) => {
          return this.owEventBus.addListener(listener);
        };
        window.storeUpdateUnsubscribe = (listener) => {
          this.owEventBus.removeListener(listener);
        };
        window.remoteLog = function(...args) {
          console.log("remote", ...args);
        };
        window.trackEvent = (eventName, data) => {
          if (window.mixpanel) {
            const now = new Date().getTime();
            switch (eventName) {
              case kMetrics.View_PoppedUp:
                if (now - window.viewPoppedUpTimeStamp < 3e3) {
                  return;
                }
                window.viewPoppedUpTimeStamp = now;
                break;
              case kMetrics.View_Closed:
                data.secondsSinceViewPoppedUp = (now - window.viewPoppedUpTimeStamp) / 1e3;
                window.viewPoppedUpTimeStamp = void 0;
                break;
              case kMetrics.Question_ViewOpened:
                window.questionViewOpenedTimeStamp = now;
                break;
              case kMetrics.Question_CheckAnswer_ViewOpened:
                data.secondsSinceQuestionViewOpened = (now - window.questionViewOpenedTimeStamp) / 1e3;
                break;
              case kMetrics.Question_Flow_Completed:
                data.secondsSinceQuestionViewOpened = (now - window.questionViewOpenedTimeStamp) / 1e3;
                window.questionViewOpenedTimeStamp = void 0;
                break;
            }
            window.mixpanel.track(eventName, data);
          }
        };
        window.registerMetricsProperties = (propertiesObj) => {
          if (window.mixpanel) {
            window.mixpanel.register(propertiesObj);
          }
        };
        window.api = this.apiService;
        window.repo = this.repoService;
        window.getCurOwUser = this.getCurOwUser.bind(this);
        window.trackAppLoadingEndedEvent = this.trackAppLoadingEndedEvent.bind(this);
        window.forceGuestUser = this.forceGuestUser.bind(this);
        window.usernameLogin = this.usernameLogin.bind(this);
        window.emailLogin = this.emailLogin.bind(this);
        window.completeRegistration = this.completeRegistration.bind(this);
        window.manualSignup = this.manualSignup.bind(this);
        window.verifyEmail = this.verifyEmail.bind(this);
        window.completeLoginByVerifyingPinCode = this.completeLoginByVerifyingPinCode.bind(this);
        window.sendAnswer = this.sendAnswer.bind(this);
        window.sendPopularAnswer = this.sendPopularAnswer.bind(this);
        window.getHeartsStatus = this.getHeartsStatus.bind(this);
        window.acceptChallenge = this.acceptChallenge.bind(this);
        window.skipChallenge = this.skipChallenge.bind(this);
        window.getMyTicketsCount = this.getMyTicketsCount.bind(this);
        window.getRaffles = this.getRaffles.bind(this);
        window.getFaq = this.getFaq.bind(this);
        window.claimRaffleReward = this.claimRaffleReward.bind(this);
        window.getStore = this.getStore.bind(this);
        window.buyStoreItem = this.buyStoreItem.bind(this);
        window.getPendingRewards = this.getPendingRewards.bind(this);
        window.collectReward = this.collectReward.bind(this);
        window.getOnlineStatus = this.getOnlineStatus.bind(this);
        window.setCurrentAppVersion = this.setCurrentAppVersion.bind(this);
        window.getVars = this.getVars.bind(this);
        await this.repoService.remove(kRepoKeys.TUTORIAL_QUIZ_MODE);
        await this.repoService.remove(kRepoKeys.BONUS_QUIZ_MODE);
        this.initOnlineStatusHandler();
        this.owEventBus.addListener(this._eventListener.bind(this));
        this.stateHolderService.set(kStores.STATE, kAppStates.INITIALIZATION);
        this.hasMultipleMonitors = await BackgroundController._hasMultipleMonitors();
        this._registerHotkeys();
        const prom = new Promise((resolve) => {
          setTimeout(resolve, 1);
        });
        await prom;
        await this._restoreLaunchWindow();
        this.runningGameService.addGameRunningChangedListener((isRunning, gameId) => {
          this.verbose && console.info(`runningGameService.addGameRunningChangedListener isRunning: ${isRunning} gameId ${gameId}`);
          this._onRunningGameChanged(isRunning);
        });
        overwolf.extensions.onAppLaunchTriggered.addListener(async (e) => {
          this.verbose && console.log(`onAppLaunchTriggered listener ${JSON.stringify(e)}`);
          const { gameId, isRunning } = await this.runningGameService.isGameRunning();
          if (["commandline", "tray", "storeapi"].indexOf(e.origin) !== -1) {
            await WindowsService.bringToFront(kWindowNames.DESKTOP, true);
          } else if (e.origin === "dock") {
            await this.dockClickHandler(isRunning);
          } else if (e && e.source !== "gamelaunchevent") {
            if (isRunning) {
              this._processEventHandler("gameProcessStart", gameId);
            } else {
              this._processEventHandler("launchedWithGameEvent", gameId);
            }
          }
        });
        overwolf.windows.onStateChanged.addListener(() => {
          this._onWindowStateChanged();
        });
        this.initFromServer();
        window.gamestart = () => {
          this.setState(kAppStates.IN_GAME_QUESTION_SUGGESTION, "debug");
        };
        window.gameend = () => {
          this.setState(kAppStates.DESKTOP_AFTER_GAME, "debug");
        };
      }
      async _eventListener(eventName, eventValue) {
        switch (eventName) {
          case kEventKeys.APP_NETWORK_CHANGE:
            this.networkOffline = eventValue === "offline";
            if (this.networkOffline) {
              this._handleAppOffline();
            } else {
              this._handleAppOnline();
            }
            break;
          case kEventKeys.HOTKEY_PRESSED:
            await this.backgroundHotkeyHandler(eventValue);
            break;
          case kEventKeys.UPDATE_TO_STATE: {
            await this._appUpdateToState();
            break;
          }
        }
      }
      setCurrentAppVersion(ver) {
        console.log("setCurrentAppVersion", ver);
        if (mixpanel) {
          mixpanel.register({ appVersion: ver });
        } else {
          console.error("setCurrentAppVersion: mixpanel is not defined");
        }
      }
      async dbgEventsMethod() {
        const g = {
          "info": { "match_info": { "game_mode": '{"mode":"deathmatch","custom":false,"ranked":"2"}' } },
          "feature": "match_info"
        };
        await this._infoUpdateHandler(g);
        await new Promise((resolve) => setTimeout(resolve, 3e3));
        this._onGameEvents({ "events": [{ "name": "death", "data": "7" }] });
      }
      async getCurOwUser() {
        return new Promise((resolve, reject) => {
          try {
            overwolf.profile.getCurrentUser((result) => {
              if (result.status === "success") {
                resolve(result);
              } else {
                resolve(null);
              }
            });
          } catch {
            resolve(null);
          }
        });
      }
      async signupGuestUser(isRandomGuestIdentifiers) {
        const owUser = await this.getCurOwUser();
        if (!(owUser == null ? void 0 : owUser.success) || isRandomGuestIdentifiers) {
          const now = new Date().getTime();
          return await this.apiService.signupGuestUser(now, now);
        } else {
          const {
            userId,
            machineId
          } = owUser;
          return await this.apiService.signupGuestUser(userId, machineId);
        }
      }
      async loginGuestUser() {
        const owUser = await this.getCurOwUser();
        let errorMessage;
        if (owUser.success) {
          const {
            username,
            userId,
            machineId,
            displayName,
            avatar,
            partnerId,
            channel,
            parameters,
            installParams
          } = owUser;
          return await this.apiService.loginGuestUser(userId, machineId);
        } else {
          errorMessage = `loginUser: Failed to get user from Overwolf: ${owUser.error}`;
        }
        console.error(errorMessage);
        return { errorMessage };
      }
      async relogin() {
        return await this.apiService.relogin();
      }
      async usernameLogin(username) {
        return await this.apiService.usernameLogin(username);
      }
      async emailLogin(email) {
        return await this.apiService.emailLogin(email);
      }
      async completeRegistration(email, username) {
        return await this.apiService.completeRegistration(email, username);
      }
      async manualSignup(email, username) {
        return await this.apiService.manualSignup(email, username);
      }
      async verifyEmail(code) {
        var _a;
        const res = await this.apiService.verifyEmail(code);
        if ((_a = res == null ? void 0 : res.data) == null ? void 0 : _a.success) {
          await this.fetchMyself();
        }
        return res;
      }
      async completeLoginByVerifyingPinCode(code) {
        const res = await this.apiService.completeLoginByVerifyingPinCode(code);
        if (!(res == null ? void 0 : res.errorMessage)) {
          await this.fetchMyself();
        }
        return res;
      }
      async updateGlobalClockDelta(serverTime) {
        await stateHolderService.set(kStores.CLOCK, {
          delta: serverTime - Date.now()
        });
        window.clock = await stateHolderService.get(kStores.CLOCK);
      }
      trackAppLoadingEndedEvent(view) {
        if (!sessionStorage.getItem("isAppLoadingEndedReported")) {
          trackEvent(kMetrics.AppLoading_Ended, {
            milliSecondsSinceAppLoadingStarted: new Date().getTime() - window.appStartTimeStamp,
            view
          });
          sessionStorage.setItem("isAppLoadingEndedReported", "true");
        }
      }
      handleSetStateToReportAppLoadingEndedEvent(curState, targetState) {
        if (curState === kAppStates.INITIALIZATION && targetState !== kAppStates.DESKTOP_MAIN && targetState !== kAppStates.DESKTOP_AFTER_GAME) {
          if (targetState === kAppStates.IN_GAME_QUESTION_SUGGESTION || targetState === kAppStates.IN_NO_EVENTS_GAME_QUESTION || targetState === kAppStates.IN_GAME_QUESTION) {
            this.trackAppLoadingEndedEvent("questionSuggestion");
          } else {
            this.trackAppLoadingEndedEvent("noneRemainInBackground");
          }
        }
      }
      async mixpanelIdentify(user) {
        const currentDate = new Date();
        const owUser = await this.getCurOwUser();
        const abcClass = localStorage.getItem("abcClass");
        if (mixpanel && user) {
          mixpanel.identify(user._id);
          mixpanel.people.set({
            $name: user.username,
            $email: user.email,
            isRegistered: user.isRegistered,
            isEmailVerified: user.isEmailVerified,
            user_lastTimeSeenDate: currentDate,
            user_lives: user.hearts,
            user_coinsBalance: user.balance,
            abcClass,
            user_sessionNumber: Number(localStorage.getItem("sessionNumber")) - 1
          });
          mixpanel.people.set_once({
            user_firstTimeSeenDate: currentDate,
            initial_abcClass: abcClass
          });
          mixpanel.register_once({
            firstTimeSeenDate: currentDate,
            initial_abcClass: abcClass
          });
          mixpanel.register({
            abcClass,
            lives: user.hearts,
            coinsBalance: user.balance
          });
          if (!sessionStorage.getItem("isCurrentSessionsReported")) {
            mixpanel.people.increment("user_sessionNumberByMixpanel");
            sessionStorage.setItem("isCurrentSessionsReported", "true");
          }
          if (owUser && owUser.success) {
            mixpanel.people.set({
              owUserId: owUser.userId,
              owMachineId: owUser.machineId
            });
            mixpanel.register({
              owUserId: owUser.userId,
              owMachineId: owUser.machineId
            });
            mixpanel.people.set_once({
              $avatar: owUser.avatar,
              owUsername: owUser.username,
              owDisplayName: owUser.displayName,
              owPartnerId: owUser.partnerId,
              owChannel: owUser.channel
            });
            mixpanel.register_once({
              owPartnerId: owUser.partnerId
            });
            if (owUser.installParams) {
              const utmParams = {
                utm_source: owUser.installParams.source,
                utm_medium: owUser.installParams.medium,
                utm_campaign: owUser.installParams.campaign,
                utm_term: owUser.installParams.term,
                utm_content: owUser.installParams.content,
                utm_extra: owUser.installParams.extra
              };
              mixpanel.people.set_once(utmParams);
              mixpanel.register_once(utmParams);
            }
          }
        }
      }
      async fetchMyself() {
        this.user = await this.apiService.getMe();
        stateHolderService.set(kStores.USER, this.user);
        await this.mixpanelIdentify(this.user);
        if (this.user && this.user.serverTime) {
          await this.updateGlobalClockDelta(this.user.serverTime);
        }
      }
      async getMyTicketsCount() {
        const res = await this.apiService.getMyTicketsCount();
        return res;
      }
      async sendAnswer(questionId, option, trigger) {
        if (option || option === 0) {
          await this.repoService.set(kRepoKeys.LAST_QUIZ_ANSWERED, getGlobalTime());
        }
        const res = await this.apiService.sendAnswer(questionId, option, trigger);
        return res;
      }
      async sendPopularAnswer(questionId, option, trigger) {
        const res = await this.apiService.sendPopularAnswer(questionId, option);
        return res;
      }
      async skipChallenge(trigger) {
        console.log(`skipping the quiz`);
        this.setState(kAppStates.IN_GAME_HIDDEN);
        trackEvent(kMetrics.View_Closed, {
          window: kWindowNames.IN_GAME,
          isHappyClose: false,
          trigger
        });
        console.log("BG turn off bm");
        await this.repoService.remove(kRepoKeys.BONUS_QUIZ_MODE);
      }
      async getHeartsStatus() {
        let res = await window.api.getHeartsStatus();
        return res;
      }
      async acceptChallenge(quizType, skipStateChange = false) {
        if (this.isAcceptChallengeInProgress) {
          console.log(`background-controller: acceptChallenge: already in progress; ignoring this call`);
          return;
        }
        this.isAcceptChallengeInProgress = true;
        console.log(`background-controller: starting the quiz`);
        try {
          let quizQuestionObject = await window.api.acceptChallenge(quizType);
          if (quizQuestionObject) {
            quizQuestionObject.answerDeadlineTotalSeconds = quizQuestionObject.timeLimitMs / 1e3;
            quizQuestionObject.answerDeadline = getGlobalTime() + quizQuestionObject.timeLimitMs;
            this.fetchMyself().then();
            if (!skipStateChange) {
              const curState = this.stateHolderService.get(kStores.STATE);
              if (curState === kAppStates.IN_NO_EVENTS_GAME_QUESTION_SUGGESTION) {
                await this.setState(kAppStates.IN_NO_EVENTS_GAME_QUESTION);
              } else {
                await this.setState(kAppStates.IN_GAME_QUESTION);
              }
              await this.repoService.incrementNumericValue(kRepoKeys.QUIZES_ACCEPTED);
              await this.repoService.incrementNumericValue(kRepoKeys.QUIZES_ACCEPTED_LAST_GAME);
              if (quizType === kQuizType.BONUS_FREE) {
                console.log("BG turn off bm");
                await this.repoService.remove(kRepoKeys.BONUS_QUIZ_MODE);
              }
            }
          }
          this.isAcceptChallengeInProgress = false;
          return quizQuestionObject;
        } catch (err) {
          console.log(`background-controller: acceptChallenge: error: ${err}`);
        } finally {
          this.isAcceptChallengeInProgress = false;
        }
      }
      async getFaq() {
        const res = await this.apiService.getFaq();
        return res == null ? void 0 : res.faq;
      }
      async getRaffles() {
        const res = await this.apiService.getRaffles();
        if (!window.clock && (res == null ? void 0 : res.serverTime)) {
          await this.updateGlobalClockDelta(res.serverTime);
        }
        return res == null ? void 0 : res.raffles;
      }
      async getStore() {
        const res = await this.apiService.getStore();
        if (!window.clock && (res == null ? void 0 : res.serverTime)) {
          await this.updateGlobalClockDelta(res.serverTime);
        }
        return res == null ? void 0 : res.items;
      }
      async getVars() {
        return this.vars;
      }
      async getOnlineStatus() {
        return window.navigator.onLine || !this.networkOffline;
      }
      async collectReward(qId) {
        const res = await this.apiService.collectReward(qId);
        if (res) {
          await this.fetchMyself();
        }
        return res;
      }
      async getPendingRewards() {
        const res = await this.apiService.getPendingRewards();
        return res;
      }
      async buyStoreItem(itemId, expectedPrice) {
        const res = await this.apiService.buyStoreItem(itemId, expectedPrice);
        await this.fetchMyself();
        return res;
      }
      async claimRaffleReward(ticketId) {
        const user = stateHolderService.get(kStores.USER);
        return await this.apiService.claimRaffleReward(ticketId, user == null ? void 0 : user.username, user == null ? void 0 : user.email);
      }
      async setState(state, triggeredFrom) {
        const curState = this.stateHolderService.get(kStores.STATE);
        this.verbose && console.info(`BG setState (state) ${state}, triggeredFrom: ${triggeredFrom}, curState: ${curState}`);
        let windowsStates = await WindowsService.getWindowsStates();
        this.verbose && console.info(`BG setState windowsStates: ${JSON.stringify(windowsStates)}`);
        if (curState === state) {
          console.warn(`BG setState skip update for the same state ${state}`);
          return;
        }
        if ([
          kAppStates.IN_GAME_QUESTION_SUGGESTION,
          kAppStates.IN_NO_EVENTS_GAME_QUESTION_SUGGESTION
        ].includes(state)) {
          this.fetchMyself();
          if ([kTriggers.HOTKEY_PRESSED, kTriggers.DOCK].includes(triggeredFrom)) {
            await this.repoService.remove(kRepoKeys.LAST_QUIZ_SKIPPED);
          } else {
            const lastSkipped = await this.repoService.get(kRepoKeys.LAST_QUIZ_SKIPPED, 0);
            const n10minutes = 1e3 * 60 * 10;
            if (getGlobalTime() - Number(lastSkipped) < n10minutes) {
              console.warn(`BG setState skip ${state} due to too frequent suggestions (skipped last than 10 minutes ago)`);
              return;
            }
            const lastSuggested = await this.repoService.get(kRepoKeys.LAST_QUIZ_SUGGESTION, 0);
            const lastAnswered = await this.repoService.get(kRepoKeys.LAST_QUIZ_ANSWERED, 0);
            const isTutorial = await this.repoService.get(kRepoKeys.TUTORIAL_QUIZ_MODE, false);
            const kFrequentSuggestionsThresholdMs = 1e3 * 60;
            if (!isTutorial && (getGlobalTime() - Number(lastSkipped) < kFrequentSuggestionsThresholdMs || getGlobalTime() - Number(lastSuggested) < kFrequentSuggestionsThresholdMs || getGlobalTime() - Number(lastAnswered) < kFrequentSuggestionsThresholdMs)) {
              console.warn(`BG setState skip ${state} due to too frequent suggestions (kFrequentSuggestionsThresholdMs: ${kFrequentSuggestionsThresholdMs}); lastSkipped: ${lastSkipped}, lastSuggested: ${lastSuggested}, lastAnswered: ${lastAnswered}`);
              return;
            }
          }
        }
        if ([
          kAppStates.IN_GAME_QUESTION,
          kAppStates.IN_NO_EVENTS_GAME_QUESTION
        ].includes(state)) {
          if ([
            kAppStates.IN_GAME_QUESTION,
            kAppStates.IN_NO_EVENTS_GAME_QUESTION
          ].includes(curState)) {
            console.log(`BG  setState block navigation to ${state} from cur state ${curState}`);
            return;
          }
        }
        if (curState === kAppStates.IN_NO_EVENTS_GAME_QUESTION && state === kAppStates.IN_NO_EVENTS_GAME_RETRY_PENDING) {
          await WindowsService.close(kWindowNames.IN_GAME);
          this.owEventBus.removeOwner(kEventOwners.inGameApp);
          this.isSuggestionRetry = true;
        }
        if (state === kAppStates.DESKTOP_AFTER_GAME) {
          if ([
            kAppStates.IN_GAME_QUESTION_SUGGESTION,
            kAppStates.IN_GAME_QUESTION,
            kAppStates.IN_GAME_HIDDEN,
            kAppStates.IN_NO_EVENTS_GAME_QUESTION_SUGGESTION,
            kAppStates.IN_NO_EVENTS_GAME_QUESTION,
            kAppStates.IN_NO_EVENTS_GAME_RETRY_PENDING
          ].includes(curState)) {
            await this.repoService.remove(kRepoKeys.FAKE_GAME_ID);
            const quizesAccepted = Number(await this.repoService.get(kRepoKeys.QUIZES_ACCEPTED, 0));
            const quizesAcceptedLastGame = Number(await this.repoService.get(kRepoKeys.QUIZES_ACCEPTED_LAST_GAME, 0));
            const lastBonusQuizSuggestedAt = Number(await this.repoService.get(kRepoKeys.LAST_BONUS_QUIZ_SUGGESTED_AT, 0));
            if (quizesAcceptedLastGame === 0 && Date.now() - lastBonusQuizSuggestedAt > 5 * 60 * 1e3) {
              await this.repoService.set(kRepoKeys.LAST_BONUS_QUIZ_SUGGESTED_AT, Date.now());
              await this.repoService.set(kRepoKeys.BONUS_QUIZ_MODE, true);
              state = kAppStates.IN_GAME_QUESTION_SUGGESTION;
              console.log(`BG ALLOW FREE ROUND`);
            } else {
              console.log(
                `BG SKIP FREE ROUND quizesAccepted: ${quizesAccepted}, 
                        quizesAcceptedLastGame: ${quizesAcceptedLastGame}, 
                        lastBonusQuizSuggestedAt: ${lastBonusQuizSuggestedAt}`
              );
            }
          } else {
            console.log(`BG weird state machine transition to ${state} from ${curState}`);
          }
        }
        if (state === kAppStates.IN_GAME_HIDDEN) {
          const { isRunning } = await this.runningGameService.isGameRunning();
          const isTutorial = await this.repoService.getBooleanValue(kRepoKeys.TUTORIAL_QUIZ_MODE, false);
          if (!isRunning && isTutorial) {
            this.verbose && console.info(`setState state->IN_GAME_HIDDEN (Game not running, is in tutorial), overrides to DESKTOP_AFTER_GAME`);
            state = kAppStates.DESKTOP_AFTER_GAME;
            await this.repoService.remove(kRepoKeys.TUTORIAL_QUIZ_MODE);
          }
        }
        this.verbose && console.log(`this.stateHolderService.set(kStores.STATE, state)`);
        this.stateHolderService.set(kStores.STATE, state);
        this.handleSetStateToReportAppLoadingEndedEvent(curState, state);
        this.owEventBus.trigger(kEventKeys.UPDATE_TO_STATE, state);
        if (state === kAppStates.IN_GAME_QUESTION_SUGGESTION) {
          await this.repoService.set(kRepoKeys.LAST_QUIZ_SUGGESTION, getGlobalTime());
        }
      }
      async initFromServer() {
        var _a, _b;
        this.vars = await this.apiService.getVars();
        const tok = await this.repoService.get(kRepoKeys.AUTH_TOKEN);
        const expiresAt = Number(await this.repoService.get(kRepoKeys.AUTH_EXPIRATION, getGlobalTime() - 1));
        if (tok && expiresAt > getGlobalTime())
          ;
        else if (tok) {
          await this.relogin();
        } else {
          const signupResponse = await this.signupGuestUser();
          if ((_a = signupResponse == null ? void 0 : signupResponse.data) == null ? void 0 : _a.idSetExists) {
            const loginResponse = await this.loginGuestUser();
            const { isRunning } = await this.runningGameService.isGameRunning();
            if (((_b = loginResponse == null ? void 0 : loginResponse.data) == null ? void 0 : _b.code) === 5 && !isRunning) {
              return this.stateHolderService.set(kStores.MODAL_STATE, { isLoginDefault: true });
            } else {
              await this.signupGuestUser(true);
            }
          } else if (signupResponse == null ? void 0 : signupResponse.errorMessage) {
            await this.signupGuestUser(true);
          }
        }
        try {
          await this.fetchMyself();
        } catch (err) {
          console.error("FATAL ERROR on fetchMyself", err);
        }
      }
      async forceGuestUser() {
        await this.signupGuestUser(true);
        await this.fetchMyself();
      }
      static _launchedWithGameEvent() {
        return location.href.includes("source=gamelaunchevent");
      }
      static async _hasMultipleMonitors() {
        const monitors = await WindowsService.getMonitorsList();
        return monitors.length > 1;
      }
      async _onRunningGameChanged(isGameRunning) {
        if (!isGameRunning) {
          this.curGameProps = null;
          this._processEventHandler("gameProcessEnd");
          trackEvent(kMetrics.View_PoppedUp, {
            window: kWindowNames.DESKTOP,
            view: "collect",
            trigger: kTriggers.GAME_EVENT
          });
          return;
        }
        const gameInfo = await this.runningGameService.getRunningGameInfo();
        mixpanel.register({
          viewPoppedUpBy: "game",
          viewPoppedUpByGameId: gameInfo == null ? void 0 : gameInfo.classId,
          viewPoppedUpByGameName: gameInfo == null ? void 0 : gameInfo.title
        });
        if (!gameInfo || !gameInfo.isRunning || !gameInfo.classId || !kGameClassIds.includes(gameInfo.classId)) {
          console.warn("Skipping GEP features due to unsupported kGameClassIds; RunningGameInfo: ", JSON.stringify(gameInfo));
        } else {
          const gameFeatures = kGamesFeatures.get(gameInfo.classId);
          if (gameFeatures) {
            this.verbose && console.log("register to game events", gameInfo.classId, gameFeatures);
            GepService.setRequiredFeatures(
              gameFeatures,
              (e) => this._onGameEvents(e),
              (e) => this._onInfoUpdate(e)
            );
          } else {
            this.verbose && console.log("skip register to game events", gameInfo.classId);
          }
        }
        this._processEventHandler("gameProcessStart");
      }
      async _restoreLaunchWindow() {
        const gameInfo = await this.runningGameService.getRunningGameInfo();
        this.verbose && console.log(`GENIZ _restoreLaunchWindow: gameInfo`, gameInfo);
        if (!gameInfo || !gameInfo.isRunning) {
          mixpanel.register({
            viewPoppedUpBy: "user"
          });
          await WindowsService.restore(kWindowNames.DESKTOP);
          trackEvent(kMetrics.View_PoppedUp, {
            window: kWindowNames.DESKTOP,
            trigger: kTriggers.MOUSE_CLICK
          });
          return;
        }
        if (!BackgroundController._launchedWithGameEvent())
          ;
        else {
          mixpanel.register({
            viewPoppedUpBy: "game",
            viewPoppedUpByGameId: gameInfo.classId,
            viewPoppedUpByGameName: gameInfo.title
          });
          this._processEventHandler("launchedWithGameEvent");
        }
      }
      async _onWindowStateChanged() {
        if (await this._canShutdown()) {
          this._startShutdownTimeout();
        } else {
          this._stopShutdownTimeout();
        }
      }
      async _canShutdown() {
        const { gameId, isRunning } = await this.runningGameService.isGameRunning();
        if (isRunning) {
          return false;
        }
        const states = await WindowsService.getWindowsStates();
        return Object.entries(states).filter(([windowName]) => windowName !== kWindowNames.BACKGROUND).every(([windowName, windowState]) => windowState === "closed");
      }
      _startShutdownTimeout() {
        this._stopShutdownTimeout();
        this.shutdownTimeout = setTimeout(async () => {
          if (await this._canShutdown()) {
            window.close();
          }
        }, 1e4);
      }
      _stopShutdownTimeout() {
        if (this.shutdownTimeout !== null) {
          clearTimeout(this.shutdownTimeout);
          this.shutdownTimeout = null;
        }
      }
      _registerHotkeys() {
        const hks = [hkOk, hkCancel, hkA1, hkA2, hkA3, hkA4];
        hks.forEach((hk) => {
          this.hotkeysService.setToggleHotkeyListener(hk, () => {
            this.owEventBus.trigger(kEventKeys.HOTKEY_PRESSED, hk);
          });
        });
      }
      async dockClickHandler(isGameRunning) {
        if (isGameRunning) {
          const ingameState = await WindowsService.getWindowState(kWindowNames.IN_GAME);
          if (ingameState === "closed") {
            await this.suggestQuizWhenNoIngameWindow(kTriggers.DOCK);
          } else {
            const curState = this.stateHolderService.get(kStores.STATE);
            if (curState === kAppStates.IN_GAME_HIDDEN) {
              await this.setState(kAppStates.IN_GAME_QUESTION_SUGGESTION, kTriggers.DOCK);
            } else {
              await this.skipChallenge(kTriggers.DOCK);
            }
          }
        } else {
          await WindowsService.bringToFront(kWindowNames.DESKTOP, true);
        }
      }
      _onGameEvents(data) {
        console.log("BG GEP _onGameEvents", JSON.stringify(data));
        data.events.forEach((event) => {
          this._gameEventHandler(event);
        });
      }
      async _onInfoUpdate(infoUpdate) {
        console.log("BG GEP _onInfoUpdate", JSON.stringify(infoUpdate));
        await this._infoUpdateHandler(infoUpdate);
      }
      async _processEventHandler(eventName, gameId) {
        const funcName = "_processEventHandler";
        gameId = await this.getCurGameId(gameId);
        switch (eventName) {
          case "gameProcessEnd":
            await this.repoService.remove(kRepoKeys.LAST_QUIZ_SKIPPED);
            await this.repoService.remove(kRepoKeys.TUTORIAL_QUIZ_MODE);
            await this.repoService.remove(kRepoKeys.BONUS_QUIZ_MODE);
            break;
          case "gameProcessStart":
          case "launchedWithGameEvent":
            await this.repoService.remove(kRepoKeys.TUTORIAL_QUIZ_MODE);
            await this.repoService.remove(kRepoKeys.BONUS_QUIZ_MODE);
            await this.repoService.set(kRepoKeys.QUIZES_ACCEPTED_LAST_GAME, 0);
            await WindowsService.close(kWindowNames.DESKTOP);
            this.owEventBus.removeOwner(kEventOwners.desktopApp);
            break;
        }
        if (kStatesConfig[gameId] && kStatesConfig[gameId].processUpdate && kStatesConfig[gameId].processUpdate[eventName]) {
          const targetState = kStatesConfig[gameId].processUpdate[eventName];
          this.verbose && console.info(`${funcName} targetState ${targetState} eventName: ${eventName}`);
          this.setState(targetState, funcName);
        } else {
          this.verbose && this.verbose && console.info(`${funcName} no targetState for eventName: ${eventName}`);
        }
      }
      async getCurGameId(givenGameId) {
        const funcName = "getCurGameId";
        const fakeGameId = await this.repoService.get(kRepoKeys.FAKE_GAME_ID);
        let gameId = givenGameId || this.runningGameService.curGameId || fakeGameId || this.runningGameService.prevGameId;
        if (!gameId) {
          this.verbose && console.log(`${funcName} no gameId`);
          return;
        }
        if (!kStatesConfig[gameId]) {
          console.log(`${funcName} no config for gameId: ${gameId}, will use *;`);
          gameId = "*";
        }
        return gameId;
      }
      evaluateConditions(conditionsArray) {
        let conditionsResult = true;
        this.curGameProps = this.curGameProps || {};
        for (const condition of conditionsArray) {
          try {
            const { key, value, operator } = condition;
            const gamePropValue = this.curGameProps[key];
            let conditionResult = false;
            switch (operator) {
              case "exists":
                conditionResult = !!gamePropValue;
                break;
              case "eq":
                conditionResult = gamePropValue === value;
                break;
              case "ne":
                conditionResult = gamePropValue !== value;
                break;
              case "gt":
                conditionResult = gamePropValue && Number(gamePropValue) > Number(value);
                break;
              case "ge":
                conditionResult = gamePropValue && Number(gamePropValue) >= Number(value);
                break;
              case "lt":
                conditionResult = gamePropValue && Number(gamePropValue) < Number(value);
                break;
              case "le":
                conditionResult = gamePropValue && Number(gamePropValue) <= Number(value);
                break;
              case "in":
                conditionResult = Array.isArray(value) && value.includes(gamePropValue);
                break;
              case "nin":
                conditionResult = Array.isArray(value) && !value.includes(gamePropValue);
                break;
              default:
                console.error(`evaluateConditions unknown operator: ${operator}`);
                break;
            }
            if (conditionResult === false) {
              conditionsResult = false;
              break;
            }
          } catch (err) {
            console.error(`evaluateConditions error for condition: ${JSON.stringify(condition)}; error: ${err}`);
          }
        }
        return conditionsResult;
      }
      async handleStatesConfig(event, configScope, sourceFunc) {
        const funcName = sourceFunc;
        const gameId = await this.getCurGameId();
        this.verbose && console.log(`${funcName} gameId: ${gameId}; event `, event);
        if (kStatesConfig[gameId][configScope]) {
          Object.keys(kStatesConfig[gameId][configScope]).forEach((key) => {
            const eventsToStatesDefinitions = kStatesConfig[gameId][configScope][key];
            const curValue = UtilsService.getObjNestedValue(event, key);
            if (curValue) {
              let targetState = null;
              const dataPoint = eventsToStatesDefinitions[curValue] || eventsToStatesDefinitions["#EXISTS#"];
              if (dataPoint) {
                if (typeof dataPoint === "object") {
                  if (this.evaluateConditions(dataPoint.conditions)) {
                    this.verbose && console.info(`${funcName} got datapoint; Conditions are met, dataPoint: ${JSON.stringify(dataPoint)}`);
                    targetState = dataPoint.targetState;
                  } else {
                    this.verbose && console.info(`${funcName} got datapoint but conditions are not met, dataPoint: ${JSON.stringify(dataPoint)}`);
                  }
                } else {
                  targetState = eventsToStatesDefinitions[curValue] || eventsToStatesDefinitions["#EXISTS#"];
                }
                if (targetState) {
                  this.verbose && console.info(`${funcName} targetState ${targetState}`);
                  this.setState(targetState, "_gameEventHandler");
                } else {
                  this.verbose && console.info(`${funcName} no targetState`);
                }
              }
            }
          });
        }
      }
      _gameEventHandler(event) {
        this.handleStatesConfig(event, "eventUpdate", "_gameEventHandler");
      }
      async updateGameProps(infoUpdates) {
        const funcName = "updateGameProps";
        const gameId = await this.getCurGameId();
        this.verbose && console.log(`${funcName} gameId: ${gameId}; obj: `, JSON.stringify(infoUpdates));
        const propsPaths = props.gamePropsPaths[gameId];
        if (propsPaths) {
          Object.keys(propsPaths).forEach((key) => {
            const nestedPropToQuery = propsPaths[key];
            const curValue = UtilsService.getObjNestedValue(infoUpdates, nestedPropToQuery);
            if (curValue) {
              this.curGameProps[key] = curValue;
            }
          });
        }
      }
      async _infoUpdateHandler(infoUpdate) {
        await this.updateGameProps(infoUpdate);
        await this.handleStatesConfig(infoUpdate, "infoUpdate", "_infoUpdateHandler");
      }
      async _delayQuestionSuggestion() {
        const funcName = "_delayQuestionSuggestion";
        this.verbose && console.log(`${funcName}...`);
        if (this.suggestionTimer) {
          this.verbose && console.log(`${funcName} skip double suggestion timer start`);
          return;
        }
        if (!this.runningGameService.curGameId) {
          this.verbose && console.log(`${funcName} no cur game id`);
          return;
        }
        const gameId = await this.getCurGameId();
        if (this.isSuggestionRetry) {
          this.isSuggestionRetry = false;
          await this.repoService.set(kRepoKeys.LAST_QUIZ_SUGGESTION, getGlobalTime());
          await WindowsService.restore(kWindowNames.IN_GAME);
          trackEvent(kMetrics.View_PoppedUp, {
            window: kWindowNames.IN_GAME,
            view: "questionSuggestion",
            isDelayed: false,
            trigger: kTriggers.GAME_EVENT
          });
        } else {
          const delay = (kStatesConfig[gameId].firstQuestionDelay || 10) * 1e3;
          this.verbose && console.log(`${funcName} delaying IN_GAME state for ${delay}ms`);
          this.suggestionTimer = setTimeout(async () => {
            this.suggestionTimer = null;
            await this.repoService.set(kRepoKeys.LAST_QUIZ_SUGGESTION, getGlobalTime());
            await WindowsService.restore(kWindowNames.IN_GAME);
            trackEvent(kMetrics.View_PoppedUp, {
              window: kWindowNames.IN_GAME,
              view: "questionSuggestion",
              isDelayed: true,
              trigger: kTriggers.GAME_EVENT,
              delay
            });
          }, delay);
        }
      }
      async _delayRetryQuestionSuggestion() {
        const funcName = "_delayRetryQuestionSuggestion";
        this.verbose && console.log(`${funcName}...`);
        if (this.suggestionTimer) {
          this.verbose && console.log(`${funcName} skip double suggestion timer start`);
          return;
        }
        if (!this.runningGameService.curGameId) {
          this.verbose && console.log(`${funcName} no cur game id`);
          return;
        }
        const gameId = await this.getCurGameId();
        const interval = (kStatesConfig[gameId].questionInterval || 999999999) * 1e3;
        this.verbose && console.log(`${funcName} delaying IN_NO_EVENTS_GAME_QUESTION_SUGGESTION state for ${interval}ms`);
        this.suggestionTimer = setTimeout(async () => {
          this.suggestionTimer = null;
          this.isSuggestionRetry = true;
          await this.setState(kAppStates.IN_NO_EVENTS_GAME_QUESTION_SUGGESTION);
        }, interval);
      }
      _stopDelayedQuestionSuggestion() {
        clearTimeout(this.suggestionTimer);
        this.suggestionTimer = null;
      }
      async suggestQuizWhenNoIngameWindow(trigger) {
        const ingameState = await WindowsService.getWindowState(kWindowNames.IN_GAME);
        if ([kTriggers.HOTKEY_PRESSED, kTriggers.DOCK].includes(trigger) && ingameState === "closed") {
          this.setState(
            kAppStates.IN_GAME_QUESTION_SUGGESTION,
            trigger
          );
          trackEvent(kMetrics.View_PoppedUp, {
            window: kWindowNames.IN_GAME,
            view: "none",
            isDelayed: false,
            trigger
          });
        }
      }
      async backgroundHotkeyHandler(hkPressed) {
        switch (hkPressed) {
          case hkCancel:
            this.suggestQuizWhenNoIngameWindow(kTriggers.HOTKEY_PRESSED);
            break;
          case hkOk:
          case hkA1:
          case hkA2:
          case hkA3:
          case hkA4:
            break;
          default:
            console.error(`Unknown hotkey pressed: ${hkPressed}`);
            break;
        }
      }
      async _appUpdateToState() {
        const curState = this.stateHolderService.get(kStores.STATE);
        console.log("_appUpdateToState", curState);
        switch (curState) {
          case kAppStates.DESKTOP_MAIN:
          case kAppStates.DESKTOP_AFTER_GAME:
            this._stopDelayedQuestionSuggestion();
            await WindowsService.restore(kWindowNames.DESKTOP);
            await WindowsService.bringToFront(kWindowNames.DESKTOP);
            await WindowsService.close(kWindowNames.IN_GAME);
            this.owEventBus.removeOwner(kEventOwners.inGameApp);
            break;
          case kAppStates.IN_GAME_QUESTION_SUGGESTION:
          case kAppStates.IN_NO_EVENTS_GAME_QUESTION:
          case kAppStates.IN_GAME_QUESTION:
            this._stopDelayedQuestionSuggestion();
            await WindowsService.minimize(kWindowNames.DESKTOP);
            await WindowsService.restore(kWindowNames.IN_GAME);
            break;
          case kAppStates.IN_GAME_HIDDEN:
            this._stopDelayedQuestionSuggestion();
            await WindowsService.minimize(kWindowNames.DESKTOP);
            break;
          case kAppStates.IN_NO_EVENTS_GAME_RETRY_PENDING:
            await WindowsService.minimize(kWindowNames.DESKTOP);
            await WindowsService.close(kWindowNames.IN_GAME);
            this.owEventBus.removeOwner(kEventOwners.inGameApp);
            await this._delayRetryQuestionSuggestion();
            break;
          case kAppStates.IN_NO_EVENTS_GAME_QUESTION_SUGGESTION:
            await WindowsService.minimize(kWindowNames.DESKTOP);
            await this._delayQuestionSuggestion();
            break;
          default:
            console.info(`_appUpdateToState UNDEFINED STATE ${curState}`);
            break;
        }
      }
    }
    const backgroundController = new BackgroundController();
    backgroundController.run().catch((e) => console.error(e));
  }
});
export default require_app_6445d53d();
