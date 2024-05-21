import {suite, suiteTeardown, teardown, test} from "mocha";

import {addMealWithName, assert, BrowserPage, getHistoryMealNames, reloadPage} from "./fixture/dsl.js";

suite('unit/', () => {
  suite('persistence', () => {
    const page = new BrowserPage();

    teardown(() => page.reset());
    suiteTeardown(() => page.close());

    test('persist meal name',
      page.run([
        addMealWithName('Apple'),
        reloadPage(),
        assert(getHistoryMealNames(), ['Apple']),
      ]));

    test('persist multiple meals',
      page.run([
        addMealWithName('Banana'),
        addMealWithName('Pear'),
        reloadPage(),
        assert(getHistoryMealNames(), ['Banana', 'Pear']),
      ]));
  });
});
