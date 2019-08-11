import { Animation, AnimationDelta } from '../interfaces/';
const _animations: Animation[] = [];

const _generateFinishResult = (target: any, animationDelta: AnimationDelta) => {
  const result = {};

  Object.keys(animationDelta).forEach((key: string) => {
    result[key] = target[key] + animationDelta[key];
  }); 

  return result;
};

export class Animator {
  static update = (time: number) => {
    for (let animation of _animations) {
      const timeDelta = time - animation.lastUpdate;
      animation.lastUpdate = time;
    
      for (let key in animation.animationDelta) {
        const paramDelta = timeDelta / animation.duration;
        animation.target[key] += paramDelta * animation.animationDelta[key];
      }

      if (time >= animation.start + animation.duration) {
        Object.assign(animation.target, animation.finishResult);
        animation.handler();

        return;
      }
    }
  }

  static to = (target: any, params: { [key: string]: number }, duration: number): Promise<null> => {
    const animationDelta = {};

    for (let key in params) {
      if (!target.hasOwnProperty(key)) {
        throw new Error(`Target does not have property "${key}"!`);
      }

      animationDelta[key] = params[key] - target[key];
    }

    return Animator.animate(target, animationDelta, duration);
  }

  static animate = (target: any, animationDelta: AnimationDelta, duration: number): Promise<null> => {
    return new Promise(resolve => {
      const finishResult = _generateFinishResult(target, animationDelta);

      const animation: Animation = {
        target, duration, animationDelta, finishResult,
        lastUpdate: performance.now(),
        start: performance.now(),
        handler: () => {
          const animationIndex = _animations.indexOf(animation);
          _animations.splice(animationIndex, 1);

          resolve();
        }
      };

      _animations.push(animation);  
    });
  }
}