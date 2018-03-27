import { JSDOM } from "jsdom";
import given from "mocha-testdata";

import imgConverter from "../../src/converters/imgConverter";

describe("imgConverter", () => {
  given("ul", "ol").it("should move img tag from list", (tag) => {
    // given
    const dom = new JSDOM(
      `<${tag}><li>test #0</li><p><img src="/test_url" /></p><li>test #1</li></${tag}>`,
    );

    // when
    imgConverter(dom);

    // then
    const expectedHtml = `<${tag}><li>test #0</li><p></p><li>test #1</li></${tag}><img src="/test_url" />`;
    dom.should.contain.html(expectedHtml);
  });

  given("ul", "ol").it("should move img tag from nested list", (tag) => {
    // given
    const dom = new JSDOM(
      `<ol><${tag}><li>test #0</li><p><img src="/test_url" /></p><li>test #1</li></${tag}></ol>`,
    );

    // when
    imgConverter(dom);

    // then
    const expectedHtml = `<ol><${tag}><li>test #0</li><p></p><li>test #1</li></${tag}></ol><img src="/test_url" />`;
    dom.should.contain.html(expectedHtml);
  });

  it("should move img tag from orphan list item", () => {
    // given
    const dom = new JSDOM('<li><p>test #0</p><img src="/test_url" /></li>');

    // when
    imgConverter(dom);

    // then
    const expectedHtml = '<li><p>test #0</p></li><img src="/test_url" />';
    dom.should.contain.html(expectedHtml);
  });

  it("should move img tag from orphan nested list item", () => {
    // given
    const dom = new JSDOM(
      '<li><li><p>test #0</p><img src="/test_url" /></li></li>',
    );

    // when
    imgConverter(dom);

    // then
    const expectedHtml =
      '<li><li><p>test #0</p></li></li><img src="/test_url" />';
    dom.should.contain.html(expectedHtml);
  });
});
