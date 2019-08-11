import { GroundObject, Ground as GroundInterface } from "../interfaces";
import { Component } from './Component';
import { Game } from './Game';
import { MediaLoader } from "../utils";
import { GRID_SIZE } from "../config";

export interface GroundData {
  mediaSource: string
}

export class Ground extends Component implements GroundObject {
  private _media: CanvasImageSource;
  public loaded = false;

  constructor(game: Game) {
    super(game);
  }

  get width() {
    return Number(this._media.width) / GRID_SIZE;
  }

  get height() {
    return Number(this._media.height) / GRID_SIZE;
  }

  load = (mediaSource: string) => {
    return MediaLoader.load(mediaSource).then((media: CanvasImageSource) => {
      this._media = media;
      this.loaded = true;

      return Promise.resolve(media);
    });
  }

  getDrawData = () => {
    const width = Number(this._media.width);
    const height = Number(this._media.height);

    const data: GroundInterface = { width, height, background: this._media };
    return data;
  }
}