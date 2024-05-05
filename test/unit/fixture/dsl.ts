import type {AsyncFunc, Context} from "mocha";
import {strict} from "node:assert";

import {Browser} from "./browser.js";

type Command<T> = (browser: Browser) => Promise<T>;

export class BrowserPage {
  private browser = new Browser();

  public run(commands: Command<void>[]): AsyncFunc {
    const browser = this.browser;
    return async function (this: Context): Promise<void> {
      this.timeout(10000);
      await browser.open();
      await each(commands)(browser);
    };
  }

  public close(): Promise<void> {
    return this.browser.close();
  }
}

function each(commands: Command<void>[]): Command<void> {
  return async function (browser: Browser): Promise<void> {
    for (const command of commands) {
      await command(browser);
    }
  };
}

function execute<T>(javaScript: string, args: string[]): Command<T> {
  return browser => browser.execute(javaScript, args) as Promise<T>;
}

export function currentCalories(): Command<number> {
  return execute("return parseInt(document.querySelector('#currentCalories').textContent);", []);
}

export function typeCalories(calories: string): Command<void> {
  return execute("document.querySelector('input#calories').value = arguments[0];", [calories]);
}

export function submitMeal(): Command<void> {
  return execute("document.querySelector('button').click();", []);
}

export function addMealWithCalories(calories: number): Command<void> {
  return each([
    typeCalories(calories.toString()),
    submitMeal(),
  ]);
}

export function typeName(name: string): Command<void> {
  return execute("document.querySelector('input#name').value = arguments[0];", [name]);
}

export function getCaloriesInputText(): Command<string> {
  return execute("return document.querySelector('input#calories').value;", []);
}

export function getNameInputText(): Command<string> {
  return execute("return document.querySelector('input#name').value;", []);
}

export function addMealWithName(name: string): Command<void> {
  return each([
    typeName(name),
    submitMeal(),
  ]);
}

export function getHistoryMealNames(): Command<string[]> {
  return execute("return Array.from(document.querySelectorAll('ul li p')).map(p => p.textContent);", []);
}

export function getHistoryMealEnergies(): Command<number[]> {
  return execute("return Array.from(document.querySelectorAll('ul li span')).map(span => parseInt(span.textContent));", []);
}

export function assert<T>(command: Command<T>, expected: T): Command<void> {
  return async function (browser: Browser): Promise<void> {
    strict.deepEqual(await command(browser), expected);
  };
}
