import { JSDOM } from "jsdom";
import attributeConverter from "../../src/converters/attributeConverter";

describe("attributeConverter", () => {
  it("should remove attributes", () => {
    // given
    const dom = new JSDOM(`
      <ul>
        <li aria-haspopup="true">test #0</li>
      </ul>`);

    // when
    attributeConverter(dom);

    // then
    dom.should.contain.html("<ul><li>test #0</li></ul>");
  });

  it("should keep img src attribute", () => {
    // given
    const html = '<img src="/test_url" />';
    const dom = new JSDOM(html);

    // when
    attributeConverter(dom);

    // then
    dom.should.contain.html(html);
  });
});
