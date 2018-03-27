const BODY_TAG = "BODY";

// https://www.w3.org/TR/xml/#charsets
const INVALID_XML_CHARACTERS =
  // eslint-disable-next-line no-control-regex
  /[^\u0009\u000A\u000D\u0020-\uD7FF\uE000-\uFFFD\u10000-\u10FFFF]/;

function serializeHTML(el) {
  let html;
  if (el.tagName === BODY_TAG) {
    html = el.innerHTML;
  } else {
    html = el.outerHTML;
  }
  return html.replace(INVALID_XML_CHARACTERS, "");
}

export default serializeHTML;
