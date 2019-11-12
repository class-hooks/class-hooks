import { TestAppDriver } from '../drivers/test-app';

describe('Class Hooks E2E tests', () => {
  jest.setTimeout(30000);

  const testAppDriver = new TestAppDriver();

  beforeAll(() =>
    testAppDriver.start());

  afterAll(() =>
    testAppDriver.stop());

  describe('when used in a react.js web application', () => {
    describe('when using useLifecycle(target, "componentDidMount")', () => {
      it('should work as expected by wrapping componentDidMount with extra logic', async () => {
        await testAppDriver.when.navigatingToTestApp();
        expect(await testAppDriver.get.componentDidMountWasExecutedOnMount()).toBe(true);
        expect(await testAppDriver.get.useLifecycleHookWasExecutedOnMount()).toBe(true);
      });
    });

    describe('when using useState(target, 0)', () => {
      it('should work as expected by providing a numerical state', async () => {
        await testAppDriver.when.navigatingToTestApp();
        await testAppDriver.when.clickingOnCounterButton();
        expect(await testAppDriver.get.counterValue()).toBe(1);
      });
    });
  });
});
