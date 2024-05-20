import {Driver} from "./driver.js";
import {type Server, startServerFiles} from "./httpServer.js";
import {projectPath} from "./project.js";
import {typescriptInWebpage} from "./typescript.js";

export class Browser {
  private server: Server|null = null;
  private driver: Driver|null = null;

  public async open(): Promise<void> {
    if (this.driver === null) {
      this.driver = new Driver(2000);
    }
    if (this.server === null) {
      await this.buildWebpage();
      this.server = await this.startServer();
    }
    await this.reload();
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
    await this.driver!.type(cssSelector, text);
  }

  public async click(cssSelector: string): Promise<void> {
    await this.driver!.click(cssSelector);
  }

  public execute(javaScript: string, args: string[]): Promise<unknown> {
    return this.driver!.execute(javaScript, args);
  }

  public async reload(): Promise<void> {
    await this.driver!.openPage('http://localhost:' + this.server!.port + '/');
  }

  public async close(): Promise<void> {
    await Promise.all([
      this.server?.close(),
      this.driver?.close(),
    ]);
  }
}
