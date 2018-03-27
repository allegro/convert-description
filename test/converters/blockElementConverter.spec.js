import { JSDOM } from "jsdom";
import given from "mocha-testdata";

import blockElementConverter from "../../src/converters/blockElementConverter";

describe("blockElementConvert", () => {
  it("should convert text and b tag into paragraph", () => {
    // given
    const dom = new JSDOM(`
      test #0
      <div>
        test <b>#1</b>
        <div>test #2</div>
        <b>test </b>#3
      </div>`);

    // when
    blockElementConverter(dom);

    // then
    dom.should.contain.html(`
      <p>test #0</p>
      <p>test <b>#1</b></p>
      <p>test #2</p>
      <p><b>test </b>#3</p>`);
  });

  it("should preserve spaces between b tags", () => {
    // given
    const dom = new JSDOM(`
      <div>
        <b>test</b> <b>#1</b>
      </div>`);

    // when
    blockElementConverter(dom);

    // then
    dom.window.document.body.firstChild.outerHTML.should.equal(
      "<p><b>test</b> <b>#1</b></p>",
    );
  });

  it("should wrap text around img in paragraph", () => {
    // given
    const dom = new JSDOM(`
      <div>
        test <b>#0</b>
        <img src="/test_src"/>
        <b>test </b>#1
      </div>`);

    // when
    blockElementConverter(dom);

    // then
    dom.should.contain.html(`
      <p>test <b>#0</b></p>
      <img src="/test_src"/>
      <p><b>test </b>#1</p>`);
  });

  given("ul", "ol").it("should convert text and b tag in list", (tag) => {
    // given
    const dom = new JSDOM(`
      <${tag}>
        <div>
          test <b>#</b>0
          <div>test #1</div>
        </div>
        <li>test #2</li>
        <li>
          <div>
            test <b>#3</b>
            <div>test #4</div>
          </div>
        </li>
        <li>
          <div>
            <ul>
              <li>test #5.1</li>
            </ul>
          </div>
        </li>
        <li></li>
        <div>
          test #6
          <li>test #7</li>
        </div>
      </${tag}>`);

    // when
    blockElementConverter(dom);

    // then
    dom.should.contain.html(`
      <${tag}>
        <p>test <b>#</b>0</p>
        <p>test #1</p>
        <li>test #2</li>
        <li><p>test <b>#3</b></p><p>test #4</p></li>
        <li>
          <ul>
            <li>test #5.1</li>
          </ul>
        </li>
        <li></li>
        <p>test #6</p>
        <li>test #7</li>
      </${tag}>`);
  });

  given("ul", "ol").it("should bubble up list", (tag) => {
    // given
    const dom = new JSDOM(`
      <div>
        test #0
        <${tag}>
          <li>test #1</li>
          <li>test #2</li>
        </${tag}>
      </div>`);

    // when
    blockElementConverter(dom);

    // then
    dom.should.contain.html(`
      <p>test #0</p>
      <${tag}>
        <li>test #1</li>
        <li>test #2</li>
      </${tag}>`);
  });

  it("should convert text and b tag in table", () => {
    // given
    const dom = new JSDOM(`
      <table>
        <caption>
          <div>test caption</div>
        </caption>
        <thead>
          <th>test col #0</th>
          <th>test col #1</th>
        </thead>
        <tbody>
          <tr>
            <td>
              test <b>#0</b>
            </td>
            <td>
              test <b>#1</b>
              <div>test #2</div>
            </td>
          </tr>
          <tr>
            <td>
              <table>
                <tr><td>test #3</td></tr>
              </table>
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>
    `);

    // when
    blockElementConverter(dom);

    // then
    dom.should.contain.html(`
      <table>
        <caption><p>test caption</p></caption>
        <thead>
          <th>test col #0</th>
          <th>test col #1</th>
        </thead>
        <tbody>
          <tr>
            <td>test <b>#0</b></td>
            <td><p>test <b>#1</b></p><p>test #2</p></td>
          </tr>
          <tr>
            <td><table><tr><td>test #3</td></tr></table></td>
            <td></td>
          </tr>
        </tbody>
      </table>
    `);
  });

  it("should bubble up table", () => {
    // given
    const dom = new JSDOM(`
      <div>
        test #0
        <table>
          <tr><td>test #1</td></tr>
          <tr><td>test #2</td></tr>
        </table>
      </div>`);

    // when
    blockElementConverter(dom);

    // then
    dom.should.contain.html(`
      <p>test #0</p>
      <table>
        <tr><td>test #1</td></tr>
        <tr><td>test #2</td></tr>
      </table>`);
  });

  given("h1", "h2", "h3", "h4", "h5", "h6").it(
    "should convert text and b tag in heading",
    (tag) => {
      // given
      const dom = new JSDOM(`
      <${tag}>
        test #0
        <div>
          test <b>#1</b>
          <div>test #2</div>
          <b>test </b>#3
        </div>
      </${tag}>
      <${tag}>
        test <b>#4</b>
      </${tag}>`);

      // when
      blockElementConverter(dom);

      // then
      dom.should.contain.html(`
      <${tag}>
        <p>test #0</p>
        <p>test <b>#1</b></p>
        <p>test #2</p>
        <p><b>test </b>#3</p>
      </${tag}>
      <${tag}>test <b>#4</b></${tag}>`);
    },
  );

  given("h1", "h2", "h3", "h4", "h5", "h6").it(
    "should bubble up heading",
    (tag) => {
      // given
      const dom = new JSDOM(`
      <div>
        test #0
        <${tag}>
          test #1
        </${tag}>
      </div>`);

      // when
      blockElementConverter(dom);

      // then
      dom.should.contain.html(`
      <p>test #0</p>
      <${tag}>test #1</${tag}>`);
    },
  );

  given("title", "style").it("should strip non text tag text", (tag) => {
    // given
    const dom = new JSDOM(`
      <div>
        test #0
        <${tag}>test #1</${tag}>
        <div>test <b>#3</b></div>
      </div>`);

    // when
    blockElementConverter(dom);

    // then
    dom.should.be.html("<p>test #0</p><p>test <b>#3</b></p>");
  });

  it("should convert br", () => {
    // given
    const dom = new JSDOM(`
      <br />
      <div>
        <br />
        <br />
        test #0
        <br />
        test <b>#</b>1
        <br />
        <br />
      </div>`);

    // when
    blockElementConverter(dom);

    // then
    dom.should.contain.html("<p>test #0</p><p>test <b>#</b>1</p>");
  });
});
