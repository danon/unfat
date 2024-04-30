import {suite, test} from "mocha";
import {strict as assert} from "node:assert";

import {History} from "../../src/unfat.js";

suite('unit/', () => {
  suite('history', () => {
    test('start', (): void => {
      const history = new History();
      assert.equal(history.currentCalories, 0);
    });

    test('first meal', (): void => {
      const history = new History();
      history.addMeal('apple', 150, 50);
      assert.equal(history.currentCalories, 75);
    });

    test('calories as integer', (): void => {
      const history = new History();
      history.addMeal('apple', 154, 10);
      assert.equal(history.currentCalories, 15);
    });

    test('calories as integer, round up', (): void => {
      const history = new History();
      history.addMeal('apple', 156, 10);
      assert.equal(history.currentCalories, 16);
    });

    test('second meal', (): void => {
      const history = new History();
      history.addMeal('apple', 70, 100);
      history.addMeal('banana', 120, 100);
      assert.equal(history.currentCalories, 190);
    });
  });
});
