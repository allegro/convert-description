import { JSDOM } from "jsdom";

import inlineElementConverter from "../../src/converters/inlineElementConverter";

describe("inlineElementConverter", () => {
  it("should remove inline elements", () => {
    // given
    const dom = new JSDOM(`
      <ul>
        <font><li>test item #0</li><span><li>test item #1</li></span></font>
      </ul>
    `);

    // when
    inlineElementConverter(dom);

    // then
    dom.should.contain.html(`
      <ul>
        <li>test item #0</li><li>test item #1</li>
      </ul>
    `);
  });

  it("should keep br element", () => {
    // given
    const dom = new JSDOM("<span><br /></span>");

    // when
    inlineElementConverter(dom);

    // then
    dom.should.contain.html("<br />");
  });

  it("should keep b element", () => {
    // given
    const dom = new JSDOM("<span><b>test content</b></span>");

    // when
    inlineElementConverter(dom);

    // then
    dom.should.contain.html("<b>test content</b>");
  });

  it("should keep img element", () => {
    // given
    const dom = new JSDOM('<span><img src="/test_url"/></span>');

    // when
    inlineElementConverter(dom);

    // then
    dom.should.contain.html('<img src="/test_url"/>');
  });

  it("should ensure b tag contains only text", () => {
    // given
    const dom = new JSDOM(
      "<b>test #0<div>test #1</div><b>test <span>#2</span></b> </b>",
    );

    // when
    inlineElementConverter(dom);

    // then
    dom.should.contain.html(
      "<b>test #0</b><div><b>test #1</b></div><b>test #2</b>",
    );
  });

  it("should wrap text nodes in b at the end", () => {
    // given
    const dom = new JSDOM("<b><b><b>test #0</b> </b>test #1</b>");

    // when
    inlineElementConverter(dom);

    // then
    dom.should.contain.html("<b>test #0</b><b> test #1</b>");
  });
});
