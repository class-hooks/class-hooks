import uuid from 'uuid/v4';
import { ClassHookTarget } from '../types';

export interface UseStateClassHook<T> {
  getState(): T;
  setState(stateOrFn: T | ((prevState: T) => T)): void;
}

export const useState = <T>(target: ClassHookTarget, defaultState?: T): UseStateClassHook<T> => {
  const uniqueStateIdentifier = `_use_state_${uuid()}`;

  const getState = () => {
    if (target.state && target.state[uniqueStateIdentifier] !== undefined) {
      return target.state[uniqueStateIdentifier];
    } else {
      return defaultState;
    }
  };

  const setFunctionalState = (fn) => {
    target.setState(prevComponentState => {
      const prevState = prevComponentState && prevComponentState[uniqueStateIdentifier] !== undefined ?
        prevComponentState[uniqueStateIdentifier] :
        defaultState;

      return {
        [uniqueStateIdentifier]: fn(prevState)
      };
    });
  };

  const setState = (stateOrFn) => {
    if (typeof stateOrFn === 'function') {
      setFunctionalState(stateOrFn);
    } else {
      target.setState({ [uniqueStateIdentifier]: stateOrFn });
    }
  };

  return {
    getState,
    setState,
  };
};
