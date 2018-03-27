import Node from "../constants/Node";

function mergeTextNodes(el) {
  const childNodes = [...el.childNodes];

  let previousTextNode;
  for (let i = 0; i < childNodes.length; i += 1) {
    const childNode = childNodes[i];
    if (childNode.nodeType === Node.TEXT_NODE) {
      if (previousTextNode) {
        previousTextNode.textContent += childNode.textContent;
        childNode.parentNode.removeChild(childNode);
      } else {
        previousTextNode = childNode;
      }
    } else {
      previousTextNode = null;
    }
  }
}

function replaceElementWithContent(el) {
  const childNodes = [...el.childNodes];
  const parentNode = el.parentNode;

  for (let i = 0; i < childNodes.length; i += 1) {
    const childNode = childNodes[i];
    parentNode.insertBefore(childNode, el);
  }

  el.parentNode.removeChild(el);

  mergeTextNodes(parentNode);
}

export default replaceElementWithContent;
