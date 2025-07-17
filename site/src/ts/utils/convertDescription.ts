import Description, { Item } from "../types/Description";

const ITEMS_PER_SECTION = 2;

declare global {
  interface Window {
    convertDescription: {
      convertDescriptionToItems(description: string): Item[];
    };
  }
}

const convertDescription = (description: string) => {
  const items = window.convertDescription.convertDescriptionToItems(
    description,
  ) as Item[];
  return layoutItems(items);
};

const layoutItems = (items: Item[]): Description => {
  const sections = items.reduce(
    (acc, item) => {
      if (
        acc.length === 0 ||
        acc[acc.length - 1].items.length === ITEMS_PER_SECTION
      ) {
        acc.push({ items: [] });
      }
      acc[acc.length - 1].items.push(item);
      return acc;
    },
    [{ items: [] }],
  );

  return { sections };
};

export default convertDescription;
