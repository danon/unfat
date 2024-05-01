import {suite, test} from "mocha";

import {strict as assert} from "node:assert";
import {join} from "node:path";

import {Driver} from "./driver.js";
import {fileExists, read, tmpDirectory, write} from "./fileSystem.js";
import {type Files, startServer} from "./httpServer.js";
import {typescriptInWebpage} from "./typescript.js";

suite('fixture/', () => {
  suite('typescript', () => {
    test('to html file', async function () {
      this.timeout(8000);
      const publicDirectory = await typescriptInWebpageFile("localStorage.setItem('foo', 'bar' as string);");
      assert.equal(
        await executeInWebpage(publicDirectory, "return localStorage.getItem('foo');"),
        'bar',
      );
    });

    test('creates index.html', async function () {
      this.timeout(8000);
      const publicDirectory = await typescriptInWebpageFile('');
      assert(fileExists(join(publicDirectory, 'index.html')));
    });
  });
});

async function typescriptInWebpageFile(typescript: string): Promise<string> {
  const dir: string = tmpDirectory();
  write(join(dir, 'file.ts'), typescript);
  typescriptInWebpage(join(dir, 'file.ts'));
  return dir;
}

async function executeInWebpage(publicDirectory: string, javaScriptInRuntime: string): Promise<unknown> {
  const server = await startServer(webpageFiles(publicDirectory));
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

function webpageFiles(path: string): Files {
  return {'/': read(join(path, 'index.html'))};
}
