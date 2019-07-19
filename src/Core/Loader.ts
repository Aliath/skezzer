export class Loader {
  ref: HTMLElement;

  constructor() {
    this.ref = document.getElementById('loader');
  }

  hide = () => {
    this.ref.classList.add('loader--hidden');
  }

  show = () => {
    this.ref.classList.remove('loader-hidden');
  }
}