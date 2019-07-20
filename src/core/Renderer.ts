import { Game, Component } from './';
import { Drawable, DrawableObject, GroundObject } from '../interfaces';

export class Renderer extends Component {
  private _isRendering: boolean = true;
  private _canvas: HTMLCanvasElement = document.createElement('canvas');
  private _context: CanvasRenderingContext2D = this._canvas.getContext('2d');
  private _ground: GroundObject = null;
  private _centralPoint: DrawableObject = null;
  private _drawableList: DrawableObject[] = [];
  private _width: number = window.innerWidth;
  private _height: number = window.innerHeight;


  constructor(game: Game) {
    super(game);

    this.hide();
    this._bindCanvasEvents();
  }

  private _bindCanvasEvents = () => {
    window.addEventListener('resize', this._fitCanvasToWindow, false);
    this._canvas.addEventListener('click', this._handleCanvasClick, false);
  }

  private _getOrderedDrawObjects = () => {
    const { _drawableList, _centralPoint } = this;

    const drawObjects = [..._drawableList, _centralPoint].map((drawableObject: DrawableObject) => drawableObject.getDrawData());
    return drawObjects.sort((a: Drawable, b: Drawable) => a.zIndex > b.zIndex ? 1 : -1);
  }

  private _handleCanvasClick = ({ clientX: x, clientY: y }: MouseEvent) => {
    const drawObjects = this._getOrderedDrawObjects();

    for (let object of drawObjects) {
      const startX = object.x;
      const endX = object.x + object.width;
      const startY = object.y;
      const endY = object.y + object.height;

      if (x >= startX && x <= endX && y >= startY && y <= endY) {
        if (object.onClick) object.onClick();
        return;
      }
    }
  }

  private _fitCanvasToWindow = () => {
    this._canvas.width = this._width = window.innerWidth;
    this._canvas.height = this._height = window.innerHeight;
  }

  hide = () => {
    this._canvas.style.display = 'none';
  }

  show = () => {
    this._canvas.removeAttribute('style');
  }

  addDrawable = (drawableObject: DrawableObject) => {
    this._drawableList.push(drawableObject);
  }

  removeDrawable = (drawableObject: DrawableObject) => {
    this._drawableList = this._drawableList.filter(item => item !== drawableObject);
  }

  setGround = (ground: GroundObject) => {
    this._ground = ground;
  }

  render = () => {
    if (!this._isRendering) return;
    requestAnimationFrame(this.render);

    const { _width, _height, _context, _ground, _centralPoint } = this;

    const drawableCentralPoint = _centralPoint.getDrawData();
    const drawableGround = _ground.getDrawData();

    const centralPointAverageX = drawableCentralPoint.x + drawableCentralPoint.width / 2;
    const centralPointAverageY = drawableCentralPoint.y + drawableCentralPoint.height / 2;
    const mapX = -Math.min(Math.max(0, centralPointAverageX / 2), drawableGround.width - _width / 2);
    const mapY = -Math.min(Math.max(0, centralPointAverageY / 2), drawableGround.height - _height / 2);

    const orderedDrawObjects = this._getOrderedDrawObjects();

    _context.clearRect(0, 0, _width, _height);
    _context.drawImage(drawableGround.background, mapX, mapY);


    for (let drawableObject of orderedDrawObjects) {
      const { x, y, width, height, background, backgroundPosition, backgroundSize } = drawableObject;

      _context.drawImage(
        background,
        backgroundPosition.x || 0,
        backgroundPosition.y || 0,
        backgroundSize.width || width,
        backgroundSize.height || height,
        x + mapX,
        y + mapY,
        width,
        height
      );
    }
  }
}