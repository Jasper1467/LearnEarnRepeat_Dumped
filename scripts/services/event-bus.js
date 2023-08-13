export class EventBus {
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
    this._owners[ownerName].forEach(listener => this.removeListener(listener));
    delete this._owners[ownerName];
  }

  removeListener(key) {
    delete this._listeners[key];
  }

  trigger(eventName, eventValue) {
    Object.values(this._listeners).forEach(listener => listener(eventName, eventValue))
  }
}
