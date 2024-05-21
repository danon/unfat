import {type Context, type Suite, suite, suiteSetup, suiteTeardown, test} from "mocha";
import {strict as assert} from "node:assert";

import {Browser} from "./browser.js";

suite('fixture/', () => {
  suite('browser', () => {
    test('close new browser', async () => {
      const browser = new Browser();
      await browser.close();
    });

    suite('browser', function (this: Suite): void {
      this.timeout(20000);
      const browser = new Browser();

      suiteSetup(() => browser.open());
      suiteTeardown(() => browser.close());

      test('reload page', async function (this: Context) {
        // given
        await write('initial content');
        // when
        await browser.reload();
        // then
        const body = await bodyHtml();
        assert(!body.includes('initial content'));
      });

      async function write(overridden: string): Promise<void> {
        await browser.execute("document.write(arguments[0]);", [overridden]);
      }

      async function bodyHtml(): Promise<string> {
        return await browser.execute('return document.body.innerHTML;', []) as string;
      }
    });
  });
});
