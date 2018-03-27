import { JSDOM } from "jsdom";

import serializeHTML from "../../src/libs/serializeHTML";

describe("serializeHTML", () => {
  it("should escape xml special characters", () => {
    // given
    const dom = new JSDOM("<p>< & ></p>");

    // when
    const serializedHtml = serializeHTML(dom.window.document.body);

    // then
    const expectedSerializedHtml = "<p>&lt; &amp; &gt;</p>";
    serializedHtml.should.be.html(expectedSerializedHtml);
  });

  it("should remove invalid XML characters", () => {
    // given
    const html = "<p>test #\u001A0</p>";

    const dom = new JSDOM(html);

    // when
    const serializedHtml = serializeHTML(dom.window.document.body);

    // then
    const expectedSerializedHtml = "<p>test #0</p>";
    serializedHtml.should.be.html(expectedSerializedHtml);
  });

  it("should return internal HTML for element other than body", () => {
    // given
    const html = "<p>test <b>#0</b></p>";

    const dom = new JSDOM(html);

    // when
    const serializedHtml = serializeHTML(dom.window.document.body.firstChild);

    // then
    serializedHtml.should.be.html(html);
  });
});
