import findSelectorAll from "./findSelectorAll";

function processDocument(document, ruleSet, callback) {
  let count = 0;
  let changes = [];
  ruleSet.forEach(({ selector }) => {
    const selection = findSelectorAll(selector, document).map((element) => ({
      element,
      selector,
    }));
    if (selection.length > 0) {
      changes = changes.concat(selection);
      count += 1;
    }
  });
  changes.forEach(callback);
  return count;
}

export default processDocument;
