import { JSDOM } from "jsdom";

import replaceElementWithContent from "../../src/libs/replaceElementWithContent";

describe("replaceElementWithContent", () => {
  it("should replace element with its content", () => {
    // given
    const dom = new JSDOM(`
      <div>test #0</div>
      <div><b>test #1</b></div>
      <div>test #2</div>
    `);
    const element = dom.window.document.body.children[1];

    // when
    replaceElementWithContent(element);

    // then
    dom.should.contain.html(`
      <div>test #0</div>
      <b>test #1</b>
      <div>test #2</div>
    `);
  });

  it("should merge with leading text node", () => {
    // given
    const dom = new JSDOM("test<div> #<b>0</b></div><div>test #1</div>");
    const body = dom.window.document.body;
    const element = body.children[0];

    // when
    replaceElementWithContent(element);

    // then
    dom.should.contain.html("test #<b>0</b><div>test #1</div>");
    body.childNodes.length.should.equal(3);
  });

  it("should merge with following text node", () => {
    // given
    const dom = new JSDOM("<div><b>test</b> #</div>0<div>test #1</div>");
    const body = dom.window.document.body;
    const element = body.children[0];

    // when
    replaceElementWithContent(element);

    // then
    dom.should.contain.html("<b>test</b> #0<div>test #1</div>");
    body.childNodes.length.should.equal(3);
  });

  it("should merge only text node with leading and following text nodes", () => {
    // given
    const dom = new JSDOM("t<div>est #</div>0<div>test #1</div>");
    const body = dom.window.document.body;
    const element = body.children[0];

    // when
    replaceElementWithContent(element);

    // then
    dom.should.contain.html("test #0<div>test #1</div>");
    body.childNodes.length.should.equal(2);
  });

  it("should merge with leading and following text nodes", () => {
    // given
    const dom = new JSDOM("t<div><b>est</b> #</div>0<div>test #1</div>");
    const body = dom.window.document.body;
    const element = body.children[0];

    // when
    replaceElementWithContent(element);

    // then
    dom.should.contain.html("t<b>est</b> #0<div>test #1</div>");
    body.childNodes.length.should.equal(4);
  });
});
