import convertParametrizedTable from "./convertParameterizedTable";
import convertTabularDataTable from "./convertTabularDataTable";

function canConvert(table) {
  return table.querySelectorAll("img, p, table").length <= 0;
}

function convertTable(table) {
  return (
    canConvert(table) &&
    (convertParametrizedTable(table) || convertTabularDataTable(table))
  );
}

function convertAndReplace(table) {
  const convertedTable = convertTable(table);
  if (convertedTable) {
    table.insertAdjacentHTML("beforeBegin", convertedTable);
    table.parentNode.removeChild(table);
  }
}

function tableToListConverter(dom) {
  [...dom.window.document.getElementsByTagName("table")].forEach((table) => {
    convertAndReplace(table);
  });
}

export default tableToListConverter;
