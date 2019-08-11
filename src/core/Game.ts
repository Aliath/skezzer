import { Renderer, Loader, Ground, Character } from './';
import { EventEmitter } from '../utils/';
import { KeyboardManager } from './KeyboardManager';

export class Game {
  /* UTILS */
  public eventEmitter: EventEmitter = new EventEmitter();

  /* COMPONENTS */
  public renderer: Renderer = new Renderer(this);
  public loader: Loader = new Loader(this);
  public ground: Ground = new Ground(this);
  public character: Character = new Character(this, { x: 5, y: 3, mediaSource: 'img/example-outfit.png' });
  public keyboardManager: KeyboardManager = new KeyboardManager(this);
  

  constructor() {
    this.ground.load('img/example-map.png').then((test) => {
      this.loader.hide();

      this.renderer.setGround(this.ground);
      this.renderer.setCentralPoint(this.character);

      this.renderer.show();
      this.renderer.startRender();
    });
  }

}