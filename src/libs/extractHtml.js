const BODY_TAG = "BODY";

function extractHtml(el) {
  let html;
  if (el.tagName === BODY_TAG) {
    html = el.innerHTML;
  } else {
    html = el.outerHTML;
  }
  return html;
}

export default extractHtml;
