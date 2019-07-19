export class Store {
  components = {};
  eventHandlers = {};
  state = {};

  set = (newState: { [key: string]: any }) => {
    this.state = { ...this.state, ...newState };
  };

  get = (key: string) => {
    let result = this.state;

    if (key) {
      result = this.state[key];
    }

    if (typeof result === 'object') return { ...result };
    return result;
  }

  on = (name: string, handler: (payload: any) => void) => {
    if (!this.eventHandlers.hasOwnProperty(name)) {
      this.eventHandlers[name] = [handler];
      return;
    }

    if (this.eventHandlers[name].includes(handler)) {
      throw new Error(`Store.on(): This handler has been already registered!`);
    }

    this.eventHandlers[name].push(handler);
  };

  off = (name: string, handler: (payload: any) => void) => {
    if (!this.eventHandlers.hasOwnProperty(name)) {
      throw new Error(`Store.off(): Trying to remove handler from unknown type: ${name}!`);
    }

    if (!this.eventHandlers[name].includes(handler)) {
      throw new Error(`Store.off(): Trying to remove unknown handler!`);
    }

    this.eventHandlers[name].splice(
      this.eventHandlers[name].indexOf(handler),
      1
    );
  }

  emit = (name: string, payload: any) => {
    if (!this.eventHandlers.hasOwnProperty(name)) {
      console.warn(`Store.emit(): Any handler for event ${name} does not exists!`);
      return;
    }

    this.eventHandlers[name].forEach((handler: (payload: any) => void) => {
      handler(payload);
    });
  };

  registerComponent = (name: string, value: any) => {
    if (this.components.hasOwnProperty(name)) {
      throw new Error(`Store.register(): Component "${name}" is already registered!`);
    }

    this.components[name] = value;
  };

  getComponent = (name: string) => {
    if (Array.isArray(name)) {
      return name.map(component => this.get(component));
    }

    if (!this.components.hasOwnProperty(name)) {
      throw new Error(`Store.get(): Component ${name} is not registered!`);
    }

    return this.components[name];
  };
}