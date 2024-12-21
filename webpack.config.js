const autoprefixer = require("autoprefixer");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const { Logger } = require("sass");

const packageJson = require("./package.json");

const dependenciesWhitelist = [
  "sanitize-html", // It must be included to be transpiled since the module is written for nodejs.
];

module.exports = [
  {
    entry: path.resolve(__dirname, "src/index.js"),
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
          },
        },
      ],
    },
    externals: Object.keys(packageJson.dependencies).filter(
      (dep) => !dependenciesWhitelist.includes(dep),
    ),
    output: {
      filename: "umd.js",
      globalObject: "this",
      library: {
        name: "convertDescription",
        type: "umd",
      },
    },
  },
  {
    entry: path.resolve(__dirname, "site/src/ts/index.tsx"),
    plugins: [
      new MiniCssExtractPlugin({
        filename: "[name].[contenthash].css",
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "site/src/html/index.html"),
      }),
    ],
    module: {
      rules: [
        {
          test: /\.(scss)$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: "css-loader",
            },
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  plugins: () => [autoprefixer],
                },
              },
            },
            {
              loader: "sass-loader",
              options: {
                sassOptions: {
                  quietDeps: true,
                  logger: Logger.silent,
                },
              },
            },
          ],
        },
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
      ],
    },
    devServer: {
      static: false,
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    output: {
      filename: "[name].[contenthash].js",
      path: path.resolve(__dirname, "site/static"),
    },
  },
];
