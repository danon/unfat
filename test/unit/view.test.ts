import {suite, suiteTeardown, test} from "mocha";

import {
  addMealWithCalories,
  addMealWithName,
  assert,
  BrowserPage,
  currentCalories,
  getCaloriesInputText,
  getHistoryMeals,
  getNameInputText,
  submitMeal,
  typeCalories,
  typeName,
} from "./fixture/dsl.js";

suite('unit/', () => {
  suite('view', () => {
    const page = new BrowserPage();

    suiteTeardown(() => page.close());

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
          assert(getHistoryMeals(), ['Apple', 'Banana']),
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
