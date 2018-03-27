import merge from "deepmerge";

import resolveParseToDOM from "./resolveParseToDOM";

const RESOLVERS = {
  parseToDOM: resolveParseToDOM,
};

function resolveOptions(options) {
  const defaultOptions = {
    gallery: [],
    normalizeHeadings: true,
    parseToDOM: undefined,
    ruleSet: [],
    validators: {
      ruleSetMatchValidator: () => {},
    },
  };
  const opts = merge(defaultOptions, options);
  for (const opt in opts) {
    if (RESOLVERS[opt]) {
      opts[opt] = RESOLVERS[opt](opts[opt]);
    }
  }
  return opts;
}

export default resolveOptions;
