import serializeHTML from "./libs/serializeHTML";
import Node from "./constants/Node";
import isBlankText from "./libs/isBlankText";
import ImageItem from "./model/description/ImageItem";
import TextItem from "./model/description/TextItem";

const IMG_TAG_NAME = "IMG";
const EMPTY_SECTION_LENGTH = 7;

function extractItems(node) {
  const items = [];
  for (let i = 0; i < node.childNodes.length; i += 1) {
    const childNode = node.childNodes[i];
    if (childNode.nodeType === Node.ELEMENT_NODE) {
      extractItemsFromElement(childNode).forEach((item) => items.push(item));
    }
  }
  return items;
}

function extractItemsFromElement(childNode) {
  const items = [];
  // if element contains images -> go deeper
  if (childNode.querySelector("img")) {
    extractItems(childNode).forEach((item) => items.push(item));
    // element contains text only -> create text section
  } else if (!isBlankText(childNode.textContent)) {
    const sanitizedHtml = serializeHTML(childNode);
    if (sanitizedHtml.length > EMPTY_SECTION_LENGTH) {
      items.push(new TextItem(sanitizedHtml));
    }
  }
  // if element is img -> create img section
  if (childNode.tagName === IMG_TAG_NAME) {
    if (!isBlankText(childNode.src)) {
      items.push(new ImageItem(childNode.src));
    }
  }

  return items;
}

export default extractItemsFromElement;
