import replaceElementWithContent from "../libs/replaceElementWithContent";

const GALLERY_TAG = "galeria";
const IMG_TAG = "img";

function galleryConverter(dom, options = {}) {
  const document = dom.window.document;
  const gallery = options.gallery;
  const elements = [...document.getElementsByTagName(GALLERY_TAG)];
  if (gallery.length > 0) {
    elements.forEach((element) => {
      const img = document.createElement(IMG_TAG);
      img.src = gallery[0];
      element.parentNode.insertBefore(img, element);
    });
  }

  elements.forEach(replaceElementWithContent);
}

export default galleryConverter;
