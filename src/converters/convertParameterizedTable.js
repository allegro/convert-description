class Parameters {
  constructor(caption, params) {
    this.caption = caption;
    this.params = params;
  }

  addParam(param) {
    this.params.push(param);
  }
}

class Param {
  constructor(key, value) {
    this.key = key;
    this.value = value;
  }
}

function getText(cell) {
  if (cell) {
    return cell.textContent.trim();
  }
  return "";
}

function normalizeKey(key) {
  return key.endsWith(":") ? key.slice(0, -1) : key;
}

function hasHorizontalParams(table, rowIdx) {
  return (
    table.rows[rowIdx].cells.length > 1 &&
    table.rows[rowIdx].cells.length === table.rows[rowIdx + 1].cells.length
  );
}

function findCaption(table) {
  if (table.caption) {
    return getText(table.caption);
  }
  if (table.rows[0].cells.length === 1) {
    return getText(table.rows[0].cells.item(0));
  }
  return null;
}

function isHorizontalParamsTable(table) {
  return (
    (table.rows.length === 2 && hasHorizontalParams(table, 0)) ||
    (table.rows.length === 3 &&
      table.rows[0].cells.length === 1 &&
      hasHorizontalParams(table, 1))
  );
}

function getParametersArrayHorizontally(table) {
  const keyCells = table.rows[table.rows.length - 2].cells;
  const valueCells = table.rows[table.rows.length - 1].cells;
  const params = [...keyCells].map(
    (value, index) =>
      new Param(normalizeKey(getText(value)), getText(valueCells[index])),
  );
  return [new Parameters(findCaption(table), params)];
}

function isVerticalParamsTable(table) {
  return (
    table.rows.length > 0 &&
    [...table.rows].every(
      (row, idx) =>
        row.cells.length === 2 ||
        (row.cells.length === 1 &&
          // accept possibly spacer row
          ((idx + 1 < table.rows.length &&
            table.rows[idx + 1].cells.length === 2) ||
            (idx + 2 < table.rows.length &&
              table.rows[idx + 2].cells.length === 2))),
    )
  );
}

function getParametertsArrayVertically(table) {
  return [...table.rows].reduce((acc, row) => {
    const isCaption = row.cells.length === 1;
    if (isCaption) {
      const text = getText(row.cells.item(0));
      if (text) {
        return [...acc, new Parameters(getText(row.cells.item(0)), [])];
      }
      return acc;
    }
    const parameters =
      acc.length > 0
        ? acc[acc.length - 1]
        : new Parameters(getText(table.caption), []);
    const param = new Param(
      normalizeKey(getText(row.cells.item(0))),
      getText(row.cells.item(1)),
    );
    parameters.addParam(param);

    return acc.length > 0 ? acc : [parameters];
  }, []);
}

function findParametersArray(table) {
  if (isHorizontalParamsTable(table)) {
    return getParametersArrayHorizontally(table);
  }
  if (isVerticalParamsTable(table)) {
    return getParametertsArrayVertically(table);
  }
  return [];
}

function convertParameterizedTable(table) {
  const paramsArray = findParametersArray(table);
  if (paramsArray.length > 0) {
    return paramsArray
      .map((params) => {
        const captionHtml = params.caption ? `<p>${params.caption}</p>` : "";
        const listItems = params.params
          .map(
            (param) =>
              `<li>${param.key ? `<b>${param.key}:</b> ` : ""}${param.value}</li>`,
          )
          .join("");
        return `${captionHtml}<ul>${listItems}</ul>`;
      })
      .join("");
  }

  return false;
}

export default convertParameterizedTable;
