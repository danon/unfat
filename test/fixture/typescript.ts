import HtmlWebpackPlugin from "html-webpack-plugin";
import fs from "node:fs";
import {dirname, join} from "node:path";
import webpack from "webpack";

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

export async function javascriptInWebpage(fileName: string): Promise<void> {
  const compiler = webpack({
    entry: fileName,
    output: {path: dirname(fileName)},
    plugins: [
      new HtmlWebpackPlugin({templateContent: ''}),
    ],
  });
  return new Promise(resolve => compiler.run(() => resolve()));
}
