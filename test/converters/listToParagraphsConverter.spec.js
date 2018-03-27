import { JSDOM } from "jsdom";
import given from "mocha-testdata";

import listToParagraphsConverter from "../../src/converters/listToParagraphsConverter";

describe("listToParagraphsConverter", () => {
  function givenHtmlWithContent(content) {
    return `
      <html>
        <head>
          <style>.list-style-none { list-style: none; }</style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `;
  }

  given(
    '<ul style="list-style: none;"><li><b>test</b> #0</li><li><b>test</b> #1</li></ul>',
    '<ol style="list-style: none;"><li><b>test</b> #0</li><li><b>test</b> #1</li></ol>',
    '<ul class="list-style-none"><li><b>test</b> #0</li><li><b>test</b> #1</li></ul>',
  ).it("should convert list with list-style none to paragraphs", (content) => {
    // given
    const dom = new JSDOM(givenHtmlWithContent(content));

    // when
    listToParagraphsConverter(dom);

    // then
    dom.should.contain.html(
      givenHtmlWithContent(`
      <p><b>test</b> #0</p>
      <p><b>test</b> #1</p>
    `),
    );
  });

  it("should keep nodes other than li untouched", () => {
    // given
    const dom = new JSDOM(
      givenHtmlWithContent(`
      <ul class="list-style-none">
        <b>test</b> #0
        <li><b>test</b> #1</li>
      </ul>
    `),
    );

    // when
    listToParagraphsConverter(dom);

    // then
    dom.should.contain.html(
      givenHtmlWithContent(`
      <b>test</b> #0
      <p><b>test</b> #1</p>
    `),
    );
  });

  it("should ignore list if list-style not set to none", () => {
    // given
    const dom = new JSDOM(
      givenHtmlWithContent(
        "<ul><li><b>test</b> #0</li><li><b>test</b> #1</li></ul>",
      ),
    );

    // when
    listToParagraphsConverter(dom);

    // then
    dom.should.contain.html(
      givenHtmlWithContent(
        "<ul><li><b>test</b> #0</li><li><b>test</b> #1</li></ul>",
      ),
    );
  });
});
