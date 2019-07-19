export interface Drawable {
  width: number,
  height: number,
  x: number,
  y: number,
  backgroundColor?: string,
  image?: CanvasImageSource,
  zIndex?: number,
  click?: () => void,
}