import SectionItem from "./SectionItem";

const TYPE = "IMAGE";

class ImageItem extends SectionItem {
  constructor(url) {
    super(TYPE);
    this.url = url;
  }

  static fromJS(json) {
    return new ImageItem(json.url);
  }

  static matchesJS(json) {
    return json.type === TYPE;
  }
}

export default ImageItem;
