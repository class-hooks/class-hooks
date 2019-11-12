import { ComponentLifecycle } from 'react';
import { ClassHookTarget } from '../types';

export type LifecycleMethodName = keyof ComponentLifecycle<any, any>;
export type LifecycleMethod<TLifecycleMethodName extends LifecycleMethodName> =
  ComponentLifecycle<any, any>[TLifecycleMethodName];

export const useLifecycle = <TLifecycleMethodName extends LifecycleMethodName>(target: ClassHookTarget, lifecycleMethodName: TLifecycleMethodName, fn: LifecycleMethod<TLifecycleMethodName>): void => {
  const originalFn = target[lifecycleMethodName];
  (target as any)[lifecycleMethodName] = function(...args: any[]) {
    (fn as any)(...args);
    originalFn && (originalFn as any)(...args);
  };
};
