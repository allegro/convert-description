import getComputedStyle from "../libs/getComputedStyle";

const LIST_ITEM_TAG = "LI";
const NONE_LIST_STYLE = "none";

function convertNodeToParagraph(node) {
  const doc = node.ownerDocument;
  const paragraphNode = doc.createElement("p");
  [...node.childNodes].forEach((childNode) =>
    paragraphNode.appendChild(childNode),
  );
  return paragraphNode;
}

function convertList(listNode) {
  [...listNode.childNodes].forEach((childNode) => {
    let newNode;
    if (childNode.tagName === LIST_ITEM_TAG) {
      newNode = convertNodeToParagraph(childNode);
    } else {
      newNode = childNode;
    }
    listNode.parentNode.insertBefore(newNode, listNode);
  });
  listNode.parentNode.removeChild(listNode);
}

function hasNoneListStyle(node, window) {
  const listStyleType = node.style.listStyleType;
  if (listStyleType) {
    return listStyleType === NONE_LIST_STYLE;
  }
  return getComputedStyle(window, node).listStyleType === NONE_LIST_STYLE;
}

function listToParagraphsConverter(dom) {
  const window = dom.window;
  const document = window.document;
  [...document.querySelectorAll("ul,ol")].forEach((listNode) => {
    if (hasNoneListStyle(listNode, window)) {
      convertList(listNode);
    }
  });
}

export default listToParagraphsConverter;
