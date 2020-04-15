import { Component } from './Component';
import { Game } from './Game';
import { Animator } from '../utils/';
import { Drawable, DrawableObject, GroundObject } from '../interfaces';
import { GRID_SIZE } from '../config';

export class Renderer extends Component {
  private _isRendering: boolean = false;
  private _canvas: HTMLCanvasElement = document.body.appendChild(document.createElement('canvas'));
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
    this._fitCanvasToWindow();
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
    const { x: mapX, y: mapY } = this.getMapPosition();

    for (let object of drawObjects) {
      const startX = object.x * GRID_SIZE + mapX + (GRID_SIZE - object.width);
      const endX = startX + object.width;
      const startY = object.y * GRID_SIZE + mapY + (GRID_SIZE - object.height);
      const endY = startY + object.height;

      if (x >= startX && x <= endX && y >= startY && y <= endY) {
        if (object.onClick) {
          object.onClick({ x, y });
        }

        return;
      }
    }

    this._eventEmitter.emit('renderer:canvasClick');
  }

  private _fitCanvasToWindow = () => {
    this._canvas.width = this._width = window.innerWidth;
    this._canvas.height = this._height = window.innerHeight;

    this._eventEmitter.emit('renderer:canvasResize');
  }

  public hide = () => {
    this._canvas.style.display = 'none';
    this._eventEmitter.emit('renderer:canvasHide');
  }

  public show = () => {
    this._canvas.removeAttribute('style');
    this._eventEmitter.emit('renderer:canvasShow');
  }

  public addDrawable = (drawableObject: DrawableObject) => {
    this._drawableList.push(drawableObject);
  }

  public removeDrawable = (drawableObject: DrawableObject) => {
    this._drawableList = this._drawableList.filter(item => item !== drawableObject);
  }

  public setGround = (ground: GroundObject) => {
    this._ground = ground;
  }

  public setCentralPoint = (centralPoint: DrawableObject) => {
    this._centralPoint = centralPoint;
  }

  public startRender = () => {
    this._isRendering = true;
    requestAnimationFrame(this._render);
  }

  public getMapPosition = () => {
    const { _ground, _centralPoint, _width, _height } = this;

    const drawableCentralPoint = _centralPoint.getDrawData();
    const drawableGround = _ground.getDrawData();

    const offsetX = Math.max(0, (_width - drawableGround.width) / 2);
    const offsetY = Math.max(0, (_height - drawableGround.height) / 2);

    const centralPointAverageX = drawableCentralPoint.x * GRID_SIZE + drawableCentralPoint.width / 2;
    const centralPointAverageY = drawableCentralPoint.y * GRID_SIZE + drawableCentralPoint.height / 2;

    const x = -Math.min(Math.max(0, centralPointAverageX - _width / 2), (drawableGround.width - _width + offsetX));
    const y = -Math.min(Math.max(0, centralPointAverageY - _height / 2), drawableGround.height - _height + offsetY);
    return { x, y };
  }

  private _render = (time: number) => {
    if (this._isRendering) {
      requestAnimationFrame(this._render);
    }

    Animator.update(time);

    const { _width, _height, _context, _ground } = this;
    const drawableGround = _ground.getDrawData();
    const { x: mapX, y: mapY } = this.getMapPosition();
    const orderedDrawObjects = this._getOrderedDrawObjects();

    _context.clearRect(0, 0, _width, _height);
    _context.drawImage(drawableGround.background, mapX, mapY);


    for (let drawableObject of orderedDrawObjects) {
      const defaults = {
        backgroundPosition: { x: 0, y: 0 },
        backgroundSize: { width: drawableObject.width, height: drawableObject.height }
      };
      const { x, y, width, height, background, backgroundPosition, backgroundSize } = { ...defaults, ...drawableObject };


      _context.drawImage(
        background,
        backgroundPosition.x,
        backgroundPosition.y,
        backgroundSize.width,
        backgroundSize.height,
        Math.round((GRID_SIZE - width) + GRID_SIZE * x + mapX),
        Math.round((GRID_SIZE - height) + GRID_SIZE * y + mapY),
        width,
        height
      );
    }
  }
}