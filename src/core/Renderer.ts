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
    const {x: mapX, y: mapY} = this.getMapPosition();


    for (let object of drawObjects) {
      const startX = object.x + mapX;
      const endX = startX + object.width;
      const startY = object.y + mapY;
      const endY = startY + object.height;

      if (x >= startX && x <= endX && y >= startY && y <= endY) {
        if (object.onClick) object.onClick();
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

  public getMapPosition = () => {
    const { _ground, _centralPoint, _width, _height } = this;
    
    const drawableCentralPoint = _centralPoint.getDrawData();
    const drawableGround = _ground.getDrawData();

    const centralPointAverageX = drawableCentralPoint.x + drawableCentralPoint.width / 2;
    const centralPointAverageY = drawableCentralPoint.y + drawableCentralPoint.height / 2;

    const x = -Math.min(Math.max(0, centralPointAverageX / 2), drawableGround.width - _width / 2);
    const y = -Math.min(Math.max(0, centralPointAverageY / 2), drawableGround.height - _height / 2);

    return { x, y };
  }

  public render = () => {
    if (!this._isRendering) return;
    requestAnimationFrame(this.render);

    const { _width, _height, _context, _ground, _centralPoint } = this;
    const drawableGround = _ground.getDrawData();
    const {x: mapX, y: mapY} = this.getMapPosition();
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