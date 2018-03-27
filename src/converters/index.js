import attributeConverter from "./attributeConverter";
import blockElementConverter from "./blockElementConverter";
import boldStyleConverter from "./boldStyleConverter";
import headingConverter from "./headingConverter";
import imgConverter from "./imgConverter";
import tableConverter from "./tableConverter";
import tableToListConverter from "./tableToListConverter";
import galleryConverter from "./galleryConverter";
import listConverter from "./listConverter";
import inlineElementConverter from "./inlineElementConverter";
import listToParagraphsConverter from "./listToParagraphsConverter";

const converters = [
  boldStyleConverter,
  listToParagraphsConverter,
  inlineElementConverter,
  galleryConverter,
  blockElementConverter,
  tableToListConverter,
  tableConverter,
  headingConverter,
  imgConverter,
  listConverter,
  attributeConverter,
];

function rootConverter(dom, options) {
  converters.forEach((converter) => converter(dom, options));
}

export default rootConverter;
