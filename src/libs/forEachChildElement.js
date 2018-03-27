import Node from "../constants/Node";

function forEachChildElement(el, fn) {
  [...el.childNodes].forEach((childNode) => {
    if (childNode.nodeType === Node.ELEMENT_NODE) {
      fn(childNode);
    }
  });
}

export default forEachChildElement;
