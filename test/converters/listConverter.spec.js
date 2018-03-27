import { JSDOM } from "jsdom";

import listConverter from "../../src/converters/listConverter";

describe("listConverter", () => {
  function givenHtmlWithElement(element) {
    return `
      <html>
        <body>
          <div>
            <p>This is description </p>
            ${element}
          </div>
        </body>
      </html>
    `;
  }

  function givenDomWithElement(element) {
    return new JSDOM(givenHtmlWithElement(element));
  }

  it("should merge p into li before it", () => {
    // given
    const dom = givenDomWithElement(`
      <ul>
        <li>test #0</li>
        <p>test #1</p>
        <li>test #2</li>
        <p>test #3</p>
        <p>test #4</p>
      </ul>`);

    // when
    listConverter(dom);

    // then
    dom.should.contain.html(
      givenHtmlWithElement(`
      <ul>
        <li>test #0
          <p>test #1</p>
        </li>
        <li>test #2
          <p>test #3</p>
          <p>test #4</p>
        </li>
      </ul>`),
    );
  });

  it("should move up p before first li", () => {
    // given
    const dom = givenDomWithElement(`
      <ul>
        <p>test #0</p>
        <p>test #1</p>
        <li>test #2</li>
        <li>test #3</li>
      </ul>`);

    // when
    listConverter(dom);

    // then
    dom.should.contain.html(
      givenHtmlWithElement(`
      <p>test #0</p>
      <p>test #1</p>
      <ul>
        <li>test #2</li>
        <li>test #3</li>
      </ul>`),
    );
  });

  it("should move up p to empty li", () => {
    // given
    const dom = givenDomWithElement(`
      <ul>
        <li></li>
        <p>test <b>#0</b></p>
        <p>test #1</p>
        <li>test #2</li>
      </ul>`);

    // when
    listConverter(dom);

    // then
    dom.should.contain.html(
      givenHtmlWithElement(`
      <ul>
        <li>test <b>#0</b>
          <p>test #1</p>
        </li>
        <li>test #2</li>
      </ul>`),
    );
  });

  it("should pull out nested list items keeping order", () => {
    // given
    const element =
      "<ul>" +
      "<li>test #0</li>" +
      "<li>" +
      "<p>test #1</p>" +
      "<ol>" +
      "<li>test #1.0</li>" +
      "<li>test #1.1</li>" +
      "<li>test <b>#1.2</b>" +
      "<p>test #1.3</p>" +
      "<ul>" +
      "<li>test #1.3.0</li>" +
      "<li>test #1.3.1</li>" +
      "</ul>" +
      "<p>test #1.4</p>" +
      "</li>" +
      "</ol>" +
      "<ol>" +
      "<li>test #2.0</li>" +
      "<li>test #2.1</li>" +
      "</ol>" +
      "</li>" +
      "<ul>" +
      "<li>test #3</li>" +
      "<li>test #4</li>" +
      "<p>test #5</p>" +
      "</ul>" +
      "<li>" +
      "<ul>" +
      "<li>test #6.0</li>" +
      "<li>test <b>#6.1</b></li>" +
      "</ul>" +
      "</li>" +
      "</ul>";
    const dom = givenDomWithElement(element);

    // when
    listConverter(dom);

    // then
    const expected =
      "<ul>" +
      "<li>test #0</li>" +
      "<li>" +
      "test #1" +
      "<p>test #1.0</p>" +
      "<p>test #1.1</p>" +
      "<p>test <b>#1.2</b></p>" +
      "<p>test #1.3</p>" +
      "<p>test #1.3.0</p>" +
      "<p>test #1.3.1</p>" +
      "<p>test #1.4</p>" +
      "<p>test #2.0</p>" +
      "<p>test #2.1</p>" +
      "</li>" +
      "<li>test #3</li>" +
      "<li>" +
      "test #4" +
      "<p>test #5</p>" +
      "</li>" +
      "<li>" +
      "test #6.0" +
      "<p>test <b>#6.1</b></p>" +
      "</li>" +
      "</ul>";
    const expectedHtml = givenHtmlWithElement(expected);
    dom.should.contain.html(expectedHtml);
  });

  it("should remove li element if contains no child", () => {
    // given
    const element = `
      <ul>
        <li>test #0</li>
        <li></li>
        <li>test #1</li>
      </ul>
    `;
    const dom = givenDomWithElement(element);

    // when
    listConverter(dom);

    // then
    const expected = `
      <ul>
        <li>test #0</li>
        <li>test #1</li>
      </ul>`;
    const expectedHtml = givenHtmlWithElement(expected);
    dom.should.contain.html(expectedHtml);
  });

  it("should put orphan li into ul", () => {
    // given
    const element =
      "<li>test #0</li>" +
      "<li>test #1</li>" +
      "<p>test text</p>" +
      "<li>test #2</li>" +
      "<li>test #3</li>";
    const dom = givenDomWithElement(element);

    // when
    listConverter(dom);

    // then
    const expected =
      "<ul>" +
      "<li>test #0</li>" +
      "<li>test #1</li>" +
      "</ul>" +
      "<p>test text</p>" +
      "<ul>" +
      "<li>test #2</li>" +
      "<li>test #3</li>" +
      "</ul>";
    const expectedHtml = givenHtmlWithElement(expected);
    dom.should.contain.html(expectedHtml);
  });

  it("should merge nested list with orphan li", () => {
    // given
    const element =
      "<li>test #0</li>" +
      "<li>" +
      "<ul>" +
      "<li>test #0</li>" +
      "<li>test #1</li>" +
      "</ul>" +
      "</li>" +
      "<li>test #2</li>";
    const dom = givenDomWithElement(element);

    // when
    listConverter(dom);

    // then
    const expected =
      "<ul>" +
      "<li>test #0</li>" +
      "<li>" +
      "test #0" +
      "<p>test #1</p>" +
      "</li>" +
      "<li>test #2</li>" +
      "</ul>";
    const expectedHtml = givenHtmlWithElement(expected);
    dom.should.contain.html(expectedHtml);
  });

  it("should replace list with its content if contains no li element", () => {
    // given
    const dom = givenDomWithElement(`
      <ul>
        <p>test #0</p>
        <ul>
          <li>test #1</li>
        </ul>
        <ul>
          <p>test #2</p>
        </ul>
      </ul>`);

    // when
    listConverter(dom);

    // then
    dom.should.contain.html(
      givenHtmlWithElement(`
      <p>test #0</p>
      <ul>
        <li>test #1</li>
      </ul>
      <p>test #2</p>`),
    );
  });

  it("should ensure first li child node is text", () => {
    // given
    const dom = givenDomWithElement(
      "<ul>" +
        "<li><p>test #0</p></li>" +
        "<li>" +
        "<p>test #1</p>" +
        "<p>test #2</p>" +
        "</li>" +
        "</ul>",
    );

    // when
    listConverter(dom);

    // then
    dom.should.contain.html(
      givenHtmlWithElement(`
      <ul>
        <li>test #0</li>
        <li>test #1
          <p>test #2</p>
        </li>
      </ul>`),
    );
  });
});
