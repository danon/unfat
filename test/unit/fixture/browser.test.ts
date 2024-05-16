import {suite, test} from "mocha";

import {Browser} from "./browser.js";

suite('unit/', () => {
  suite('fixture/', () => {
    suite('browser', () => {
      test('close new browser', async () => {
        const browser = new Browser();
        await browser.close();
      });
    });
  });
});
