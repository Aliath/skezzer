import { Drawable } from './';

export interface DrawableObject {
  getDrawData: () => Drawable;
}