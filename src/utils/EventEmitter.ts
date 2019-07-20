type handler = (payload: any) => void;

export class EventEmitter {
  listeners: { [name: string]: handler[] };

  on = (eventName: string, handler: handler) => {
    if (!this.listeners.hasOwnProperty(eventName)) {
      this.listeners[eventName] = [handler];
    } else {
      this.listeners[eventName].push(handler);
    }
  }

  off = (eventName: string, handler: handler) => {
    this.listeners[eventName] = this.listeners[eventName].filter((currentHandler: handler) => {
      return currentHandler !== handler;
    });
  }

  emit = (eventName: string, payload: any) => {
    const listeners = this.listeners[eventName];

    if (listeners) {
      listeners.forEach(listener => listener(payload));
    }
  }
}