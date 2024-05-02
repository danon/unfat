import HtmlWebpackPlugin from "html-webpack-plugin";
import {dirname} from "node:path";
import webpack from "webpack";

import {fileExists} from "./fileSystem.js";
import {projectPath} from "./project.js";

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
          options: {configFile: projectPath('tsconfig.json')},
        },
      ],
    },
  });
  return await new Promise(resolve => compiler.run(() => resolve()));
}
