import {suite, teardown, test} from "mocha";

import {page} from "./_page.js";
import {addMealWithName, assert, getHistoryMealNames, reloadPage} from "./fixture/dsl.js";

suite('unit/', () => {
  suite('persistence', () => {
    teardown(() => page.reset());

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
