import { Renderer, Loader } from './';
import { EventEmitter } from '../utils/';

export class Game {
  /* UTILS */
  public eventEmitter: EventEmitter = new EventEmitter();

  /* COMPONENTS */
  public renderer: Renderer = new Renderer(this);
  public loader: Loader = new Loader(this);


  constructor() {
    
  }

}