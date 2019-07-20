import { Animation, AnimationDelta } from '../interfaces/';
const _animations: Animation[] = [];

export class Animator {
  static update = (time: number) => {
    for (let animation of _animations) {
      const timeDelta = animation.lastUpdate - time;
      animation.lastUpdate = time;

      for (let key in animation.params) {
        const percentageFinished = Math.min(1, timeDelta / time);
        animation.target[key] += animation.params[key] * percentageFinished;

        if (percentageFinished === 1) animation.handler();
      }
    }
  }

  static animate = (target: any, animationDelta: AnimationDelta, time: number): Promise<null> => {
    return new Promise((resolve) => {
      const currentAnimation = {
        target,
        params: animationDelta,
        lastUpdate: performance.now(),
        handler: () => {
          const currentAnimationIndex = _animations.indexOf(currentAnimation);
          _animations.splice(currentAnimationIndex, 1);

          resolve();
        }
      };

      _animations.push(currentAnimation);
    });
  }

  static to = (target: any, expectedParams: { [key: string]: string }, time: number) => {
    const animationDelta: AnimationDelta = {};

    for (let key in expectedParams) {
      const value = expectedParams[key];
      const prefix = value.substr(0, 2);
      const countValue = +value.substr(2);
      let countedValue: number;

      if (prefix === '+=') {
        countedValue = target[key] + countValue;
      } else if (prefix === '-=') {
        countedValue = target[key] - countValue;
      } else {
        throw new Error('Animator.to(): Wrong parameters!');
      }

      animationDelta[key] = countedValue;
    }

    return Animator.animate(target, animationDelta, time);
  }
}