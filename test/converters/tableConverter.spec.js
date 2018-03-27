import { JSDOM } from "jsdom";
import { given } from "mocha-testdata";

import tableConverter from "../../src/converters/tableConverter";

describe("tableConverter", () => {
  given(
    "<table><th>test <b>#0</b></th></table>",
    "<table><thead><th><td>test <b>#0</b></td></th></thead></table>",
    "<table><tr><td>test <b>#0</b></td></tr></table>",
    "<table><tbody><tr><td>test <b>#0</b></td></tr></tbody></table>",
    "<table><tfoot><tr><td>test <b>#0</b></td></tr></tfoot></table>",
  ).it("should convert cell containing only text into paragraph", (html) => {
    // given
    const dom = new JSDOM(html);

    // when
    tableConverter(dom);

    // then
    dom.should.contain.html("<p>test <b>#0</b></p>");
  });

  given(
    "<p>test #0</p><table><th></th></table>",
    "<p>test #0</p><table><tr><td></tr></table>",
    "<p>test #0</p><table><tfoot><tr><td></td></tr></tfoot></table>",
  ).it("should ignore empty cells", (html) => {
    // given
    const dom = new JSDOM(html);

    // when
    tableConverter(dom);

    // then
    dom.should.contain.html("<p>test #0</p>");
  });

  it("should keep cell child elements", () => {
    // given
    const dom = new JSDOM(
      "<table><tr><td><p>test <b>#0</b></p><p>test <b>#1</b></p></td></tr></table>",
    );

    // when
    tableConverter(dom);

    // then
    dom.should.contain.html("<p>test <b>#0</b></p><p>test <b>#1</b></p>");
  });

  it("should convert each cell into paragraph", () => {
    // given
    const dom = new JSDOM(`
      <table>
        <tbody>
          <tr>
            <td><p>test #0</p><p>test #1</p></td>
            <td>test #2</td>
          </tr>
          <tr>
            <td>test #3</td>
            <td>test #4</td>
          </tr>
        </tbody>
      </table>
    `);

    // when
    tableConverter(dom);

    // then
    dom.should.contain.html(`
      <p>test #0</p>
      <p>test #1</p>
      <p>test #2</p>
      <p>test #3</p>
      <p>test #4</p>
    `);
  });

  it("should convert nested table", () => {
    // given
    const dom = new JSDOM(`
      <table>
        <tr>
          <td><table><tr><td><p>test <b>#0</b></p><p>test <b>#1</b></p></td></tr></table></td>
        </tr>
      </table>
    `);

    // when
    tableConverter(dom);

    // then
    dom.should.contain.html("<p>test <b>#0</b></p><p>test <b>#1</b></p>");
  });

  given(
    "<table><caption><p>test <b>#0</b></p><p>test <b>#1</b></p></caption></table>",
    "<table><table><caption><p>test <b>#0</b></p><p>test <b>#1</b></p></caption></table></table>",
  ).it("should keep caption child elements", (html) => {
    // given
    const dom = new JSDOM(html);

    // when
    tableConverter(dom);

    // then
    dom.should.contain.html("<p>test <b>#0</b></p><p>test <b>#1</b></p>");
  });

  it("should convert table nested in container element", () => {
    // given
    const dom = new JSDOM(`
      <ul>
        <li>test <b>#0</b>
          <table><tr><td>test <b>#1</b></td></tr></table>
        </li>
        <li>test <b>#2</b></li>
      </ul>
    `);

    // when
    tableConverter(dom);

    // then
    dom.should.contain.html(
      "<ul><li>test <b>#0</b><p>test <b>#1</b></p></li><li>test <b>#2</b></li></ul>",
    );
  });
});
