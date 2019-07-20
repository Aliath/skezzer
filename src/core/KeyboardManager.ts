import { Component, Game } from './';

type direction = 'up' | 'down' | 'left' | 'right' | null;

const DIRECTION_KEY_CODES: { [keyCode: string]: direction } = {
  'KeyW': 'up', 'ArrowUp': 'up',
  'KeyA': 'left', 'ArrowLeft': 'left',
  'KeyD': 'right', 'ArrowRight': 'right',
  'keyS': 'down', 'ArrowDown': 'down'
};

export class KeyboardManager extends Component {
  private _currentDirection: direction = null;

  constructor(game: Game) {
    super(game);

    this._bindWindowEvents();
  }

  private _bindWindowEvents = () => {
    window.addEventListener('keydown', this._handleKeyDownEvent, false);
    window.addEventListener('keyup', this._handleKeyUpEvent, false);
  }

  private _handleKeyDownEvent = (event: KeyboardEvent) => {
    const { code } = event;
    if (!DIRECTION_KEY_CODES.hasOwnProperty(code)) return;

    const keyDirection = DIRECTION_KEY_CODES[code];
    this._currentDirection = keyDirection;

    this._eventEmitter.emit('KeyboardManager:changeDirection', keyDirection);
  }

  private _handleKeyUpEvent = (event: KeyboardEvent) => {
    const { code } = event;
    if (!DIRECTION_KEY_CODES.hasOwnProperty(code)) return;

    const keyDirection = DIRECTION_KEY_CODES[code];
    if (this._currentDirection === keyDirection) {
      this._currentDirection = null;
      this._eventEmitter.emit('KeyboardManager:changeDirection', null);
    }
  }

  public getDirection = () => {
    return this._currentDirection;
  }
}