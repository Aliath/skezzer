import { Store } from './utils/';
import { Renderer, Loader } from './Core/';

class Game {
  components: { [key: string]: any } = { Renderer, Loader };
  store: Store = new Store();

  constructor() {
    this.registerComponents();

    this.store.getComponent('Loader').hide();
    this.store.getComponent('Renderer').render();
  }

  registerComponents = () => {
    Object.entries(this.components).forEach(([name, Component]) => {
      this.store.registerComponent(name, new Component(this.store));
    })
  };
}

const game = new Game();