import {suite, test} from "mocha";
import {strict as assert} from "node:assert";
import fs from "node:fs";
import {join} from "node:path";

import {fileExists, read, tmpDirectory, write, writeMany} from "./fileSystem.js";

suite('fixture/', () => {
  suite('file system', () => {
    suite('temporary directory', () => {
      test('suffix', () => {
        assert(tmpDirectory().includes('unfat.test.'));
      });
      test('exists', () => {
        assert(fs.existsSync(tmpDirectory()));
      });
    });

    suite('write', () => {
      test('file', () => {
        // given
        const path = join(tmpDirectory(), 'file.txt');
        // when
        write(path, 'foo');
        // then
        assertFileExistsWithContent(path, 'foo');
      });
      test('nested', () => {
        // given
        const path = join(tmpDirectory(), 'parent', 'double', 'file.txt');
        // when
        write(path, 'foo');
        // then
        assertFileExistsWithContent(path, 'foo');
      });
    });

    suite('exists', () => {
      test('missing', () => {
        assert.equal(fileExists('/missing'), false);
      });

      test('existing', () => {
        assert.equal(fileExists(existingFile()), true);
      });
    });

    suite('read', () => {
      test('missing', () => {
        // given
        const path = existingFile('foo');
        // when, then
        assert.equal(read(path), 'foo');
      });
    });

    suite('createMany', () => {
      test('createMany', () => {
        // given
        const path = tmpDirectory();
        // when
        writeMany(path, {'a.txt': 'a', 'b.txt': 'b'});
        // then
        assertFileExistsWithContent(join(path, 'a.txt'), 'a');
        assertFileExistsWithContent(join(path, 'b.txt'), 'b');
      });
    });
  });
});

function assertFileExistsWithContent(path: string, expected: string): void {
  assert.equal(fs.readFileSync(path).toString(), expected);
}

function existingFile(content: string = ''): string {
  const path = join(tmpDirectory(), 'file.txt');
  write(path, content);
  return path;
}
