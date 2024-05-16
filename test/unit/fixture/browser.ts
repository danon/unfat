import {Driver} from "../../fixture/driver.js";
import {type Server, startServerFiles} from "../../fixture/httpServer.js";
import {projectPath} from "../../fixture/project.js";
import {typescriptInWebpage} from "../../fixture/typescript.js";

export class Browser {
  private server: Server|null = null;
  private driver: Driver = new Driver(2000);

  public async open(): Promise<void> {
    if (this.server === null) {
      await this.buildWebpage();
      this.server = await this.startServer();
    }
    await this.driver.openPage('http://localhost:' + this.server.port + '/');
  }

  private async buildWebpage(): Promise<void> {
    await typescriptInWebpage(
      projectPath('src/view.ts'),
      projectPath('build/'),
    );
  }

  private startServer(): Promise<Server> {
    return startServerFiles(projectPath('build/'));
  }

  public async type(cssSelector: string, text: string): Promise<void> {
    await this.driver.type(cssSelector, text);
  }

  public async click(cssSelector: string): Promise<void> {
    await this.driver.click(cssSelector);
  }

  public execute(javaScript: string, args: string[]): Promise<unknown> {
    return this.driver.execute(javaScript, args);
  }

  public async close(): Promise<void> {
    this.server?.close(); // intentionally no await
    await this.driver.close();
  }
}
