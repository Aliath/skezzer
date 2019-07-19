import { Drawable } from "../utils";

export interface CanvasSize {
  width: number,
  height: number,
}

export class Renderer {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  drawableList: Drawable[] = [
    { x: 50, y: 50, width: 100, height: 100, backgroundColor: 'red' }
  ];

  constructor() {
    this._createCanvas();
    this._bindResizeEvents();
    this._fitCanvasToWindow();

    this._moveRect();
  }

  render = () => {
    requestAnimationFrame(this.render);

    this.context.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (let { x, y, width, height, backgroundColor, image, zIndex, click } of this.drawableList) {
      if  (!backgroundColor && !image) {
        console.error('Renderer.render(): There is nothing to render, ignoring...');
        continue;
      }

      if (backgroundColor) {
        this.context.fillStyle = backgroundColor;
        this.context.fillRect(x, y, width, height);
      }
    }
  }

  private _moveRect = () => {
    // :D
    setInterval(() => {
      const random = Math.random();
      const value = Math.random() >= .5 ? 10 : -10;

      if (random < .25) {
        this.drawableList[0].x += value;
      } else if (random < .5) {
        this.drawableList[0].y += value;
      } else if (random < .75) {
        this.drawableList[0].width += value;
      } else {
        this.drawableList[0].height += value;
      }
    }, 100);
  }

  private _bindResizeEvents = () => {
    const EVENT_NAMES = ['resize'];

    EVENT_NAMES.forEach((eventName: string) => {
      window.addEventListener(eventName, this._fitCanvasToWindow, false);
    });
  }

  private _fitCanvasToWindow = () => {
    this._resizeCanvas({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }

  private _resizeCanvas = ({ width, height }: CanvasSize) => {
    Object.assign(this.canvas, { width, height });
  }

  private _createCanvas = () => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    document.body.appendChild(canvas);
    Object.assign(this, { canvas, context });
  }
}