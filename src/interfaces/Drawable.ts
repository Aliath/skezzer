export interface Drawable {
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  background: CanvasImageSource;

  onClick?: () => void;
  backgroundPosition?: { x: number, y: number, };
  backgroundSize?: { width: number, height: number };
}