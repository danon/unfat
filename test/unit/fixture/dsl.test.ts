import {suite, suiteTeardown, test} from "mocha";

import {assert, BrowserPage, type Command, execute} from "./dsl.js";

suite('unit/', () => {
  suite('fixture/', () => {
    suite('dsl/', () => {
      const page = new BrowserPage();

      suiteTeardown(() => page.close());

      test('reset localStorage',
        page.run([
          browserWithInitialLocalStorage(),
          reset(page),
          assertLocalStorageEmpty(),
        ]));
    });
  });
});

function reset(page: BrowserPage): Command<void> {
  return async browser => await page.reset();
}

function browserWithInitialLocalStorage(): Command<void> {
  return execute<void>("window.localStorage.setItem('key', 'value');");
}

function assertLocalStorageEmpty(): Command<void> {
  return assert(execute("return window.localStorage.getItem('key');"), null);
}
