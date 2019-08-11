import { Game } from './Game';
import { EventEmitter } from '../utils';

export class Component {
  protected _game: Game;
  protected _eventEmitter: EventEmitter;

  constructor(game: Game) {
    this._game = game;
    this._eventEmitter = game.eventEmitter;
  }
}