import forEachChildElement from "../libs/forEachChildElement";

const IMG_TAG = "IMG";

function removeAttributes(element) {
  if (element.tagName !== IMG_TAG) {
    [].map
      .call(element.attributes, (attr) => attr.name)
      .forEach((name) => element.attributes.removeNamedItem(name));

    forEachChildElement(element, removeAttributes);
  }
}

export default function attributeConverter(dom) {
  removeAttributes(dom.window.document.body);
}
