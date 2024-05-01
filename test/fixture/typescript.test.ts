import {suite, test} from "mocha";

import {strict as assert} from "node:assert";
import * as fs from "node:fs";
import {join} from "node:path";

import {Driver} from "./driver.js";
import {type Children, fileExists, read, tmpDirectory, writeMany} from "./fileSystem.js";
import {type Files, startServer} from "./httpServer.js";
import {javascriptInWebpage, typescriptInWebpage} from "./typescript.js";

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
      const publicDirectory = await javascriptInWebpageFiles({'file.js': ''}, 'file.js');
      assert(fileExists(join(publicDirectory, 'index.html')));
    });

    test('import javascript', async function () {
      this.timeout(8000);
      const publicDirectory = await javascriptInWebpageFiles(
        {
          'file.ts': 'import {value} from "./other.js"; localStorage.setItem("value", value);',
          'other.js': "export const value='bar';",
        },
        'file.ts',
      );
      assert.equal(
        await executeInWebpage(publicDirectory, "return localStorage.getItem('value');"),
        'bar',
      );
    });
  });
});

async function typescriptInWebpageFile(typescript: string): Promise<string> {
  const dir = directoryFiles({'file.ts': typescript});
  typescriptInWebpage(join(dir, 'file.ts'));
  return dir;
}

async function javascriptInWebpageFiles(fileSystem: Children, inputFilename: string): Promise<string> {
  const dir = directoryFiles(fileSystem);
  await javascriptInWebpage(join(dir, inputFilename));
  return dir;
}

function directoryFiles(fileSystem: Children): string {
  const dir: string = tmpDirectory();
  writeMany(dir, fileSystem);
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
  const files: Files = {};
  for (const fileName of fs.readdirSync(path)) {
    files['/' + fileName] = read(join(path, fileName));
  }
  return {'/': files['/index.html'], ...files};
}
