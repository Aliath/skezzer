import { Component, Game } from './';

export class Loader extends Component {
  private _ref: HTMLElement;

  constructor(game: Game) {
    super(game);

    this._ref = document.getElementById('loader');
  }

  public hide = () => {
    this._ref.classList.add('loader--hidden');
    this._eventEmitter.emit('loader:hide');
  }

  public show = () => {
    this._ref.classList.remove('loader-hidden');
    this._eventEmitter.emit('loader:show');
  }
}