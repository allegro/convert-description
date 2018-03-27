import { JSDOM } from "jsdom";
import given from "mocha-testdata";

import boldStyleConverter from "../../src/converters/boldStyleConverter";

describe("boldStyleConverter", () => {
  function givenHtmlWithElement(element) {
    return `
      <html>
        <head>
          <style>.bold { font-weight: bold; }</style>
        </head>
        <body>
          <div>
            <div>This is a test header</div>
            <div>
              This is a test content with ${element}.
            </div>
          </div>
        </body>
      </html>
    `;
  }

  function givenDomWithElement(element) {
    return new JSDOM(givenHtmlWithElement(element));
  }

  given([
    '<span style="font-weight: bold">test text</span>',
    '<span style="font-weight: 700">test text</span>',
    '<span style="font-weight: 800">test text</span>',
    '<span style="font-weight: 900">test text</span>',
    '<span class="bold">test text</span>',
    "<strong>test text</strong>",
  ]).it("should convert to b tag", (element) => {
    // given
    const dom = givenDomWithElement(element);

    // when
    boldStyleConverter(dom);

    // then
    const expectedHtml = givenHtmlWithElement("<b>test text</b>");
    dom.should.contain.html(expectedHtml);
  });

  it("should convert to b tag if nested in already converted element", () => {
    // given
    const text0 = " test text #0";
    const text1 = "test text #1 ";
    const element = `<span class="bold"><span class="bold">${text0}</span>${text1}</span>`;
    const dom = givenDomWithElement(element);

    // when
    boldStyleConverter(dom);

    // then
    const expectedHtml = givenHtmlWithElement(
      `<span class="bold"><b>${text0}</b><b>${text1}</b></span>`,
    );
    dom.should.contain.html(expectedHtml);
  });

  it("should wrap text node in b tag if element contains nested element", () => {
    // given
    const text0 = " test text #0";
    const text1 = "test text #1 ";
    const element = `<span><span class="bold">${text0}</span>${text1}</span>`;
    const dom = givenDomWithElement(element);

    // when
    boldStyleConverter(dom);

    // then
    const expectedHtml = givenHtmlWithElement(
      `<span><b>${text0}</b>${text1}</span>`,
    );
    dom.should.contain.html(expectedHtml);
  });

  given([
    '<span style="font-weight: normal">test text</span>',
    '<span style="font-weight: 400">test text</span>',
    "<strike>test text</strike>",
    '<b id="test-id">test text</b>',
    '<a class="bold">test text</a>',
    '<div class="bold">test text</div>',
  ]).it("should ignore tag", (element) => {
    // given
    const dom = givenDomWithElement(element);

    // when
    boldStyleConverter(dom);

    // then
    const expectedHtml = givenHtmlWithElement(element);
    dom.should.contain.html(expectedHtml);
  });
});
