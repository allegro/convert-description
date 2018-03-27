import { JSDOM } from "jsdom";
import given from "mocha-testdata";

import headingConverter from "../../src/converters/headingConverter";

describe("headingConverter", () => {
  function givenHtmlWithElement(element) {
    return `
      <html>
        <body>
          <div>
            <div>This is description </div>
            ${element}
          </div>
        </body>
      </html>
    `;
  }

  function givenDomWithElement(element) {
    return new JSDOM(givenHtmlWithElement(element));
  }

  const options = { normalizeHeadings: true };

  given([
    "<h1>test #1</h1><h2>test #2</h2><h3>test #3</h3><h4>test #4</h4>",
    "<h2>test #1</h2><h3>test #2</h3><h4>test #3</h4><h5>test #4</h5>",
    "<h1>test #1</h1><h3>test #2</h3><h5>test #3</h5><h6>test #4</h6>",
  ]).it("should convert headings", (html) => {
    // given
    const dom = givenDomWithElement(html);

    // when
    headingConverter(dom, options);

    // then
    const expected = `
      <h1>test #1</h1>
      <h2>test #2</h2>
      <p><b>test #3</b></p>
      <p><b>test #4</b></p>`;
    const expectedHtml = givenHtmlWithElement(expected);
    dom.should.contain.html(expectedHtml);
  });

  it("should not normalize headings", () => {
    // given
    const dom = givenDomWithElement("<h1>test #1</h1><h3>test #2</h3>");

    // when
    headingConverter(dom, { normalizeHeadings: false });

    // then
    const expected = `
      <h1>test #1</h1>
      <p><b>test #2</b></p>`;
    const expectedHtml = givenHtmlWithElement(expected);
    dom.should.contain.html(expectedHtml);
  });

  given(
    "<b>test #0</b><p>test #1</p>",
    "<b>test #0</b><table><tr><td>test #1</td></tr></table>",
    "<b>test #0</b><ul><li>test #1</li></ul>",
    "<b>test #0</b><ol><li>test #1</li></ol>",
    "<h2>test #0</h2>",
  ).it(
    "should replace heading with its content if contains container element",
    (content) => {
      // given
      const dom = givenDomWithElement(`<h1>${content}</h1>`);

      // when
      headingConverter(dom, options);

      // then
      const expectedHtml = givenHtmlWithElement(content);
      dom.should.contain.html(expectedHtml);
    },
  );

  given("h1", "h2", "h3", "h4", "h5", "h6").it(
    "should remove heading if is empty",
    (tag) => {
      // given
      const dom = givenDomWithElement(`
      <p>test #0</p>
      <${tag}></${tag}>  
      <p>test #1</p>`);

      // when
      headingConverter(dom, options);

      // then
      const expected = `
      <p>test #0</p>
      <p>test #1</p>`;
      const expectedHtml = givenHtmlWithElement(expected);
      dom.should.contain.html(expectedHtml);
    },
  );

  given("h1", "h2", "h3", "h4", "h5", "h6").it(
    "should convert heading to b contained in p if is child of list item",
    (tag) => {
      // given
      const dom = givenDomWithElement(`
      <ul>
        <li><${tag}>test #0</${tag}></li>
        <li><${tag}></${tag}>test #1</li>
      </ul>`);

      // when
      headingConverter(dom, options);

      // then
      const expected = `
      <ul>
        <li><p><b>test #0</b></p></li>
        <li>test #1</li>
      </ul>`;
      const expectedHtml = givenHtmlWithElement(expected);
      dom.should.contain.html(expectedHtml);
    },
  );

  given("h1", "h2", "h3", "h4", "h5", "h6").it(
    "should convert heading to b contained in p if is child of list",
    (tag) => {
      // given
      const dom = givenDomWithElement(`
      <ul>
        <${tag}>test #0</${tag}>
        <li>test #1</li>
      </ul>
      <ol>
        <${tag}>test #2</${tag}>
        <li>test #3</li>
      </ol>`);

      // when
      headingConverter(dom, options);

      // then
      const expected = `
      <ul>
        <p><b>test #0</b></p>
        <li>test #1</li>
      </ul>
      <ol>
        <p><b>test #2</b></p>
        <li>test #3</li>
      </ol>`;
      const expectedHtml = givenHtmlWithElement(expected);
      dom.should.contain.html(expectedHtml);
    },
  );

  it("should remove b tag from heading", () => {
    // given
    const dom = givenDomWithElement("<h1>test <b>#0</b></h1>");

    // when
    headingConverter(dom, options);

    // then
    const expected = "<h1>test #0</h1>";
    const expectedHtml = givenHtmlWithElement(expected);
    dom.should.contain.html(expectedHtml);
  });

  given("h1", "h2", "h3", "h4", "h5", "h6").it(
    "should remove b tag from heading if is child of list item",
    (tag) => {
      // given
      const dom = givenDomWithElement(`
      <ul>
        <li><${tag}>test <b>#0</b></${tag}></li>
        <li>test #1</li>
      </ul>`);

      // when
      headingConverter(dom, options);

      // then
      const expected =
        "<ul><li><p><b>test #0</b></p></li><li>test #1</li></ul>";
      const expectedHtml = givenHtmlWithElement(expected);
      dom.should.contain.html(expectedHtml);
    },
  );

  given("h1", "h2", "h3", "h4", "h5", "h6").it(
    "should remove b tag from heading if is child of list",
    (tag) => {
      // given
      const dom = givenDomWithElement(`
      <ul>
        <${tag}>test <b>#0</b></${tag}>
        <li>test #1</li>
      </ul>`);

      // when
      headingConverter(dom, options);

      // then
      const expected = "<ul><p><b>test #0</b></p><li>test #1</li></ul>";
      const expectedHtml = givenHtmlWithElement(expected);
      dom.should.contain.html(expectedHtml);
    },
  );
});
