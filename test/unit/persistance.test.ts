import {suite, suiteTeardown, test} from "mocha";

import {addMealWithName, assert, BrowserPage, getHistoryMealNames, reloadPage} from "./fixture/dsl.js";

suite('unit/', () => {
  suite('persistence', () => {
    const page = new BrowserPage();

    suiteTeardown(async () => await page.close());

    test('persist meal name',
      page.run([
        addMealWithName('Apple'),
        reloadPage(),
        assert(getHistoryMealNames(), ['Apple']),
      ]));
  });
});
