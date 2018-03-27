import processDocument from "./libs/processDocument";

function clearDescription(document, ruleSet) {
  return processDocument(document, ruleSet, (change) => {
    const element = change.element;
    if (element.parentNode) {
      // check whether element isn't already removed
      element.parentNode.removeChild(element);
    }
  });
}

export default clearDescription;
