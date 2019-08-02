import { Animation, AnimationDelta } from '../interfaces/';
const _animations: Animation[] = [];

export class Animator {
  static update = (time: number) => {
    for (let animation of _animations) {
      const timeDelta = time - animation.lastUpdate;
      animation.lastUpdate = time;
    
      for (let key in animation.animationDelta) {
        const paramDelta = timeDelta / animation.duration;
        animation.target[key] += paramDelta * animation.animationDelta[key];

        if (time >= animation.start + animation.duration) {
          animation.handler();
        }
      }
    }
  }

  static to = (target: any, params: { [key: string]: number }, duration: number): Promise<null> => {
    const animationDelta = {};

    for (let key in params) {
      if (!target.hasOwnProperty(key)) {
        throw new Error(`Target does not have property "${key}"!`);
      }

      animationDelta[key] = target[key] + params[key];
    }

    return Animator.animate(target, animationDelta, duration);
  }

  static animate = (target: any, animationDelta: AnimationDelta, duration: number): Promise<null> => {
    return new Promise(resolve => {
      const animation: Animation = {
        target, duration, animationDelta,
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