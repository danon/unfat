import {Builder, logging, WebDriver} from "selenium-webdriver";
import {Options} from "selenium-webdriver/chrome.js";

export class Driver {
  private driver: WebDriver;

  constructor(private timeout: number) {
    this.driver = this.driverInstance();
  }

  private driverInstance(): WebDriver {
    return new Builder()
      .forBrowser('chrome')
      .setChromeOptions(new Options().addArguments('--headless=new'))
      .build();
  }

  public async openPage(url: string): Promise<void> {
    await this.setTimeout(this.timeout);
    await this.navigateTo(url);
    await this.waitUntilDocumentReady();
    await this.throwExecutionError();
  }

  private async setTimeout(pageLoad: number): Promise<void> {
    await this.driver.manage()
      .setTimeouts({pageLoad: pageLoad, implicit: pageLoad, script: pageLoad});
  }

  private async navigateTo(url: string) {
    try {
      await this.driver.get(url);
    } catch (error: unknown) {
      await this.driver.quit();
      // @ts-ignore
      if (error.message.startsWith('timeout: Timed out receiving message from renderer')) {
        throw new Error('timeout');
      }
      throw error;
    }
  }

  private async waitUntilDocumentReady(): Promise<void> {
    await this.driver.wait(() => this.driver
      .executeScript('return document.readyState;')
      .then(readyState => readyState === 'complete'));
  }

  private async throwExecutionError(): Promise<void> {
    const entries = await this.driver.manage().logs().get(logging.Type.BROWSER);
    entries.forEach(entry => {
      if (entry.message.includes('the server responded with a status of 404')) {
        return;
      }
      throw new Error(entry.message);
    });
  }

  public async execute(javaScript: string, scriptArguments: string[] = []): Promise<unknown> {
    return this.driver.executeScript(javaScript, ...scriptArguments);
  }

  public async close(): Promise<void> {
    await this.driver.quit();
  }
}
