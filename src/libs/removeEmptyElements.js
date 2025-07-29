import Node from "../constants/Node";

function removeEmptyElements(node) {
  for (let i = node.childNodes.length - 1; i >= 0; i -= 1) {
    const childNode = node.childNodes[i];
    if (childNode.nodeType === Node.ELEMENT_NODE) {
      removeEmptyElements(childNode);
    }
  }

  if (!node.textContent && node.childNodes.length === 0) {
    node.parentNode.removeChild(node);
  }
}

export default removeEmptyElements;
