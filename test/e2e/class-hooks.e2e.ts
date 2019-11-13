import eventually from 'wix-eventually';
import { TestAppDriver } from '../drivers/test-app';

describe('Class Hooks E2E tests', () => {
  jest.setTimeout(30000);

  const testAppDriver = new TestAppDriver();

  beforeAll(() =>
    testAppDriver.start());

  afterAll(() =>
    testAppDriver.stop());

  describe('when used in a react.js web application', () => {
    describe('all hooks', () => {
      it('should work as expected by wrapping componentDidMount with extra logic', async () => {
        await testAppDriver.when.navigatingToTestApp();

        expect(await testAppDriver.get.titleThatWasPassedFromContext()).toBe('Test App Race');

        await eventually(async () => {
          expect(await testAppDriver.get.timeThatIsDisplayed()).toEqual(3);
        });
      });
    });
  });
});
