import {suite, test} from "mocha";

import {strict as assert} from "node:assert";

import {Driver} from "./driver.js";
import {type Files, startServer} from "./httpServer.js";
import {typescriptInWebpage} from "./typescript.js";

suite('fixture/', () => {
  suite('typescript', () => {
    test('to html string', async function () {
      this.timeout(8000);
      const files: Files = {
        '/': typescriptInWebpage("localStorage.setItem('foo', 'bar' as string);"),
      };
      assert.equal(
        await executeInWebpage(files, "return localStorage.getItem('foo');"),
        'bar',
      );
    });
  });
});

async function executeInWebpage(files: Files, javaScriptInRuntime: string): Promise<unknown> {
  const server = await startServer(files);
  const driver = new Driver(4000);
  try {
    await driver.openPage('http://localhost:' + server.port + '/');
    return await driver.execute(javaScriptInRuntime);
  } finally {
    await Promise.all([
      driver.close(),
      server.close(),
    ]);
  }
}
