import { DrawableObject } from "../interfaces";
import { MediaLoader } from "../utils";
import { Component, Game } from "./";

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
  private _backgroundSize = { width: 32, height: 48 };
  private _backgroundPosition = { x: 0, y: 0 };
  public x: number;
  public y: number;

  constructor(game: Game, data: CharacterData) {
    super(game);
    
    this.x = data.x;
    this.y = data.y;

    this._loadImage(data.mediaSource);
  }

  private _loadImage = async (source: string) => {
    this._background = await MediaLoader.load(source);
    this._loaded = true;
    this._width = Number(this._background.width) / 4;
    this._height = Number(this._background.height) / 4;
  }

  public getDrawData = () => {
    const { x, y, _width, _height, _zIndex, _background, _loaded, _backgroundSize, _backgroundPosition } = this;

    if (!_loaded) {
      return { x, y, zIndex: _zIndex, width: 32, height: 48, background: _unloadedCharacter };
    }

    return { x, y, zIndex: _zIndex, width: _width, height: _height, background: _background, backgroundSize: _backgroundSize, backgroundPosition: _backgroundPosition };
  }
}