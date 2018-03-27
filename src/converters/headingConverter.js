import Node from "../constants/Node";
import replaceElementWithContent from "../libs/replaceElementWithContent";

const LIST_TAGS = new Set(["UL", "OL", "LI"]);
const B_TAG = "B";
const P_TAG = "P";

const MAX_HEADING_LEVEL = 2;

function changeElementTagName(el, tagName) {
  const newEl = el.ownerDocument.createElement(tagName);
  [...el.childNodes].forEach((childNode) => newEl.appendChild(childNode));
  el.parentNode.replaceChild(newEl, el);
  return newEl;
}

function createReplacement(document, level) {
  if (level <= MAX_HEADING_LEVEL) {
    const element = document.createElement(`h${level}`);
    return { root: element, leaf: element };
  }
  const element = document.createElement(P_TAG);
  return {
    root: element,
    leaf: element.appendChild(document.createElement(B_TAG)),
  };
}

function convertHeading(document, heading, level) {
  const replacement = createReplacement(document, level);
  [...heading.childNodes].forEach((node) => replacement.leaf.appendChild(node));
  heading.parentNode.replaceChild(replacement.root, heading);
}

function isIncorrectHeading(el) {
  return (
    el.childNodes.length === 0 ||
    [].some.call(
      el.childNodes,
      (node) => node.nodeType === Node.ELEMENT_NODE && node.tagName !== B_TAG,
    )
  );
}

function replaceWithContentIncorrectHeaders(headings) {
  return headings.filter((heading) => {
    if (isIncorrectHeading(heading)) {
      replaceElementWithContent(heading);
      return false;
    }

    return true;
  });
}

function convertHeadersContainedInList(headings) {
  return headings.filter((heading) => {
    const parentNode = heading.parentNode;
    if (LIST_TAGS.has(parentNode.tagName)) {
      const bElement = changeElementTagName(heading, B_TAG);
      const pElement = heading.ownerDocument.createElement(P_TAG);
      bElement.parentNode.insertBefore(pElement, bElement);
      pElement.appendChild(bElement);
      return false;
    }

    return true;
  });
}

function ensureHeadingsContainNoBTag(headings) {
  headings.forEach((heading) =>
    [...heading.childNodes].forEach((childNode) => {
      if (childNode.tagName === B_TAG) {
        replaceElementWithContent(childNode);
      }
    }),
  );
}

function headingConverter(dom, options) {
  const document = dom.window.document;

  let convertHeadings;
  if (options.normalizeHeadings) {
    let normalizedLevel = 0;
    convertHeadings = (headings, level) => {
      normalizedLevel += 1;
      if (normalizedLevel !== level || normalizedLevel > MAX_HEADING_LEVEL) {
        [...headings].forEach((heading) =>
          convertHeading(document, heading, normalizedLevel),
        );
      }
    };
  } else {
    convertHeadings = (headings, level) => {
      if (level > MAX_HEADING_LEVEL) {
        [...headings].forEach((heading) =>
          convertHeading(document, heading, level),
        );
      }
    };
  }

  for (let level = 1; level <= 6; level += 1) {
    let headings = [...document.getElementsByTagName(`h${level}`)];
    if (headings.length > 0) {
      headings = replaceWithContentIncorrectHeaders(headings);
      ensureHeadingsContainNoBTag(headings);
      headings = convertHeadersContainedInList(headings);
      convertHeadings(headings, level);
    }
  }
}

export default headingConverter;
