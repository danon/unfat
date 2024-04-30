import {suite, test} from "mocha";
import {strict as assert} from "node:assert";

import {History} from "../../src/unfat.js";

suite('unit/', (): void => {
  test('start', (): void => {
    const history = new History();
    assert.equal(history.currentCalories, 0);
  });
});
