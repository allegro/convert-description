import sanitizeHtml from "sanitize-html";

import clearDescription from "./clearDescription";
import extractItemsFromElement from "./extractItemsFromElement";
import converter from "./converters";
import polyfillDOM from "./libs/polyfillDOM";
import { resolveOptions } from "./options";

function convertDescriptionToItems(description, options = {}) {
  const opts = resolveOptions(options);
  const { ruleSet, parseToDOM, validators } = opts;

  const sanitizedDescription = sanitizeHtml(description, {
    allowedTags: false,
    allowedAttributes: false,
    allowVulnerableTags: true,
  });

  return parseToDOM(sanitizedDescription, (dom) => {
    polyfillDOM(dom);

    const matchedRuleCount = clearDescription(dom.window.document, ruleSet);
    validators.ruleSetMatchValidator(ruleSet.length, matchedRuleCount);

    converter(dom, opts);

    const body = dom.window.document.body;

    return extractItemsFromElement(body);
  });
}

export default convertDescriptionToItems;
