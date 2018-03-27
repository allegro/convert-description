import InlineElements from "../constants/InlineElements";
import Node from "../constants/Node";
import isBlankText from "../libs/isBlankText";
import replaceElementWithContent from "../libs/replaceElementWithContent";

const B_TAG = "B";
const INLINE_ELEMENTS_TO_REMOVE = new Set(InlineElements);
INLINE_ELEMENTS_TO_REMOVE.delete("BR");
INLINE_ELEMENTS_TO_REMOVE.delete(B_TAG);
INLINE_ELEMENTS_TO_REMOVE.delete("IMG");

function removeInlineElements(el) {
  let childNodes = [...el.childNodes];
  for (let i = 0; i < childNodes.length; i += 1) {
    const childNode = childNodes[i];

    if (childNode.nodeType === Node.ELEMENT_NODE) {
      removeInlineElements(childNode);
    }
  }

  childNodes = [...el.childNodes];
  for (let i = 0; i < childNodes.length; i += 1) {
    const childNode = childNodes[i];

    if (INLINE_ELEMENTS_TO_REMOVE.has(childNode.tagName)) {
      replaceElementWithContent(childNode);
    }
  }
}

function boldText(el) {
  let childNodes = [...el.childNodes];
  const document = el.ownerDocument;

  for (let i = 0; i < childNodes.length; i += 1) {
    const childNode = childNodes[i];

    if (childNode.nodeType === Node.ELEMENT_NODE) {
      if (childNode.tagName === B_TAG) {
        ensureBTagHasOnlyText(childNode);
      } else {
        boldText(childNode);
      }
    }
  }

  childNodes = [...el.childNodes];

  for (let i = 0; i < childNodes.length; i += 1) {
    const childNode = childNodes[i];

    if (childNode.nodeType === Node.TEXT_NODE) {
      if (!isBlankText(childNode.textContent)) {
        const bElement = document.createElement(B_TAG);
        bElement.textContent = childNode.textContent;
        el.replaceChild(bElement, childNode);
      }
    }
  }
}

function ensureBTagHasOnlyText(el) {
  if (
    el.childNodes.length !== 1 ||
    el.childNodes[0].nodeType !== Node.TEXT_NODE
  ) {
    boldText(el);
    replaceElementWithContent(el);
  }
}

function ensureBTagsHaveOnlyText(node) {
  const childNodes = [...node.childNodes];
  for (let i = 0; i < childNodes.length; i += 1) {
    const childNode = childNodes[i];

    if (childNode.nodeType === Node.ELEMENT_NODE) {
      if (childNode.tagName === B_TAG) {
        ensureBTagHasOnlyText(childNode);
      } else {
        ensureBTagsHaveOnlyText(childNode);
      }
    }
  }
}

function inlineElementConverter(dom) {
  removeInlineElements(dom.window.document.body);
  ensureBTagsHaveOnlyText(dom.window.document.body);
}

export default inlineElementConverter;
