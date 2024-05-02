import {dirname, join} from "node:path";
import {fileURLToPath} from "node:url";

export function projectPath(path: string): string {
  return join(dirname(fileURLToPath(import.meta.url)), '../..', path);
}
