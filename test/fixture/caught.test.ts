import {suite, test} from "mocha";
import {strict as assert} from "node:assert";

import {caught} from "./caught.js";

suite('fixture/', () => {
  suite('caught', () => {
    test('pass', async () => {
      assert.equal(
        await caught(rejectedPromise(new Error('message'))),
        'message',
      );
    });

    test('fail, (promise success)', async () => {
      assertFailed(await throwable(resolvedPromise()));
    });

    test('fail, (thrown string)', async () => {
      assertFailed(await throwable(rejectedPromise('string')));
    });
  });
});

function assertFailed(thrown: Error|null): void {
  if (thrown === null) {
    assert(false);
    return;
  }
  assert.equal(
    thrown.message,
    'Failed to assert that error was thrown.',
  );
}

async function throwable(resolvedPromise: Promise<unknown>): Promise<Error|null> {
  try {
    await caught(resolvedPromise);
  } catch (throwable: unknown) {
    return throwable as Error;
  }
  return null;
}

async function resolvedPromise(): Promise<unknown> {
  return true;
}

async function rejectedPromise(throwable: Error|string): Promise<void> {
  throw throwable;
}
