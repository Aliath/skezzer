import { Component, Game } from './';

export class Loader extends Component {
  ref: HTMLElement;

  constructor(game: Game) {
    super(game);

    this.ref = document.getElementById('loader');
  }

  hide = () => {
    this.ref.classList.add('loader--hidden');
    this.
  }

  show = () => {
    this.ref.classList.remove('loader-hidden');
  }
}