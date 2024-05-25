import HtmlWebpackPlugin from "html-webpack-plugin";
import webpack from "webpack";

import {fileExists} from "./fileSystem.js";
import {projectPath} from "./project.js";

export async function typescriptInWebpage(fileName: string, outputDirectory: string): Promise<void> {
  if (!fileExists(fileName)) {
    throw new Error('Failed to transpile file: ' + fileName);
  }
  const compiler = webpack({
    entry: fileName,
    output: {path: outputDirectory},
    resolve: {extensionAlias: {'.js': ['.js', '.ts']}},
    plugins: [
      new HtmlWebpackPlugin({templateContent: '<script src="https://cdn.tailwindcss.com"></script>'}),
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
