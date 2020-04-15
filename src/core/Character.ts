import { DrawableObject } from '../interfaces';
import { Component } from './Component';
import { Game } from './Game';
import { Direction } from './KeyboardManager';
import { MediaLoader, Animator } from '../utils';
import { STEP_TIME } from '../config';

// temporary fix for the unloaded objects
const _unloadedCharacter = document.createElement('canvas');
const _unloadedCharacterContext = _unloadedCharacter.getContext('2d');
_unloadedCharacterContext.fillStyle = '#000';
_unloadedCharacterContext.fillRect(0, 0, 32, 32);

export interface CharacterData {
  x: number;
  y: number;
  mediaSource: string;
}

export class Character extends Component implements DrawableObject {
  private _loaded: boolean = false;
  private _width: number;
  private _height: number;
  private _zIndex: number = 1;
  private _background: CanvasImageSource;
  private _backgroundPosition = { x: 0, y: 0 };
  private _currentSteps = { up: 0, left: 0, right: 0, down: 0 };
  private _currentDirection: Direction = null;
  private _walkLock: boolean = false;
  public realX: number;
  public realY: number;
  public x: number;
  public y: number;

  constructor(game: Game, data: CharacterData) {
    super(game);

    this.x = this.realX = data.x;
    this.y = this.realY = data.y;

    this._loadImage(data.mediaSource);

    this._eventEmitter.on('KeyboardManager:changeDirection', this._parseDirection);
  }

  private _parseDirection = (direction: Direction) => {
    if (!this._loaded) {
      return;
    }

    this._currentDirection = direction;
    let { x, y } = this;
    let backgroundPositionY: number;

    switch (direction) {
      case 'up':
        y -= 1;
        backgroundPositionY = 144;
        break;
      case 'down':
        y += 1;
        backgroundPositionY = 0;
        break;
      case 'left':
        x -= 1;
        backgroundPositionY = 48;
        break;
      case 'right':
        backgroundPositionY = 96;
        x += 1;
        break;
      default:
        return;
    }

    this._goTowards(x, y, backgroundPositionY, direction);
  }

  private _goTowards = async (x: number, y: number, backgroundPositionY: number, direction: Direction) => {
    if (!this._walkLock) {
      this._backgroundPosition.y = backgroundPositionY;
    }

    if (this._walkLock || x < 0 || y < 0 || x >= this._game.ground.width || y >= this._game.ground.height) {
      return;
    }

    this._walkLock = true;
    const currentStep = this._currentSteps[direction];
    const frameWidth = this._width;
    const currentPosition = currentStep * frameWidth * 2;

    await Animator.to(this, { x, y }, STEP_TIME, (percentage: number) => {
      let currentPositionX = this._backgroundPosition.x;

      if (percentage > .75) {
        currentPositionX = (currentPosition + 2 * frameWidth) % (frameWidth * 4);
      } else if (percentage > .25) {
        currentPositionX = (currentPosition + frameWidth) % (frameWidth * 4);
      }

      this._backgroundPosition.x = currentPositionX;
    });

    this._currentSteps[direction] = (this._currentSteps[direction] + 1) % 2;
    this._backgroundPosition.x = this._currentSteps[direction] * frameWidth * 2;

    this._walkLock = false;
    this._parseDirection(this._currentDirection);
  }

  private _loadImage = async (source: string) => {
    this._background = await MediaLoader.load(source);
    this._loaded = true;
    this._width = Number(this._background.width) / 4;
    this._height = Number(this._background.height) / 4;
  }

  public getDrawData = () => {
    const { x, y, _width, _height, _zIndex, _background, _loaded, _backgroundPosition } = this;

    if (true || !_loaded) {
      return { x, y, zIndex: _zIndex, width: 32, height: 32, background: _unloadedCharacter };
    }

    return { x, y, zIndex: _zIndex, width: _width, height: _height, background: _background, backgroundPosition: _backgroundPosition };
  }
}