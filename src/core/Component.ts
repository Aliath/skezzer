import { Game } from './';
import { EventEmitter } from '../utils';

export class Component {
  private _game: Game;
  private _eventEmitter: EventEmitter;

  constructor(game: Game) {
    this._game = game;
    this._eventEmitter = game.eventEmitter;
  }
}