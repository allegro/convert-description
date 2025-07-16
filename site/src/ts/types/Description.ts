type Description = {
  sections: Section[];
};

export type Section = {
  items: Item[];
};

export enum ItemType {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
}

export type Item = {
  type: ItemType;
  content?: string;
  url?: string;
};

export default Description;
