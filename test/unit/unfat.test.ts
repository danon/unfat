import {suite, test} from "mocha";
import {strict as assert} from "node:assert";

import {History, type Meal, type Store} from "../../src/unfat.js";
import {TestCalendar} from "../fixture/calendar.js";

suite('unit/', () => {
  suite('domain', () => {
    suite('calories', () => {
      function newHistory() {
        return new History(new TestCalendar(), new TestStore());
      }

      test('start', (): void => {
        const history = newHistory();
        assert.equal(history.currentCalories, 0);
      });

      test('first meal', (): void => {
        const history = newHistory();
        history.addMeal('apple', 50, 150);
        assert.equal(history.currentCalories, 75);
      });

      test('calories as integer', (): void => {
        const history = newHistory();
        history.addMeal('apple', 10, 154);
        assert.equal(history.currentCalories, 15);
      });

      test('calories as integer, round up', (): void => {
        const history = newHistory();
        history.addMeal('apple', 10, 156);
        assert.equal(history.currentCalories, 16);
      });

      test('second meal', (): void => {
        const history = newHistory();
        history.addMeal('apple', 100, 70);
        history.addMeal('banana', 100, 120);
        assert.equal(history.currentCalories, 190);
      });
    });

    suite('days', () => {
      function twoDayHistory() {
        const calendar = new TestCalendar();
        const history = new History(calendar, new TestStore());
        history.addMeal('apple', 36, 150);
        calendar.nextDay();
        history.addMeal('banana', 70, 250);
        return history;
      }

      test('new day calories', () => {
        assert.equal(twoDayHistory().currentCalories, 175);
      });

      test('days calories', () => {
        assert.deepEqual(twoDayHistory().days, [54, 175]);
      });

      test('week average calories', () => {
        assert.deepEqual(twoDayHistory().weeks[0], 114.5);
      });
    });

    suite('dates', () => {
      test('separate weeks', () => {
        const calendar = new TestCalendar();
        const history = new History(calendar, new TestStore());
        caloriesEachDay(history, calendar, [
          122, 121, 123, 121, 123, 121, 123,
          340, 339, 341, 339, 341, 339, 341,
        ]);
        assert.deepEqual(history.weeks, [122, 340]);
      });

      test('not rolling weeks', () => {
        const calendar = new TestCalendar();
        const history = new History(calendar, new TestStore());
        caloriesEachDay(history, calendar, [
          122, 121, 123, 121, 123, 121, 123,
          340,
        ]);
        assert.deepEqual(history.weeks, [122, 340]);
      });

      function caloriesEachDay(history: History, calendar: TestCalendar, days: number[]): void {
        days.forEach(calories => {
          history.addMeal('juice', calories, 100);
          calendar.nextDay();
        });
      }
    });

    test('meals', () => {
      const history = new History(new TestCalendar(), new TestStore());
      history.addMeal('apple', 52, 50);
      history.addMeal('banana', 70, 150);
      assert.deepEqual(history.meals, [
        {name: 'apple', calories: 26},
        {name: 'banana', calories: 105},
      ]);
    });

    suite('persistence', () => {
      test('store meal', () => {
        const store = new TestStore();
        const history = new History(new TestCalendar(), store);
        history.addMeal('Banana', 70, 100);
        assert.deepEqual([meal('Banana', 70)], store.meals());
      });

      test('read meals', () => {
        const history = new History(new TestCalendar(), storeWithMeal('Apple', 80));
        assert.deepEqual([meal('Apple', 80)], history.meals);
      });

      function meal(name: string, calories: number): Meal {
        return {name, calories};
      }

      function storeWithMeal(name: string, calories: 80): Store {
        const store = new TestStore();
        store.addMeal(meal(name, calories));
        return store;
      }
    });
  });
});

class TestStore implements Store {
  private _meals: Meal[] = new Array();

  addMeal(meal: Meal): void {
    this._meals.push(meal);
  }

  meals(): Meal[] {
    return this._meals;
  }
}
