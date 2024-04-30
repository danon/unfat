import {suite, test} from "mocha";
import {strict as assert} from "node:assert";

import {TestCalendar} from "./calendar.js";

suite('fixture/', () => {
  suite('calendar', () => {
    test('start at 0', () => {
      const calendar = new TestCalendar();
      assert.equal(calendar.day(), 0);
    });

    test('next day', () => {
      const calendar = new TestCalendar();
      calendar.nextDay();
      assert.equal(calendar.day(), 1);
    });

    test('two days', () => {
      const calendar = new TestCalendar();
      calendar.nextDay();
      calendar.nextDay();
      assert.equal(calendar.day(), 2);
    });
  });
});
