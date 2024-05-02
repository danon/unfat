import HtmlWebpackPlugin from "html-webpack-plugin";
import {dirname, join} from "node:path";
import {fileURLToPath} from "node:url";
import webpack from "webpack";

export function typescriptInWebpage(fileName: string): Promise<void> {
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
  return new Promise(resolve => compiler.run(() => resolve()));
}

function tsconfigFilename(): string {
  return join(dirname(fileURLToPath(import.meta.url)), '../../tsconfig.json');
}
