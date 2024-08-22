import { JSDOM } from "jsdom";
import given from "mocha-testdata";
import sinon from "sinon";

import convertDescriptionToItems from "../src/convertDescriptionToItems";
import registerDOM from "../src/libs/registerDOM";
import ImageItem from "../src/model/description/ImageItem";
import TextItem from "../src/model/description/TextItem";

describe("convertDescriptionToItems", () => {
  const url = "/test_url";

  function givenHtmlWithContent(content) {
    return `
      <html>
        <head>
          <style>
            .bold { font-weight: bold; }
          </style>
        </head>
        <body>
          <div id="content">
            ${content}
          </div>
        </body>
      </html>`;
  }

  const options = {
    parseToDOM: (html) => new JSDOM(html),
  };

  describe("options", () => {
    const html = givenHtmlWithContent(`<p>test #0</p>`);

    it("should not require options to be passed", () => {
      // when
      const items = registerDOM(() => convertDescriptionToItems(html));

      // then
      items.should.eql([new TextItem("<p>test #0</p>")]);
    });

    describe("parseToDOM", () => {
      it("should throw an exception if a passed value is not a function", () => {
        // given
        const options = {
          parseToDOM: "",
        };

        // expect
        (() => convertDescriptionToItems(html, options)).should.throw(
          "parseToDOM must be a function",
        );
      });

      it("should throw an exception if a value is not set for Node.js environment", () => {
        // given
        const options = {};

        // expect
        (() => convertDescriptionToItems(html, options)).should.throw(
          "For the Node.js environment provide the parseToDOM function",
        );
      });

      it("should use a passed DOM parser", () => {
        // given
        const options = {
          parseToDOM: (html) => new JSDOM(html),
        };

        // when
        const items = convertDescriptionToItems(html, options);

        // then
        items.should.eql([new TextItem("<p>test #0</p>")]);
      });

      it("should use a browser DOM for a browser environment", () => {
        // given
        const options = {};

        // when
        const items = registerDOM(() =>
          convertDescriptionToItems(html, options),
        );

        // then
        items.should.eql([new TextItem("<p>test #0</p>")]);
      });
    });
  });

  it("should close tags", () => {
    // given
    const html = givenHtmlWithContent(`
      <ul>
        <li><b>test #0</li>
        <li><b>test #1</li>
      </ul>
    `);

    // when
    const items = convertDescriptionToItems(html, options);

    // then
    const expectedItems = [
      new TextItem("<ul><li><b>test #0</b></li><li><b>test #1</b></li></ul>"),
    ];
    items.should.eql(expectedItems);
  });

  it("should convert description with only text", () => {
    // given
    const text = "This is a test <b>content</b>";
    const html = givenHtmlWithContent(text);

    // when
    const items = convertDescriptionToItems(html, options);

    // then
    const expectedItems = [new TextItem(`<p>${text}</p>`)];
    items.should.eql(expectedItems);
  });

  it("should convert description with only image", () => {
    // given
    const html = givenHtmlWithContent(`<img src="${url}"/>`);

    // when
    const items = convertDescriptionToItems(html, options);

    // then
    const expectedItems = [new ImageItem(url)];
    items.should.eql(expectedItems);
  });

  given(
    "<div>This is a test <b>content</b></div>",
    "This is a test <b>content</b>",
  ).it("should convert description with both text and image", (text) => {
    // given
    const html = givenHtmlWithContent(`
      ${text}
      <img src="${url}"/>
    `);

    // when
    const items = convertDescriptionToItems(html, options);

    // then
    const expectedItems = [
      new TextItem("<p>This is a test <b>content</b></p>"),
      new ImageItem(url),
    ];
    items.should.eql(expectedItems);
  });

  it("should skip tag with blank text", () => {
    // given
    const html = givenHtmlWithContent(`
        <img src="${url}" />
        <div> </div>
    `);

    // when
    const items = convertDescriptionToItems(html, options);

    // then
    const expectedItems = [new ImageItem(url)];
    items.should.eql(expectedItems);
  });

  given("", " ").it("should skip img tag with blank url", (url) => {
    // given
    const html = givenHtmlWithContent(`
        <img src="${url}" />
        <div>This is a test text</div>
    `);

    // when
    const items = convertDescriptionToItems(html, options);

    // then
    const expectedItems = [new TextItem("<p>This is a test text</p>")];
    items.should.eql(expectedItems);
  });

  it("should skip tag containing html that converts to empty standardized html", () => {
    // given
    const html = givenHtmlWithContent(`
        <img src="${url}" />
        <div><br /></div>
    `);

    // when
    const items = convertDescriptionToItems(html, options);

    // then
    const expectedItems = [new ImageItem(url)];
    items.should.eql(expectedItems);
  });

  it("should skip style tag", () => {
    // given
    const html = givenHtmlWithContent(`
        <img src="${url}"/>
        <style>#content {}</style>
    `);

    // when
    const items = convertDescriptionToItems(html, options);

    // then
    const expectedItems = [new ImageItem(url)];
    items.should.eql(expectedItems);
  });

  it("should convert text around img tag into separate sections", () => {
    // given
    const topText = "This is a test text on the top";
    const bottomText = "This is a test text on the bottom";
    const html = givenHtmlWithContent(`
        ${topText}
        <img src="${url}" />
        ${bottomText}
    `);

    // when
    const items = convertDescriptionToItems(html, options);

    // then
    const expectedItems = [
      new TextItem(`<p>${topText}</p>`),
      new ImageItem(url),
      new TextItem(`<p>${bottomText}</p>`),
    ];
    items.should.eql(expectedItems);
  });

  it("should convert elements with bold styling", () => {
    // given
    const styledText = "test text";
    const html = givenHtmlWithContent(
      `<span class="bold">${styledText}</span>`,
    );

    // when
    const items = convertDescriptionToItems(html, options);

    // then
    const expectedItems = [new TextItem(`<p><b>${styledText}</b></p>`)];
    items.should.eql(expectedItems);
  });

  it("should skip creating text section for sanitized content", () => {
    // given
    const content = "<style>.content-to-sanitize {}</style>";
    const html = givenHtmlWithContent(`<div>${content}</div>`);

    // when
    const items = convertDescriptionToItems(html, options);

    // then
    items.should.eql([]);
  });

  it("should convert tables", () => {
    // given
    const html = givenHtmlWithContent(`
      <table>
        <tbody>
          <tr> <th><strong>K</strong>olor</th> <th>Typ</th> <th><b>Cena</b></th> </tr>
          <tr> <td><strong>b</strong>lack</td> <td>szlafrok</td> <td>116 <b>zł.</b></td> </tr>
        </tbody>
      </table>
    `);

    // when
    const items = convertDescriptionToItems(html, options);

    // then
    const expectedHtml =
      "<ul><li><b>Kolor:</b> black</li><li><b>Typ:</b> szlafrok</li><li><b>Cena:</b> 116 zł.</li></ul>";
    const expectedItems = [new TextItem(expectedHtml)];
    items.should.eql(expectedItems);
  });

  it("should convert headings", () => {
    // given
    const html = givenHtmlWithContent(`
        <h3>test #0</h3>
        <ul>
          <li>test #1</li>
          <li><h6>test #2<div>test #3</div></h6></li>
        </ul>
    `);

    // when
    const items = convertDescriptionToItems(html, options);

    // then
    const expectedItems = [
      new TextItem(
        "<h1>test #0</h1><ul><li>test #1</li><li>test #2<p>test #3</p></li></ul>",
      ),
    ];
    items.should.eql(expectedItems);
  });

  it("should preserve entity in text node adjacent to image", () => {
    // given
    const html = givenHtmlWithContent(`
       <img src="${url}">
       &amp;copy AdvertisingPanel
    `);

    // when
    const items = convertDescriptionToItems(html, options);

    // then
    const expectedItems = [
      new ImageItem(url),
      new TextItem("<p>&amp;copy AdvertisingPanel</p>"),
    ];
    items.should.eql(expectedItems);
  });

  it("should convert list with list-style none to paragraphs", () => {
    // given
    const html = givenHtmlWithContent(`
      <style>
        .container .list-none {
          list-style: none;
        }
      </style>
      <div class="container">
        <ul class="list-none"><li><b>test</b> #0</li><ul><li>test #1</li></ul><li><b>test</b> #2</li></ul>
      </div>
    `);

    // when
    const items = convertDescriptionToItems(html, options);

    // then
    const expectedItems = [
      new TextItem(
        "<p><b>test</b> #0</p><ul><li>test #1</li></ul><p><b>test</b> #2</p>",
      ),
    ];
    items.should.eql(expectedItems);
  });

  it("should convert list with unnested text node to valid list", () => {
    // given
    const html = givenHtmlWithContent("<ul>&nbsp;<li>item</li></ul>");

    // when
    const items = convertDescriptionToItems(html, options);

    // then
    const expectedItems = [new TextItem("<ul><li>item</li></ul>")];
    items.should.eql(expectedItems);
  });

  it("should convert list having li elements nested in inline and block elements", () => {
    // given
    const html = givenHtmlWithContent(`
      <ul>
        <font>
          <li>test <span>item #0</span></li>
          <span>
            <div>
              <li><strong>test item #1</strong></li>
            </div>
          </span>
        </font>
      </ul>`);

    // when
    const items = convertDescriptionToItems(html, options);

    // then
    const expectedItems = [
      new TextItem(
        "<ul><li>test item #0</li><li><b>test item #1</b></li></ul>",
      ),
    ];
    items.should.eql(expectedItems);
  });

  it("should merge adjacent text into single paragraph created from br", () => {
    // given
    const html = givenHtmlWithContent(
      "<span>W</span><span>ystawiamy paragon lub FV<br /></span>",
    );

    // when
    const items = convertDescriptionToItems(html, options);

    // then
    const expectedItems = [new TextItem("<p>Wystawiamy paragon lub FV</p>")];
    items.should.eql(expectedItems);
  });

  it("should call ruleSetMatchValidator", () => {
    // given
    const ruleSetMatchValidator = sinon.spy();
    const html = givenHtmlWithContent(`
      <div class="test-content0">test content #0</div>
      <div class="test-content2">test content #2</div>
    `);

    const ruleSet = [
      { type: "CssSelector", selector: ".test-content0" },
      { type: "CssSelector", selector: ".test-content1" },
      { type: "CssSelector", selector: ".test-content2" },
    ];

    // when
    const opts = { ...options, ruleSet, validators: { ruleSetMatchValidator } };
    convertDescriptionToItems(html, opts);

    // then
    const matchedRuleCount = 2;
    ruleSetMatchValidator.should.have.been.calledWith(
      ruleSet.length,
      matchedRuleCount,
    );
  });

  it("should prevent from b being nested in b", () => {
    // given
    const html = givenHtmlWithContent("<b>test #0<p>test #1</p></b>");

    // when
    const items = convertDescriptionToItems(html, options);

    // then
    const expectedHtml = "<p><b>test #0</b></p><p><b>test #1</b></p>";
    const expectedItems = [new TextItem(expectedHtml)];
    items.should.eql(expectedItems);
  });

  it("should force p as root element", () => {
    // given
    const html = givenHtmlWithContent("test <b>#0</b>");

    // when
    const items = convertDescriptionToItems(html, options);

    // then
    const expectedHtml = "<p>test <b>#0</b></p>";
    const expectedItems = [new TextItem(expectedHtml)];
    items.should.eql(expectedItems);
  });

  it("should convert table cells into paragraphs", () => {
    // given
    const html = givenHtmlWithContent(`
      <table>
        <tr>
          <td>test <b>#0</b></td>
          <td><span>test <b>#1</b></span></td>
          <td><div>test <b>#2</b></div></td>
        </tr>
      </table>
    `);

    // when
    const items = convertDescriptionToItems(html, options);

    // then
    const expectedHtml =
      "<p>test <b>#0</b></p><p>test <b>#1</b></p><p>test <b>#2</b></p>";
    const expectedItems = [new TextItem(expectedHtml)];
    items.should.eql(expectedItems);
  });

  it("should convert list containing img", () => {
    // given
    const html = givenHtmlWithContent(`
      <ul>
        <li>test <b>#0</b></li>
        <li><div><img src="/test_url"/></div></li>
        <li>test <b>#1</b></li>
      </ul>
    `);

    // when
    const items = convertDescriptionToItems(html, options);

    // then
    const expectedItems = [
      new TextItem("<ul><li>test <b>#0</b></li><li>test <b>#1</b></li></ul>"),
      new ImageItem("/test_url"),
    ];
    items.should.eql(expectedItems);
  });

  it("should convert list containing gallery tag", () => {
    // given
    const html = givenHtmlWithContent(`
      <ul>
        <li>test <b>#0</b></li>
        <li><div><galeria></galeria></div></li>
        <li>test <b>#1</b></li>
      </ul>
    `);

    // when
    const items = convertDescriptionToItems(html, {
      ...options,
      gallery: ["/test_url"],
    });

    // then
    const expectedItems = [
      new TextItem("<ul><li>test <b>#0</b></li><li>test <b>#1</b></li></ul>"),
      new ImageItem("/test_url"),
    ];
    items.should.eql(expectedItems);
  });

  it("should put text around img into paragraphs", () => {
    // given
    const html = givenHtmlWithContent(`
      test <b>#0</b>
      <div><img src="/test_url"/></div>
      test <b>#1</b>
    `);

    // when
    const items = convertDescriptionToItems(html, options);

    // then
    const expectedItems = [
      new TextItem("<p>test <b>#0</b></p>"),
      new ImageItem("/test_url"),
      new TextItem("<p>test <b>#1</b></p>"),
    ];
    items.should.eql(expectedItems);
  });

  it("should put text around gallery tag into paragraphs", () => {
    // given
    const html = givenHtmlWithContent(`
      test <b>#0</b>
      <div><galeria></galeria></div>
      test <b>#1</b>
    `);

    // when
    const items = convertDescriptionToItems(html, {
      ...options,
      gallery: ["/test_url"],
    });

    // then
    const expectedItems = [
      new TextItem("<p>test <b>#0</b></p>"),
      new ImageItem("/test_url"),
      new TextItem("<p>test <b>#1</b></p>"),
    ];
    items.should.eql(expectedItems);
  });

  it("should remove attributes", () => {
    // given
    const html = givenHtmlWithContent(`
      <ul>
        <li aria-haspopup="true">test #0</li>
      </ul>`);

    // when
    const items = convertDescriptionToItems(html, options);

    // then
    const expectedItems = [new TextItem("<ul><li>test #0</li></ul>")];
    items.should.eql(expectedItems);
  });

  it("should replace heading with its content if contains list", () => {
    // given
    const html = givenHtmlWithContent(`
      <h1>test #0</h1>
      <h2>test #1</h2>
      <h3>
        <ul>
          <li>test #2</li>
          <li>test #3</li>
        </ul>
      </h3>`);

    // when
    const items = convertDescriptionToItems(html, options);

    // then
    const expectedItems = [
      new TextItem(
        "<h1>test #0</h1><h2>test #1</h2><ul><li>test #2</li><li>test #3</li></ul>",
      ),
    ];
    items.should.eql(expectedItems);
  });

  it("should convert li elements containing img to list", () => {
    // given
    const html = givenHtmlWithContent(`
          <li>test #0</li>
          <li>
            test #1
            <img src="/test_url"/>
          </li>
     `);

    // when
    const items = convertDescriptionToItems(html, options);

    // then
    const expectedItems = [
      new TextItem("<ul><li>test #0</li><li>test #1</li></ul>"),
      new ImageItem("/test_url"),
    ];
    items.should.eql(expectedItems);
  });

  it("should convert heading containing bold text to b tag in list", () => {
    // given
    const html = givenHtmlWithContent(`
      <ul>
        <li>
          <h4>test <strong>#0</strong></h4>
        </li>
        <li>
          test #1
        </li>
      </ul>`);

    // when
    const items = convertDescriptionToItems(html, options);

    // then
    const expectedItems = [
      new TextItem("<ul><li><b>test #0</b></li><li>test #1</li></ul>"),
    ];
    items.should.eql(expectedItems);
  });
});
