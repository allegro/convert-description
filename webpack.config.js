const autoprefixer = require("autoprefixer");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const { Logger } = require("sass");

const packageJson = require("./package.json");

module.exports = [
  // Browser build - bundles all dependencies
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
    output: {
      filename: "index.umd.min.js",
      globalObject: "this",
      library: {
        name: "convertDescription",
        type: "umd",
      },
    },
  },
  // CJS Node build - externalizes dependencies
  {
    entry: path.resolve(__dirname, "src/index.js"),
    mode: "development",
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
    externals: Object.keys(packageJson.dependencies),
    output: {
      filename: "index.cjs.js",
      library: {
        type: "commonjs2",
      },
    },
    optimization: {
      minimize: false,
    },
  },
  // ESM Node build - externalizes dependencies
  {
    entry: path.resolve(__dirname, "src/index.js"),
    mode: "development",
    externals: Object.keys(packageJson.dependencies),
    output: {
      filename: "index.es.mjs",
      library: { type: "module" },
    },
    experiments: {
      outputModule: true,
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: { loader: "babel-loader" },
        },
      ],
    },
    optimization: {
      minimize: false,
    },
  },
  // Site build - for development and production
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
