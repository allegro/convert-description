import { JSDOM } from "jsdom";

import galleryConverter from "../../src/converters/galleryConverter";

describe("galleryConverter", () => {
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

  it("should replace gallery tag with image from gallery", () => {
    // given
    const dom = givenDomWithElement("<galeria/>");
    const options = {
      gallery: ["http://gallery/image1", "http://gallery/image2"],
    };

    // when
    galleryConverter(dom, options);

    // then
    const expected = `<img src="${options.gallery[0]}">`;
    const expectedHtml = givenHtmlWithElement(expected);
    dom.should.contain.html(expectedHtml);
  });

  it("should keep gallery content", () => {
    // given
    const dom = givenDomWithElement(`
      <div>
        <p>test #0</p>
        <galeria>
          test #1
          <p>test #2</p>
        </galeria>
        <p>test #3</p>
      </div>`);
    const options = {
      gallery: ["http://gallery/image1", "http://gallery/image2"],
    };

    // when
    galleryConverter(dom, options);

    // then
    dom.should.contain.html(
      givenHtmlWithElement(`
      <div>
        <p>test #0</p>
        <img src="http://gallery/image1" />
        test #1
        <p>test #2</p>
        <p>test #3</p>
      </div>`),
    );
  });

  it("should remove gallery tag if gallery is empty", () => {
    // given
    const dom = givenDomWithElement("<div><p>test content</p><galeria/></div>");
    const options = { gallery: [] };

    // when
    galleryConverter(dom, options);

    // then
    const expected = "<div><p>test content</p></div>";
    const expectedHtml = givenHtmlWithElement(expected);
    dom.should.contain.html(expectedHtml);
  });

  it("should replace gallery tag with its content if gallery is empty", () => {
    // given
    const dom = givenDomWithElement(`
      <div>
        <p>test #0</p>
        <galeria>
          test #1
          <p>test #2</p>
        </galeria>
        <p>test #3</p>
      </div>`);
    const options = { gallery: [] };

    // when
    galleryConverter(dom, options);

    // then
    dom.should.contain.html(
      givenHtmlWithElement(`
      <div>
        <p>test #0</p>
        test #1
        <p>test #2</p>
        <p>test #3</p>
      </div>`),
    );
  });
});
