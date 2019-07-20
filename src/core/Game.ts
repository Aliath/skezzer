import { Renderer, Loader } from './';
import { EventEmitter } from '../utils/';
import { KeyboardManager } from './KeyboardManager';

export class Game {
  /* UTILS */
  public eventEmitter: EventEmitter = new EventEmitter();

  /* COMPONENTS */
  public renderer: Renderer = new Renderer(this);
  public loader: Loader = new Loader(this);
  public keyboardManager: KeyboardManager = new KeyboardManager(this);


  constructor() {
    
  }

}