import { JSDOM } from "jsdom";

import extractHtml from "../../src/libs/extractHtml";

describe("extractHtml", () => {
  it("should escape xml special characters", () => {
    // given
    const dom = new JSDOM("<p>< & ></p>");

    // when
    const extractedHtml = extractHtml(dom.window.document.body);

    // then
    const expectedSerializedHtml = "<p>&lt; &amp; &gt;</p>";
    extractedHtml.should.be.html(expectedSerializedHtml);
  });

  it("should return inner HTML for a body element", () => {
    // given
    const html = "<p>test <b>#0</b></p>";

    const dom = new JSDOM(html);

    // when
    const extractedHtml = extractHtml(dom.window.document.body);

    // then
    extractedHtml.should.be.html(html);
  });

  it("should return outer HTML for an element other than body", () => {
    // given
    const html = "<p>test <b>#0</b></p>";

    const dom = new JSDOM(html);

    // when
    const extractedHtml = extractHtml(dom.window.document.body.firstChild);

    // then
    extractedHtml.should.be.html(html);
  });
});
