import Node from "../constants/Node";
import forEachChildElement from "../libs/forEachChildElement";
import replaceElementWithContent from "../libs/replaceElementWithContent";

const B_TAG = "B";
const BODY_TAG = "BODY";
const LIST_TAGS = new Set(["UL", "OL"]);
const LIST_ITEM_TAG = "LI";
const PARAGRAPH_TAG = "P";
const UNORDERED_LIST_TAG = "UL";

function putOrphanLiToUl(el) {
  let list = null;
  if (LIST_TAGS.has(el.tagName)) {
    forEachChildElement(el, putOrphanLiToUl);
  } else {
    forEachChildElement(el, (childEl) => {
      if (childEl.tagName === LIST_ITEM_TAG) {
        if (!list) {
          list = el.ownerDocument.createElement(UNORDERED_LIST_TAG);
          el.insertBefore(list, childEl);
        }
        list.appendChild(childEl);
      } else {
        list = null;
      }
      putOrphanLiToUl(childEl);
    });
  }
}

function containsLiElement(node) {
  for (let i = 0; i < node.childNodes.length; i += 1) {
    const childNode = node.childNodes[i];

    if (childNode.tagName === LIST_ITEM_TAG) {
      return true;
    }
  }

  return false;
}

function replaceListWithItsContentIfContainsNoLi(listNode) {
  if (!containsLiElement(listNode)) {
    replaceElementWithContent(listNode);
  }
}

function moveFreeParagraphs(listNode) {
  let lastListItemNode;
  forEachChildElement(listNode, (element) => {
    if (element.nodeName !== LIST_ITEM_TAG) {
      if (lastListItemNode) {
        if (lastListItemNode.childNodes.length === 0) {
          [...element.childNodes].forEach((childNode) =>
            lastListItemNode.appendChild(childNode),
          );
          element.parentNode.removeChild(element);
        } else {
          lastListItemNode.appendChild(element);
        }
      } else {
        listNode.parentNode.insertBefore(element, listNode);
      }
    } else {
      lastListItemNode = element;
    }
  });
}

function removeEmptyLi(listNode) {
  forEachChildElement(listNode, (element) => {
    if (element.nodeName === LIST_ITEM_TAG && element.childNodes.length === 0) {
      element.parentNode.removeChild(element);
    }
  });
}

function findContainerElement(listNode) {
  let currentEl = listNode.parentNode;
  while (currentEl.tagName !== BODY_TAG) {
    if (
      LIST_TAGS.has(currentEl.tagName) ||
      currentEl.tagName === LIST_ITEM_TAG
    ) {
      return currentEl;
    }

    currentEl = currentEl.parentNode;
  }

  return null;
}

class NodeAppender {
  constructor(rootNode, appender) {
    this.rootNode = rootNode;
    this.appender = appender;

    this.paragraphNode = null;
  }

  appendChild(node) {
    if (this.rootNode.tagName === LIST_ITEM_TAG) {
      if (node.nodeType === Node.TEXT_NODE || node.tagName === B_TAG) {
        if (!this.paragraphNode) {
          this.paragraphNode =
            this.rootNode.ownerDocument.createElement(PARAGRAPH_TAG);
          this.appender(this.paragraphNode);
        }

        this.paragraphNode.appendChild(node);
      } else {
        this.paragraphNode = null;

        if (node.tagName === LIST_ITEM_TAG) {
          [...node.childNodes].forEach((childNode) =>
            this.appendChild(childNode),
          );
        } else {
          this.appender(node);
        }
      }
    } else {
      this.appender(node);
    }
  }
}

function mergeNestedLists(listNode) {
  const containerEl = findContainerElement(listNode);
  if (!containerEl) {
    return;
  }

  const appender = (node) => containerEl.insertBefore(node, listNode);
  const nodeAppender = new NodeAppender(containerEl, appender);

  [...listNode.childNodes].forEach((childNode) =>
    nodeAppender.appendChild(childNode),
  );

  listNode.parentNode.removeChild(listNode);
}

function ensureFirstChildNodeIsNotParagraph(node) {
  if (node.childNodes.length > 0) {
    const firstChildNode = node.childNodes[0];
    if (firstChildNode.tagName === PARAGRAPH_TAG) {
      replaceElementWithContent(firstChildNode);
    }
  }
}

function listConverter(dom) {
  const doc = dom.window.document;

  putOrphanLiToUl(doc.body);
  [...doc.querySelectorAll("ul, ol")].forEach(
    replaceListWithItsContentIfContainsNoLi,
  );
  [...doc.querySelectorAll("ul, ol")].forEach(mergeNestedLists);
  [...doc.querySelectorAll("li")].forEach(ensureFirstChildNodeIsNotParagraph);
  [...doc.querySelectorAll("ul, ol")].forEach(moveFreeParagraphs);
  [...doc.querySelectorAll("ul, ol")].forEach(removeEmptyLi);
}

export default listConverter;
