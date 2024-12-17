const packageJson = require("./package.json");

const dependenciesWhitelist = [
  "sanitize-html", // It must be included to be transpiled since the module is written for nodejs.
];

module.exports = {
  output: {
    filename: "umd.js",
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
  externals: Object.keys(packageJson.dependencies).filter(
    (dep) => !dependenciesWhitelist.includes(dep),
  ),
};
