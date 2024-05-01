import fs from "node:fs";
import {dirname, join} from "node:path";

export function typescriptInWebpage(fileName: string): void {
  const tsCode = JSON.stringify(read(fileName));
  const html = `
    <html>
    <body>
      <script src="https://unpkg.com/typescript@latest/lib/typescript.js"></script>
      <script>eval(window.ts.transpile(${tsCode}));</script>
    </body>
    </html>
  `;
  write(join(dirname(fileName), 'index.html'), html);
}

function read(path: string): string {
  return fs.readFileSync(path, {encoding: 'utf8', flag: 'r'});
}

function write(path: string, content: string): void {
  fs.writeFileSync(path, content);
}
