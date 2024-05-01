import fs from "node:fs";
import {tmpdir} from "node:os";
import {dirname, join} from "node:path";

export function read(file: string): string {
  return fs.readFileSync(file, {encoding: 'utf8'});
}

export function write(file: string, content: string): void {
  createDirectory(dirname(file));
  fs.writeFileSync(file, content);
}

export function tmpDirectory(): string {
  return fs.mkdtempSync(join(tmpdir(), 'unfat.test.'));
}

function createDirectory(path: string): void {
  if (!fileExists(path)) {
    fs.mkdirSync(path, {recursive: true});
  }
}

export function fileExists(path: string): boolean {
  return fs.existsSync(path);
}

export function writeMany(path: string, children: Children): void {
  for (const [name, content] of Object.entries(children)) {
    write(join(path, name), content);
  }
}

export interface Children {
  [key: string]: string;
}
