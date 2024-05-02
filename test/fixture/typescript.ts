import HtmlWebpackPlugin from "html-webpack-plugin";
import {dirname, join} from "node:path";
import {fileURLToPath} from "node:url";
import webpack from "webpack";

import {fileExists} from "./fileSystem.js";

export async function typescriptInWebpage(fileName: string): Promise<void> {
  if (!fileExists(fileName)) {
    throw new Error('Failed to transpile file: ' + fileName);
  }
  const compiler = webpack({
    entry: fileName,
    output: {path: dirname(fileName)},
    resolve: {extensionAlias: {'.js': ['.js', '.ts']}},
    plugins: [
      new HtmlWebpackPlugin({templateContent: ''}),
    ],
    module: {
      rules: [
        {
          test: /\.ts$/,
          loader: 'ts-loader',
          options: {configFile: tsconfigFilename()},
        },
      ],
    },
  });
  return await new Promise(resolve => compiler.run(() => resolve()));
}

function tsconfigFilename(): string {
  return join(dirname(fileURLToPath(import.meta.url)), '../../tsconfig.json');
}
