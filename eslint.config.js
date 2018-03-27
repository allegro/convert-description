const pluginMarkdown = require("eslint-plugin-markdown");
const pluginPrettierRecommended = require("eslint-plugin-prettier/recommended");
const globals = require("globals");
const pluginJs = require("@eslint/js");

module.exports = [
  pluginJs.configs.recommended,
  pluginPrettierRecommended,
  ...pluginMarkdown.configs.recommended,
  {
    files: ["src/**/*.js", "test/**/*.js"],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    files: ["*.config.js"],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    rules: {
      "no-unused-vars": [
        "error",
        {
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    files: ["test/**/*.spec.js"],
    languageOptions: {
      globals: globals.mocha,
    },
  },
  {
    ignores: ["dist/"],
  },
];
