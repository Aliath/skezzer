export interface Ground {
  width: number;
  height: number;
  background: CanvasImageSource;

  onClick?: () => void;
}