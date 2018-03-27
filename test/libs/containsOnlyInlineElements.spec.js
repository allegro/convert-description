import { JSDOM } from "jsdom";

import containsOnlyInlineElements from "../../src/libs/containsOnlyInlineElements";

describe("containsOnlyInlineElements", () => {
  function givenElement(html) {
    const dom = new JSDOM(html);
    return dom.window.document.body.firstChild;
  }

  it("should return true if element contains only inline elements", () => {
    // given
    const element = givenElement(`
      <div>
        <span>test content</span>
      </div>
    `);

    // expect
    containsOnlyInlineElements(element).should.be.true;
  });

  it("should return false if element contains block element", () => {
    // given
    const element = givenElement(`
      <div>
        <span><div>test content</div></span>
      </div>
    `);

    // expect
    containsOnlyInlineElements(element).should.be.false;
  });
});
