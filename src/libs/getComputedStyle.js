const NONE_VALUE = "none";
const POSITION_VALUES = new Set(["inside", "outside"]);
const URL_PREFIX = "url";

function setListTypeStyle(computedStyle) {
  const listStyle = computedStyle.listStyle;
  if (listStyle) {
    const values = listStyle
      .split(" ")
      .filter(
        (value) => !POSITION_VALUES.has(value) && !value.startsWith(URL_PREFIX),
      );

    if (values.length === 1 || values.every((value) => value === NONE_VALUE)) {
      computedStyle.listStyleType = values[0];
    }
  }
}

function getComputedStyle(window, el) {
  try {
    const computedStyle = window.getComputedStyle(el);
    setListTypeStyle(computedStyle);
    return computedStyle;
  } catch (_) {
    return {};
  }
}

export default getComputedStyle;
