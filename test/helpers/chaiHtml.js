import { JSDOM } from "jsdom";
import pretty from "pretty";

function formatDom(dom) {
  return pretty(dom.serialize(), { ocd: true });
}

function formatHtml(html) {
  return formatDom(new JSDOM(html));
}

function formatObj(chai, obj) {
  if (obj instanceof JSDOM) {
    return formatDom(obj);
  } else if (typeof obj === "string" || obj instanceof String) {
    return formatHtml(obj);
  }

  throw new chai.AssertionError(
    `Expected ${obj} to be an instance of JSDOM or string`,
  );
}

function chaiDom(chai) {
  const Assertion = chai.Assertion;

  Assertion.addMethod("html", function assertDomContainsHtml(html) {
    const obj = this._obj;

    const expected = formatObj(chai, html);
    const actual = formatObj(chai, obj);

    this.assert(
      expected === actual,
      "expected dom to contain html",
      "expected dom to not contain html",
      expected,
      actual,
    );
  });
}

export default chaiDom;
