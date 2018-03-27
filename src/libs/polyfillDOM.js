import { ANY_UNORDERED_NODE_TYPE } from "../constants/XPathResult";

function evaluate(xpathExpression, contextNode, namespaceResolver, resultType) {
  if (resultType === ANY_UNORDERED_NODE_TYPE) {
    return { singleNodeValue: null };
  }

  return { snapshotLength: 0 };
}

function polyfillDOM(dom) {
  const document = dom.window.document;
  if (typeof document.evaluate !== "function") {
    document.evaluate = evaluate;
  }
}

export default polyfillDOM;
