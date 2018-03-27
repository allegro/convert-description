import { JSDOM } from "jsdom";

import clearDescription from "../src/clearDescription";

describe("clearDescription", () => {
  it("should clear description based on passed rule set", () => {
    // given
    const dom = new JSDOM(`
      <div id="header">This is a test header</div>
      <div id="content">
        <div>This is a test content</div>
        <div class="sidebar">This is a test sidebar</div>
      </div>
      <div id="footer">This is a test footer</div>
    `);

    const ruleSet = [
      { type: "CssSelector", selector: "#header" },
      { type: "CssSelector", selector: ".sidebar" },
      { type: "CssSelector", selector: "#footer" },
    ];

    // when
    clearDescription(dom.window.document, ruleSet);

    // then
    dom.should.contain.html(
      '<div id="content"><div>This is a test content</div></div>',
    );
  });

  it("should clear description using position selectors", () => {
    // given
    const dom = new JSDOM(`
      <div>This is a test header</div>
      <div>
        <div>This is a test content</div>
        <div>This is a test sidebar</div>
      </div>
      <div>This is a test footer</div>
    `);

    const ruleSet = [
      { type: "CssSelector", selector: "body > div:nth-child(1)" },
      {
        type: "CssSelector",
        selector: "body > div:nth-child(2) > div:nth-child(2)",
      },
      { type: "CssSelector", selector: "body > div:nth-child(3)" },
    ];

    // when
    clearDescription(dom.window.document, ruleSet);

    // then
    dom.should.contain.html("<div><div>This is a test content</div></div>");
  });

  it("should pass simple description", () => {
    // given
    const dom = new JSDOM(`
      <div>This is a simple description</div>
    `);

    const ruleSet = [
      { type: "CssSelector", selector: "body > div:nth-child(2)" },
      { type: "CssSelector", selector: "body > div:nth-child(3)" },
      { type: "CssSelector", selector: "body > div:nth-child(4)" },
      { type: "CssSelector", selector: "body > div:nth-child(5)" },
      { type: "CssSelector", selector: "body > div:nth-child(6)" },
    ];

    // when
    clearDescription(dom.window.document, ruleSet);

    // then
    dom.should.contain.html("<div>This is a simple description</div>");
  });

  it("should return matched rule count", () => {
    // given
    const dom = new JSDOM(`
      <div id="header">This is a test header</div>
      <div id="content">
        <div>This is a test content</div>
      </div>
      <div id="footer">This is a test footer</div>
    `);

    const ruleSet = [
      { type: "CssSelector", selector: "#header" },
      { type: "CssSelector", selector: ".sidebar" },
      { type: "CssSelector", selector: "#footer" },
    ];

    // expect
    clearDescription(dom.window.document, ruleSet).should.equal(2);
  });

  it("should remove element pointed by two selectors", () => {
    // given
    // given
    const dom = new JSDOM(`
      <div id="header" class="test0 test1">This is a test header</div>
      <div>This is a test content</div>
    `);

    const ruleSet = [
      { type: "CssSelector", selector: ".test0" },
      { type: "CssSelector", selector: ".test1" },
    ];
    const count = clearDescription(dom.window.document, ruleSet);

    // expect
    dom.should.contain.html("<div>This is a test content</div>");
    count.should.equal(2);
  });
});
