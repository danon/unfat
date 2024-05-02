import {type Suite, suite, test} from "mocha";

import {strict as assert} from "node:assert";
import {type ClientRequest, get, type IncomingMessage} from "node:http";
import {join} from "node:path";
import {tmpDirectory, write} from "./fileSystem.js";

import {type Files, Server, startServer, startServerFiles} from "./httpServer.js";

suite('fixture/', () => {
  suite('http server, in memory', function (this: Suite): void {
    this.timeout(10000);

    test('serve by path', async () => {
      const response: Response = await fetch({'/path': 'Ours is the fury'}, '/path');
      assert.equal(response.body, 'Ours is the fury');
    });

    test('status code, success', async () => {
      const response = await fetch({'/': ''}, '/');
      assert.equal(response.statusCode, 200);
    });

    test('status code, not found', async () => {
      const response = await fetch({}, '/missing');
      assert.equal(response.statusCode, 404);
    });

    test('serve as html', async () =>
      await assertContentType('/index.html', 'text/html; charset=utf-8'));

    test('serve as script', async () =>
      await assertContentType('/script.js', 'application/javascript'));
  });

  suite('http server, from file system', function (this: Suite): void {
    test('serve index.html', async () => {
      // given
      const directory = tmpDirectory();
      write(join(directory, 'index.html'), 'foo');
      // when, then
      await assertFileContent(directory, '/', 'foo');
    });

    test('serve file.html', async () => {
      // given
      const directory = tmpDirectory();
      write(join(directory, 'file.html'), 'foo');
      // when, then
      await assertFileContent(directory, '/file.html', 'foo');
    });

    test('missing index.html', async () => {
      // given
      const directory = tmpDirectory();
      // when, then
      await assertFileStatusCode(directory, '/', 404);
    });
  });
});

async function assertContentType(path: string, expected: string): Promise<void> {
  const response = await fetch({[path]: ''}, path);
  assert.equal(response.contentType, expected);
}

async function fetch(files: Files, path: string): Promise<Response> {
  return await fetchAndClose(await startServer(files), path);
}

async function assertFileContent(directory: string, path: string, expected: string): Promise<void> {
  const response = await requestFile(directory, path);
  assert.equal(response.body, expected);
}

async function assertFileStatusCode(directory: string, path: string, expected: number): Promise<void> {
  const response = await requestFile(directory, path);
  assert.equal(response.statusCode, expected);
}

async function requestFile(directory: string, path: string): Promise<Response> {
  return await fetchAndClose(await startServerFiles(directory), path);
}

async function fetchAndClose(server: Server, path: string): Promise<Response> {
  try {
    return await httpGet('http://localhost:' + server.port + path);
  } finally {
    await server.close();
  }
}

function httpGet(url: string, timeout: number = 200): Promise<Response> {
  return new Promise((resolve, reject): void => {
    const request: ClientRequest = get(url, {timeout}, handle(resolve));
    request.on('timeout', () => reject(new Error('timeout')));
    request.end();
  });
}

function handle(receive: (response: Response) => void) {
  return function (response: IncomingMessage): void {
    let body: string = '';
    const statusCode: number = response.statusCode!;
    const contentType: string = response.headers['content-type']!;
    response.on('data', part => body += part);
    response.on('end', () => receive({body, statusCode, contentType}));
  };
}

export interface Response {
  body: string;
  statusCode: number;
  contentType: string;
}
