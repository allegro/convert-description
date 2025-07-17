const js = require("@eslint/js");
const { defineConfig } = require("eslint/config");
const globals = require("globals");
const markdown = require("eslint-plugin-markdown");
const prettierRecommended = require("eslint-plugin-prettier/recommended");
const react = require("eslint-plugin-react");
const reactHooks = require("eslint-plugin-react-hooks");
const tseslint = require("typescript-eslint");

module.exports = tseslint
  .config({
    extends: [js.configs.recommended, tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  })
  .concat(
    defineConfig([
      {
        extends: [js.configs.recommended],
        files: ["**/*.js"],
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
        extends: [react.configs.flat.recommended],
        files: ["**/*.tsx"],
        settings: {
          react: {
            version: "detect",
          },
        },
      },
      reactHooks.configs["recommended-latest"],
      {
        extends: [markdown.configs.recommended],
        languageOptions: {
          globals: {
            ...globals.node,
            ...globals.browser,
          },
        },
      },
      prettierRecommended,
      {
        files: ["*.config.js", "bin/**/*.js"],
        languageOptions: {
          globals: globals.node,
        },
      },
      {
        files: ["src/**/*.js", "test/**/*.js", "site/**/*.{ts,tsx}"],
        languageOptions: {
          globals: globals.browser,
        },
      },
      {
        files: ["test/**/*.spec.js"],
        languageOptions: {
          globals: globals.mocha,
        },
      },
      {
        ignores: ["dist/", "site/static/"],
      },
    ]),
  );
