import Node from "../constants/Node";

const B_TAG = "B";
const PARAGRAPH_TAG = "P";

function getTableCells(table) {
  return [...table.rows].reduce(
    (cells, row) =>
      cells.concat([...row.cells].filter((cell) => cell.firstChild)),
    [],
  );
}

function clearTable(table) {
  const document = table.ownerDocument;

  if (table.caption) {
    [...table.caption.childNodes].forEach((node) =>
      table.parentNode.insertBefore(node, table),
    );
  }

  const cells = getTableCells(table);
  cells.forEach((cell) => {
    const firstChild = cell.firstChild;
    if (
      firstChild.nodeType === Node.TEXT_NODE ||
      firstChild.tagName === B_TAG
    ) {
      const p = document.createElement(PARAGRAPH_TAG);
      [...cell.childNodes].forEach((childNode) => p.appendChild(childNode));
      table.parentNode.insertBefore(p, table);
    } else {
      [...cell.childNodes].forEach((node) =>
        table.parentNode.insertBefore(node, table),
      );
    }
  });

  table.parentNode.removeChild(table);
}

export default function tableConverter(dom) {
  const document = dom.window.document;
  const tables = [...document.querySelectorAll("table")];
  tables.forEach((table) => clearTable(table));
}
