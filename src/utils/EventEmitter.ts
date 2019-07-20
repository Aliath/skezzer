type payload = any;
type handler = (payload?: payload) => void;

export class EventEmitter {
  private _listeners: { [name: string]: handler[] } = {};

  on = (eventName: string, handler: handler) => {
    if (!this._listeners.hasOwnProperty(eventName)) {
      this._listeners[eventName] = [handler];
    } else {
      this._listeners[eventName].push(handler);
    }
  }

  off = (eventName: string, handler: handler) => {
    this._listeners[eventName] = this._listeners[eventName].filter((currentHandler: handler) => {
      return currentHandler !== handler;
    });
  }

  emit = (eventName: string, payload?: payload) => {
    const listeners = this._listeners[eventName];

    if (listeners) {
      listeners.forEach(listener => listener(payload));
    }
  }
}