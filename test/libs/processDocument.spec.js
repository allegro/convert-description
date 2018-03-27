import { JSDOM } from "jsdom";
import given from "mocha-testdata";
import sinon from "sinon";

import processDocument from "../../src/libs/processDocument";

describe("processDocument", () => {
  it("should pass selected elements to callback", () => {
    // given
    const dom = new JSDOM("<div>text</div>");
    const callback = sinon.spy();
    const selector = "div:contains(text)";

    const ruleSet = [{ selector }];

    // when
    processDocument(dom.window.document, ruleSet, callback);

    // then
    callback.should.have.been.calledWith({
      element: dom.window.document.body.children[0],
      selector,
    });
  });

  it("should proceed case insensitive attribute selector", () => {
    // given
    const dom = new JSDOM('<img src="badGe"/>');
    const callback = sinon.spy();
    const selector = 'img[src*="badge" i]';

    const ruleSet = [{ selector }];

    // when
    processDocument(dom.window.document, ruleSet, callback);

    // then
    callback.should.have.been.calledWith({
      element: dom.window.document.body.children[0],
      selector,
    });
  });

  given(
    { expected: 0, selectors: [] },
    { expected: 0, selectors: ["#none"] },
    { expected: 1, selectors: ["#header"] },
    { expected: 2, selectors: ["h1:contains(heading)", "p:contains(text)"] },
  ).it(
    "should return the number of selectors used",
    ({ expected, selectors }) => {
      // given
      const dom = new JSDOM(
        '<div id="header"><h1>heading</h1><p>text</p></div>',
      );

      const ruleSet = selectors.map((selector) => ({ selector }));
      // when
      const count = processDocument(dom.window.document, ruleSet, () => {});

      // then
      count.should.eql(expected);
    },
  );

  given(
    ["1) make (your) homework", "\\31 \\)\\ make\\ \\(your\\)\\ homework"],
    [
      `text
     (with new line`,
      "text\\a \\ \\ \\ \\ \\ \\(with\\ new\\ line",
    ],
  ).it(
    "should return element pointed with contained selector",
    (text, escapedText) => {
      // given
      const dom = new JSDOM(`<div>${text}</div>`);
      const callback = sinon.spy();
      const selector = `div:contains(${escapedText})`;

      const ruleSet = [{ selector: String(selector) }];

      // when
      processDocument(dom.window.document, ruleSet, callback);

      // then
      callback.should.have.been.calledWith({
        element: dom.window.document.body.children[0],
        selector,
      });
    },
  );
});
