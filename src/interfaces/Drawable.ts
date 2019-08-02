export interface Drawable {
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  background: CanvasImageSource;

  onClick?: (event: { x: number, y: number }) => void;
  backgroundPosition?: { x: number, y: number, };
  backgroundSize?: { width: number, height: number };
}