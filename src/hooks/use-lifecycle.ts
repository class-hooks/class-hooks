import { ComponentLifecycle } from 'react';
import { ClassHookTarget } from '../types';

export type LifecycleMethodName = keyof ComponentLifecycle<any, any>;
export type LifecycleMethod<TLifecycleMethodName extends LifecycleMethodName> =
  ComponentLifecycle<any, any>[TLifecycleMethodName];

export const useLifecycle = <TLifecycleMethodName extends LifecycleMethodName>(target: ClassHookTarget, lifecycleMethodName: TLifecycleMethodName, fn: LifecycleMethod<TLifecycleMethodName>): void => {
  let wrappedFn = target[lifecycleMethodName];

  const calculateReturnValue = (originalReturnValue, hookReturnValue) => {
    switch (lifecycleMethodName) {
      case 'shouldComponentUpdate':
        if (hookReturnValue === true) {
          return hookReturnValue;
        } else {
          return originalReturnValue;
        }

      default:
        return originalReturnValue;
    }
  };

  const wrappedFunction = function(...args: any[]) {
    const hookReturnValue = fn.apply(this, args);
    const originalReturnValue = wrappedFn ? wrappedFn.apply(this, args) : undefined;

    return calculateReturnValue(originalReturnValue, hookReturnValue);
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
