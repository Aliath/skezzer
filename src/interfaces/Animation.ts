import { AnimationDelta } from './';

export interface Animation {
  target: any;
  duration: number;
  handler: () => void;
  onUpdate: (percentageFinished?: number) => void | null;
  animationDelta: AnimationDelta;
  lastUpdate: number;
  start: number;
  finishResult: { [key: string]: number };
}