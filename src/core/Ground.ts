import { GroundObject, Ground as GroundInterface } from "../interfaces";
import { MediaLoader } from "../utils";
import { Game, Component } from './';

export interface GroundData {
  mediaSource: string
}

export class Ground extends Component implements GroundObject {
  private _media: CanvasImageSource;
  public loaded = false;

  constructor(game: Game) {
    super(game);
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