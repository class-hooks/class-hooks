import puppeteer from 'puppeteer';
import path from 'path';
import { exec, ChildProcess } from 'child_process';
import { waitUrl } from '../utils/wait-url';

export class TestAppDriver {
  private readonly port: number;
  private parcelProcess: ChildProcess;
  private browser: puppeteer.Browser;
  private page: puppeteer.Page;

  constructor({ port = 1234 } = {}) {
    this.port = port;
  }

  async start() {
    const testAppFile = path.join(__dirname, '..', 'fixtures', 'test-app', 'index.html');
    this.parcelProcess = exec(`npx parcel -p ${this.port} ${testAppFile}`);
    await waitUrl(`http://localhost:${this.port}`);
    this.browser = await puppeteer.launch({ headless: false });
    this.page = await this.browser.newPage();
  }

  async stop() {
    this.parcelProcess && this.parcelProcess.kill();
    this.browser && await this.browser.close();
  }

  when = {
    navigatingToTestApp: async () => {
      await this.page.goto(`http://localhost:${this.port}`);
    }
  };

  get = {
    titleThatWasPassedFromContext: () =>
      this.page.$eval('[data-testid="title"]', e => e['innerText']),
    timeValue: () =>
      this.page
        .$eval('[data-testid="time"]', e => e['innerText'])
        .then(parseInt)
  };
}
