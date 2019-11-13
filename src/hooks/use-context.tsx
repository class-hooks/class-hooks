import React from 'react';
import { ClassHookTarget } from '../types';

export interface UseContextClassHook<T> {
  getContext(): T;
}

export const useContext = <T extends {}>(target: ClassHookTarget, context: React.Context<T>): UseContextClassHook<T> => {
  let contextValue: T;
  let originalRenderFn = target.render;

  const render = function() {
    return (
      <context.Consumer>
        {
          context => {
            contextValue = context;
            return originalRenderFn.apply(this);
          }
        }
      </context.Consumer>
    );
  };

  Object.defineProperty(target, 'render', {
    get() {
      return render;
    },
    set(fn) {
      originalRenderFn = fn;
    }
  });

  return {
    getContext: () => contextValue
  };
};
