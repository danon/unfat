import {suite, test} from "mocha";
import {strict as assert} from "node:assert";

import {Browser} from "./fixture/browser.js";

suite('unit/', () => {
  suite('view', () => {
    test('zero calories', async function () {
      this.timeout(10000);
      const browser = new Browser();
      await browser.open();
      const currentCalories = await getCurrentCalories(browser);
      await browser.close();
      assert.equal(currentCalories, 0);
    });

    test('show meal calories', async function () {
      this.timeout(10000);
      // given
      const browser = new Browser();
      await browser.open();
      // when
      await addMealWithCalories(browser, 75);
      // then
      const currentCalories = await getCurrentCalories(browser);
      await browser.close();
      assert.equal(currentCalories, 75);
    });
  });
});

function getCurrentCalories(browser: Browser): Promise<unknown> {
  return browser.execute("return parseInt(document.querySelector('#currentCalories').textContent);", []);
}

async function addMealWithCalories(browser: Browser, calories: number): Promise<void> {
  await typeCalories(browser, calories.toString());
  await submitMeal(browser);
}

async function typeCalories(browser: Browser, caloriesText: string): Promise<void> {
  await browser.execute(
    "document.querySelector('input').value = arguments[0];",
    [caloriesText]);
}

async function submitMeal(browser: Browser): Promise<void> {
  await browser.execute("document.querySelector('button').click();", []);
}
