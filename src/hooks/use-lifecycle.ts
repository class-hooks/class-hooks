import { ComponentLifecycle } from 'react';
import { ClassHookTarget } from '../types';

export type LifecycleMethodName = keyof ComponentLifecycle<any, any>;
export type LifecycleMethod<TLifecycleMethodName extends LifecycleMethodName> =
  ComponentLifecycle<any, any>[TLifecycleMethodName];

export const useLifecycle = <TLifecycleMethodName extends LifecycleMethodName>(target: ClassHookTarget, lifecycleMethodName: TLifecycleMethodName, fn: LifecycleMethod<TLifecycleMethodName>): void => {
  let wrappedFn = target[lifecycleMethodName];

  const wrappedFunction = function(...args: any[]) {
    fn.apply(this, args);

    if (wrappedFn) {
      wrappedFn.apply(this, args);
    }
  };

  Object.defineProperty(target, lifecycleMethodName, {
    get() {
      return wrappedFunction;
    },
    set(fn) {
      wrappedFn = fn;
    }
  });
};
