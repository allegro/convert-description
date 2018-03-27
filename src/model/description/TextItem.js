import SectionItem from "./SectionItem";

const TYPE = "TEXT";

class TextItem extends SectionItem {
  constructor(content) {
    super(TYPE);
    this.content = content;
  }

  static fromJS(json) {
    return new TextItem(json.content);
  }

  static matchesJS(json) {
    return json.type === TYPE;
  }
}

export default TextItem;
