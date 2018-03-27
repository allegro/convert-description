import Node from "../constants/Node";
import isBlankText from "../libs/isBlankText";
import replaceElementWithContent from "../libs/replaceElementWithContent";

const B_TAG = "B";
const BR_TAG = "BR";
const HEADING_TAGS = new Set(["H1", "H2", "H3", "H4", "H5", "H6"]);
const LIST_ITEM_TAG = "LI";
const NON_TEXT_TAGS = new Set(["STYLE", "TITLE"]);
const PARAGRAPH_TAG = "P";
const TABLE_CELL_TAGS = new Set(["TH", "TD"]);
const CONTAINER_TAGS = new Set([
  "UL",
  "OL",
  LIST_ITEM_TAG,
  "TABLE",
  "THEAD",
  "TBODY",
  "TR",
  ...TABLE_CELL_TAGS,
  "CAPTION",
  ...HEADING_TAGS,
]);
const IMG_TAG = "IMG";

function ensureOnlyNodeIsNotParagraph(node) {
  if (node.childNodes.length === 1) {
    const firstChildNode = node.childNodes[0];
    if (firstChildNode.tagName === PARAGRAPH_TAG) {
      replaceElementWithContent(firstChildNode);
    }
  }
}

class NodeAppender {
  constructor(rootNode) {
    this.rootNode = rootNode;
    this.paragraphNode = null;
  }

  appendChildToRoot(node) {
    this.rootNode.appendChild(node);
  }

  appendChildToParagraph(node) {
    if (!this.paragraphNode) {
      const document = node.ownerDocument;
      this.paragraphNode = document.createElement(PARAGRAPH_TAG);
    }

    const childCount = this.paragraphNode.childNodes.length;

    if (
      childCount !== 0 ||
      node.nodeType !== Node.TEXT_NODE ||
      !isBlankText(node.textContent)
    ) {
      if (childCount === 0) {
        node.textContent = node.textContent.trimLeft();
      }

      this.paragraphNode.appendChild(node);
    } else {
      node.parentNode.removeChild(node);
    }
  }

  closeParagraph() {
    if (this.paragraphNode) {
      const childNodes = this.paragraphNode.childNodes;
      if (childNodes.length > 0) {
        const lastChild = childNodes[childNodes.length - 1];
        lastChild.textContent = lastChild.textContent.trimRight();
        if (!lastChild.textContent) {
          this.paragraphNode.removeChild(lastChild);
        }

        this.rootNode.appendChild(this.paragraphNode);
      }

      this.paragraphNode = null;
    }
  }

  flush() {
    const tagName = this.rootNode.tagName;
    if (
      TABLE_CELL_TAGS.has(tagName) ||
      HEADING_TAGS.has(tagName) ||
      tagName === LIST_ITEM_TAG
    ) {
      ensureOnlyNodeIsNotParagraph(this.rootNode);
    }
  }
}

function normalizeElement(el, nodeAppender) {
  const childNodes = [...el.childNodes];
  for (let i = 0; i < childNodes.length; i += 1) {
    const childNode = childNodes[i];

    if (childNode.nodeType === Node.TEXT_NODE) {
      nodeAppender.appendChildToParagraph(childNode);
    } else if (childNode.tagName === B_TAG) {
      nodeAppender.appendChildToParagraph(childNode);
    } else if (childNode.tagName === BR_TAG) {
      childNode.parentNode.removeChild(childNode);
      nodeAppender.closeParagraph();
    } else if (childNode.tagName === IMG_TAG) {
      nodeAppender.closeParagraph();
      nodeAppender.appendChildToRoot(childNode);
    } else {
      nodeAppender.closeParagraph();

      if (CONTAINER_TAGS.has(childNode.tagName)) {
        const childNodeAppender = new NodeAppender(childNode);
        normalizeElement(childNode, childNodeAppender);
        childNodeAppender.flush();

        nodeAppender.appendChildToRoot(childNode);
      } else if (NON_TEXT_TAGS.has(childNode.tagName)) {
        childNode.parentNode.removeChild(childNode);
      } else {
        normalizeElement(childNode, nodeAppender);
        childNode.parentNode.removeChild(childNode);
      }
    }
  }

  nodeAppender.closeParagraph();
}

function blockElementConverter(dom) {
  const body = dom.window.document.body;
  normalizeElement(body, new NodeAppender(body));
}

export default blockElementConverter;
