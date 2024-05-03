import {suite, test} from "mocha";

import {addMealWithCalories, assert, browserView, currentCalories} from "./fixture/dsl.js";

suite('unit/', () => {
  suite('view', () => {
    test('zero calories',
      browserView([
        assert(currentCalories(), 0),
      ]));

    test('show meal calories',
      browserView([
        addMealWithCalories(75),
        assert(currentCalories(), 75),
      ]));

    test('sum meal calories',
      browserView([
        addMealWithCalories(75),
        addMealWithCalories(35),
        assert(currentCalories(), 110),
      ]));
  });
});
