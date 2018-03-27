const BODY_TAG = "BODY";
const LIST_ITEM_TAG = "LI";
const LIST_TAGS = new Set(["UL", "OL"]);

function moveOutIfContainedInList(img) {
  let firstListAncestor;
  let firstListItemAncestor;
  let ancestor = img.parentNode;
  while (ancestor.tagName !== BODY_TAG) {
    if (LIST_TAGS.has(ancestor.tagName)) {
      firstListAncestor = ancestor;
    } else if (ancestor.tagName === LIST_ITEM_TAG) {
      firstListItemAncestor = ancestor;
    }

    ancestor = ancestor.parentNode;
  }

  const firstAncestor = firstListAncestor || firstListItemAncestor;

  if (firstAncestor) {
    firstAncestor.insertAdjacentHTML("afterend", img.outerHTML);
    img.parentNode.removeChild(img);
  }
}

export default function imgConverter(dom) {
  [...dom.window.document.querySelectorAll("img")].forEach((img) =>
    moveOutIfContainedInList(img),
  );
}
