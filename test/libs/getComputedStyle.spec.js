import { JSDOM } from "jsdom";
import given from "mocha-testdata";
import sinon from "sinon";

import getComputedStyle from "../../src/libs/getComputedStyle";

describe("getComputedStyle", () => {
  it("should return computed style", () => {
    // given
    const dom = new JSDOM('<p style="font-weight: bold;">test text</p>');
    const window = dom.window;

    // expect
    getComputedStyle(
      window,
      window.document.body.firstChild,
    ).fontWeight.should.eql("bold");
  });

  it("should return empty object if css is not valid", () => {
    // given
    const dom = new JSDOM();
    const window = dom.window;
    sinon.stub(window, "getComputedStyle").throws();

    // expect
    getComputedStyle(window, window.document.body.firstChild).should.eql({});
  });

  given(
    "circle",
    "circle inside",
    "circle outside",
    "circle url()",
    "outside url() circle",
  ).it("should set list-style-type based on list-style", (listStyle) => {
    // given
    const dom = new JSDOM(`
      <ul style="list-style: ${listStyle}"></ul>
    `);
    const window = dom.window;

    // expect
    getComputedStyle(
      window,
      window.document.body.firstChild,
    ).listStyleType.should.equal("circle");
  });

  it("should not set list-style-type if list-style is not set", () => {
    // given
    const dom = new JSDOM(`
      <ul style="list-style-type: square"></ul>
    `);
    const window = dom.window;

    // expect
    getComputedStyle(
      window,
      window.document.body.firstChild,
    ).listStyleType.should.equal("square");
  });

  it("should not set list-style-type if list-style is invalid", () => {
    // given
    const dom = new JSDOM(`
      <ul style="list-style: none inherit; list-style-type: square"></ul>
    `);
    const window = dom.window;

    // expect
    getComputedStyle(
      window,
      window.document.body.firstChild,
    ).listStyleType.should.equal("square");
  });

  it("should set list-style-type to none", () => {
    // given
    const dom = new JSDOM(`
      <ul style="list-style: none none"></ul>
    `);
    const window = dom.window;

    // expect
    getComputedStyle(
      window,
      window.document.body.firstChild,
    ).listStyleType.should.equal("none");
  });
});
