function getText(cell) {
  if (cell) {
    return cell.textContent.trim();
  }
  return "";
}

function arraysAreEqual(a1, a2) {
  return a1.length === a2.length && a1.every((v, i) => v === a2[i]);
}

function isUniqueTabularDataSlice(tabularData, begin, end) {
  const slices = new Set();
  return !tabularData
    .map((row) => row.slice(begin, end))
    .some((slice) => {
      const sliceValue = slice.join("|");
      if (slices.has(sliceValue)) {
        return true;
      }
      slices.add(sliceValue);
      return false;
    });
}

function getRowLength(row) {
  if (row === undefined) {
    return 0;
  }
  const cells = row.cells;
  if (cells.length === 0) {
    return 0;
  }
  return Math.max(cells.length, cells[0].colSpan);
}

function isTabularDataTable(table) {
  const firstRowCellsLength = getRowLength(table.rows[0]);
  return (
    table.rows.length > 2 &&
    firstRowCellsLength > 2 &&
    [...table.rows].every((row) => getRowLength(row) >= firstRowCellsLength)
  );
}

function getTabularData(table) {
  const rows = new Set();
  const uniqueRowsAcc = [];

  return [...table.rows]
    .map((row) => [...row.cells].map((cell) => getText(cell)))
    .reduce((acc, value) => {
      const rowValue = value.join("|");
      if (!rows.has(rowValue)) {
        rows.add(rowValue);
        acc.push(value);
      }
      return acc;
    }, uniqueRowsAcc);
}

function isCaptionRow(row) {
  return row.length === 1;
}

function isTableWithCaptionRows(tableData) {
  return tableData.some(isCaptionRow);
}

function findSpan(tabularData) {
  if (isTableWithCaptionRows(tabularData)) {
    return 0;
  }

  const TABULAR_DATA_MAX_SPAN = 2;
  for (let i = 1; i <= TABULAR_DATA_MAX_SPAN; i += 1) {
    if (isUniqueTabularDataSlice(tabularData, 0, i)) {
      return i - 1;
    }
  }
  return TABULAR_DATA_MAX_SPAN;
}

function renderTabularDataHeader(values) {
  return `<p><b>${values.join(", ")}:</b></p>`;
}

function renderTabularDataRow(values) {
  return `<li>${values.join(", ")}</li>`;
}

function renderTabularData(tabularData, span) {
  let caption = [];
  const accumulator = {
    html: "",
    lastHeading: [],
  };

  return `${
    tabularData
      .map((row) => {
        if (isCaptionRow(row)) {
          caption = row;
          return null;
        }
        const heading = row.slice(0, span);
        return [
          heading.length ? heading : caption,
          renderTabularDataRow(row.slice(span, row.length)),
        ];
      })
      .filter((row) => row)
      .reduce((acc, value) => {
        if (!arraysAreEqual(value[0], acc.lastHeading)) {
          acc.lastHeading = value[0];
          if (acc.html.length > 0) {
            acc.html += "</ul>";
          }
          acc.html += renderTabularDataHeader(value[0]);
          acc.html += "<ul>";
        }

        if (acc.html.length === 0) {
          acc.html += "<ul>";
        }
        acc.html += value[1];
        return acc;
      }, accumulator).html
  }</ul>`;
}

function convertTabularDataTable(table) {
  if (isTabularDataTable(table)) {
    const tabularData = getTabularData(table);
    const span = findSpan(tabularData);
    return renderTabularData(tabularData, span);
  }
  return false;
}

export default convertTabularDataTable;
