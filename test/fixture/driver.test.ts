import {type AsyncFunc, type Context, suite, test} from "mocha";

import {strict as assert} from "node:assert";

import {caught} from "./caught.js";
import {Driver} from "./driver.js";
import {type Files, Server, startServer} from "./httpServer.js";

suite('fixture/', () => {
  suite('driver', () => {
    test('execute javascript',
      withServer(async (url: string) => {
        assert.equal(
          await executeScript(url, "return 'bar';"),
          'bar');
      }));

    test('execute javascript, with argument',
      withServer(async (url: string) => {
        assert.equal(
          await executeScript(url, "return arguments[0];", ['bar']),
          'bar');
      }));

    test('timeout', async () => {
      const driver = new Driver(1);
      assert.equal(
        await caught(driver.openPage('http://refused/')),
        'timeout',
      );
    });

    test('javascript error',
      withServedFiles({
          '/': '<script src="script.js"></script>',
          '/script.js': 'var var;',
        },
        async (run: Promise<void>): Promise<void> => {
          const error = await caught(run);
          assert(error.endsWith("Uncaught SyntaxError: Unexpected token 'var'"));
        }));
  });
});

function withServedFiles(files: Files, block: (run: Promise<void>) => Promise<void>): Mocha.AsyncFunc {
  return withServer(url =>
      withDriver(driver =>
        block(driver.openPage(url))),
    files);
}

async function executeScript(url: string, javaScript: string, executionArguments: string[] = []): Promise<unknown> {
  return withDriver(async driver => {
    await driver.openPage(url);
    return await driver.execute(javaScript, executionArguments);
  });
}

async function withDriver<T>(block: (driver: Driver) => Promise<T>): Promise<T> {
  const driver = new Driver(2000);
  try {
    return await block(driver);
  } finally {
    await driver.close();
  }
}

function withServer(block: (url: string) => Promise<void>, files: Files = {}): AsyncFunc {
  return async function (this: Context): Promise<void> {
    this.timeout(20000);
    const server: Server = await startServer(files);
    try {
      await block('http://localhost:' + server.port + '/');
    } finally {
      await server.close();
    }
  };
}
