import {suite, test} from "mocha";
import {strict as assert} from "node:assert";
import process from "node:process";

import {fileExists} from "./fileSystem.js";
import {projectPath} from "./project.js";

suite('fixture/', () => {
  suite('project', () => {
    test('child', () => {
      assert(projectPath('foo').includes('foo'));
    });

    test('absolute path', () => {
      const cwd = process.cwd();
      process.chdir('/');
      try {
        assert(fileExists(projectPath('src/unfat.ts')));
      } finally {
        process.chdir(cwd);
      }
    });
  });
});
