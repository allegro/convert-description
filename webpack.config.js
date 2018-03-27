const packageJson = require("./package.json");

module.exports = {
  output: {
    globalObject: "this",
    library: {
      name: "convertDescription",
      type: "umd",
    },
  },
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
};
