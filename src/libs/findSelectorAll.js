import containsOnlyInlineElements from "./containsOnlyInlineElements";

// from sizzle.js

const whitespace = "[\\x20\\t\\r\\n\\f]";
// CSS escapes
// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
const runescape = new RegExp(
  `\\\\([\\da-f]{1,6}${whitespace}?|(${whitespace})|.)`,
  "ig",
);
function funescape(_, escaped, escapedWhitespace) {
  const high = `0x${escaped}` - 0x10000;
  // NaN means non-codepoint
  // Support: Firefox<24
  // Workaround erroneous numeric interpretation of +"0x"
  return high !== high || escapedWhitespace
    ? escaped
    : high < 0
      ? // BMP codepoint
        String.fromCharCode(high + 0x10000)
      : // Supplemental Plane codepoint (surrogate pair)
        String.fromCharCode((high >> 10) | 0xd800, (high & 0x3ff) | 0xdc00);
}

const CONTAINS_REGEX = /(.*):contains\((.*)\)/;

function contains(element, text) {
  return (
    containsOnlyInlineElements(element) &&
    element.textContent.indexOf(text) !== -1
  );
}

function findSelectorAll(selector, document) {
  const match = CONTAINS_REGEX.exec(selector);
  if (match !== null) {
    const text = match[2].replace(runescape, funescape);
    return [...document.querySelectorAll(match[1])].filter((element) =>
      contains(element, text),
    );
  }
  return [...document.querySelectorAll(selector)];
}

export default findSelectorAll;
