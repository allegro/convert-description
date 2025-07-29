import sanitizeHtml from "sanitize-html";

import clearDescription from "./clearDescription";
import extractItemsFromElement from "./extractItemsFromElement";
import converter from "./converters";
import polyfillDOM from "./libs/polyfillDOM";
import { resolveOptions } from "./options";

const NOT_ALLOWED_TAGS = new Set(["script"]);

function convertDescriptionToItems(description, options = {}) {
  const opts = resolveOptions(options);
  const { ruleSet, parseToDOM, validators } = opts;

  const sanitizedDescription = sanitizeHtml(description, {
    allowedTags: false,
    allowedAttributes: false,
    allowVulnerableTags: true,
    exclusiveFilter: (frame) => NOT_ALLOWED_TAGS.has(frame.tag),
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
