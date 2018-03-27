import { JSDOM } from "jsdom";

import findSelectorAll from "../../src/libs/findSelectorAll";

describe("findSelectorAll", () => {
  function givenDocument(html) {
    const dom = new JSDOM(html);
    return dom.window.document;
  }

  it("should find element using contains selector", () => {
    // given
    const document = givenDocument(`
      <div>
        <p id="p1">Paragraph one</p>
      </div>     
    `);

    // when
    const result = findSelectorAll(
      "div > p:contains(Paragraph\\ one)",
      document,
    );

    // expect
    result.length.should.equal(1);
    result[0].id.should.equal("p1");
  });

  it("should find multiple elements using contains selector", () => {
    // given
    const document = givenDocument(`
      <div>
        <p>Paragraph one</p>
        <p>Paragraph two</p>
      </div>     
    `);

    // when
    const result = findSelectorAll("div > p:contains(Paragraph)", document);

    // expect
    result.length.should.equal(2);
  });

  it("should find element using contains selector when text wrapped in inline element", () => {
    // given
    const document = givenDocument(`
      <div>
        <p id="p1"><strong>Paragraph</strong> <span>one</span></p>
      </div>     
    `);

    // when
    const result = findSelectorAll(
      "div > p:contains(Paragraph\\ one)",
      document,
    );

    // expect
    result.length.should.equal(1);
    result[0].id.should.equal("p1");
  });

  it("should not find elements using contains selector when text wrapped in block element", () => {
    // given
    const document = givenDocument(`
      <div>
        <p>Paragraph one</p>
      </div>     
    `);

    // when
    const result = findSelectorAll("div:contains(Paragraph\\ one)", document);

    // expect
    result.length.should.equal(0);
  });
});
