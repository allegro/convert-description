import Node from "../constants/Node";
import InlineElements from "../constants/InlineElements";

function isAllowedNode(node) {
  switch (node.nodeType) {
    case Node.TEXT_NODE:
      return true;

    case Node.ELEMENT_NODE:
      if (!InlineElements.has(node.nodeName)) {
        return false;
      }
      return [...node.childNodes].every((child) => isAllowedNode(child));

    default:
      return false;
  }
}

function containsOnlyInlineElements(element) {
  return [...element.childNodes].every((node) => isAllowedNode(node));
}

export default containsOnlyInlineElements;
