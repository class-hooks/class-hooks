import React from 'react';
import { LifecycleMethodName, useLifecycle } from '../../src/hooks/use-lifecycle';

describe('useLifecycle', () => {
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
