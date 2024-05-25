import {suite, teardown, test} from "mocha";

import {page} from "./_page.js";

import {
  addMealWithCalories,
  addMealWithName,
  assert,
  currentCalories,
  getCaloriesInputText,
  getHistoryMealEnergies,
  getHistoryMealNames,
  getNameInputText,
  submitMeal,
  typeCalories,
  typeName,
} from "./fixture/dsl.js";

suite('unit/', () => {
  suite('view', () => {
    teardown(() => page.reset());

    suite('logic', () => {
      test('zero calories',
        page.run([
          assert(currentCalories(), 0),
        ]));

      test('show meal calories',
        page.run([
          addMealWithCalories(75),
          assert(currentCalories(), 75),
        ]));

      test('sum meal calories',
        page.run([
          addMealWithCalories(75),
          addMealWithCalories(35),
          assert(currentCalories(), 110),
        ]));

      test('show meals history',
        page.run([
          addMealWithName('Apple'),
          addMealWithName('Banana'),
          assert(getHistoryMealNames(), ['Apple', 'Banana']),
        ]));

      test('show meal with calories history',
        page.run([
          addMealWithCalories(85),
          assert(getHistoryMealEnergies(), [85]),
        ]));
    });

    suite('controls', () => {
      test('resets calories text input',
        page.run([
          typeCalories('15'),
          submitMeal(),
          assert(getCaloriesInputText(), ''),
        ]));

      test('resets name text input',
        page.run([
          typeName('Apple'),
          submitMeal(),
          assert(getNameInputText(), ''),
        ]));
    });
  });
});
