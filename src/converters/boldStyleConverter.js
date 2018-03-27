import InlineElements from "../constants/InlineElements";
import Node from "../constants/Node";
import forEachChildElement from "../libs/forEachChildElement";
import getComputedStyle from "../libs/getComputedStyle";
import isBlankText from "../libs/isBlankText";

const ALLOWED_TAGS = new Set(InlineElements);
ALLOWED_TAGS.delete("A");
ALLOWED_TAGS.delete("B");
const BOLD_FONT_WEIGHTS = new Set(["bold", "700", "800", "900"]);
const IMG_TAG = "IMG";

function convertNodeToBoldElement(document, node, text) {
  const el = document.createElement("b");
  el.textContent = text;
  node.parentNode.replaceChild(el, node);
}

function containsText(el) {
  return [].some.call(
    el.childNodes,
    (node) => node.nodeType === Node.TEXT_NODE && !isBlankText(node.nodeValue),
  );
}

function elementHasBoldStyle(el, window) {
  const inlineStyle = el.style;
  if (inlineStyle.fontWeight) {
    return BOLD_FONT_WEIGHTS.has(inlineStyle.fontWeight);
  }

  const style = getComputedStyle(window, el);
  return style.fontWeight && BOLD_FONT_WEIGHTS.has(style.fontWeight);
}

function wrapTextNodes(node, window) {
  const document = window.document;
  const childNodes = node.childNodes;
  for (let i = 0; i < childNodes.length; i += 1) {
    const childNode = childNodes[i];
    if (childNode.nodeType === Node.TEXT_NODE) {
      const text = childNode.nodeValue;
      if (!isBlankText(text)) {
        convertNodeToBoldElement(document, childNode, text);
      }
    } else if (childNode.nodeType === Node.ELEMENT_NODE) {
      convertElement(childNode, window);
    }
  }
}

function convertElement(el, window) {
  if (el.tagName === IMG_TAG) return;

  if (
    ALLOWED_TAGS.has(el.tagName) &&
    containsText(el) &&
    elementHasBoldStyle(el, window)
  ) {
    if (el.children.length === 0) {
      convertNodeToBoldElement(window.document, el, el.textContent);
    } else {
      wrapTextNodes(el, window);
    }
  } else {
    forEachChildElement(el, (childEl) => convertElement(childEl, window));
  }
}

function boldStyleConverter(dom) {
  const window = dom.window;

  forEachChildElement(window.document, (child) => {
    convertElement(child, window);
  });
}

export default boldStyleConverter;
