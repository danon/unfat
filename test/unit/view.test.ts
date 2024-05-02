import {suite, test} from "mocha";
import {strict as assert} from "node:assert";

import {Browser} from "./fixture/browser.js";

suite('unit/', () => {
  suite('view', () => {
    test('zero calories', async function () {
      this.timeout(10000);
      const browser = new Browser();
      await browser.open();
      const currentCalories = await browser.execute("return parseInt(document.querySelector('#currentCalories').textContent);", []);
      await browser.close();
      assert.equal(currentCalories, 0);
    });
  });
});
