import React from 'react';
import { LifecycleMethodName, useLifecycle } from '../../src/hooks/use-lifecycle';

describe('useLifecycle', () => {
  describe('test proper patching of all lifecycle methods', () => {
    const lifecycleMethodsToTest: LifecycleMethodName[] = [
      'componentDidMount',
      'componentWillUnmount',
      'componentDidCatch',
      'componentDidUpdate',
      'shouldComponentUpdate'
    ];

    lifecycleMethodsToTest.forEach(testUseLifecycleWithMethod);

    function testUseLifecycleWithMethod(method: LifecycleMethodName) {
      describe(`useLifecycle(this, '${method}')`, () => {
        it('should patch in the logic, so it\'s called when the lifecycle method is invoked', () => {
          const fn = jest.fn();

          class SomeComponent extends React.Component {
            lifecycle = useLifecycle(this, method, fn);
          }

          const component = new SomeComponent({});
          (component[method] as any)();
          expect(fn).toHaveBeenCalled();
        });

        it('should retain the original implementation of the given lifecycle method, if existed', () => {
          const fn = jest.fn();
          class SomeComponent extends React.Component {
            lifecycle = useLifecycle(this, method, jest.fn());

            [method]() {
              fn();
            }
          }

          const component = new SomeComponent({});
          (component[method] as any)();
          expect(fn).toHaveBeenCalled();
        });
      });
    }
  });

  describe('test proper patching of bound methods', () => {
    it('should retain hook behavior even if the function is bound', () => {
      const originalComponentDidMount = jest.fn();
      const hookComponentDidMount = jest.fn();

      class SomeComponent extends React.Component {
        lifecycle = useLifecycle(this, 'componentDidMount', hookComponentDidMount);

        componentDidMount = () => {
          originalComponentDidMount();
        }
      }

      const component = new SomeComponent({});
      component.componentDidMount();
      expect(originalComponentDidMount).toHaveBeenCalled();
      expect(hookComponentDidMount).toHaveBeenCalled();
    });
  });
});
