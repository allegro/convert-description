import registerDOM from "../../src/libs/registerDOM";
import BrowserDOMParser from "../../src/libs/BrowserDOMParser";

describe("BrowserDOMParser", () => {
  let cleanupDOM;

  beforeEach(() => {
    cleanupDOM = registerDOM();
    document.body.innerHTML = "<div>test content #0</div>";
  });

  afterEach(() => {
    cleanupDOM();
  });

  it("should use hidden iframe", () => {
    // given
    const html = "<div>test content #1</div>";

    // when
    const parser = new BrowserDOMParser();
    const dom = parser.parseFromString(html);

    // then
    dom.window.document.body.innerHTML.should.equal(html);
    document.body.innerHTML.should.equal(
      '<div>test content #0</div><iframe style="display: none;"></iframe>',
    );
  });

  it("should remove iframe on cleanup", () => {
    // given
    const html = "<div>test content #1</div>";

    // when
    const parser = new BrowserDOMParser();
    parser.parseFromString(html);
    parser.cleanup();

    // then
    document.body.innerHTML.should.equal("<div>test content #0</div>");
  });
});
