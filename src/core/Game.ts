import { Renderer, Loader } from './';
import { EventEmitter } from '../utils/';

export class Game {
  /* UTILS */
  eventEmitter: EventEmitter = new EventEmitter();

  /* COMPONENTS */
  renderer: Renderer = new Renderer(this);
  loader: Loader = new Loader(this);


  constructor() {
    console.log('GAME!');
    setTimeout(() => {
      this.loader.hide();
      this.renderer.show();
    }, 250);
  }

}