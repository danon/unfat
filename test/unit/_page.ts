import {suiteTeardown} from "mocha";
import {BrowserPage} from "./fixture/dsl.js";

export const page = new BrowserPage();

suiteTeardown(() => page.close());
