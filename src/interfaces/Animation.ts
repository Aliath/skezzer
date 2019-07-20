import { AnimationDelta } from './';

export interface Animation {
  target: any;
  handler: () => void;
  params: AnimationDelta;
  lastUpdate: number;
}