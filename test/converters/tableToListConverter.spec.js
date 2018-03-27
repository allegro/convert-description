import { JSDOM } from "jsdom";
import given from "mocha-testdata";

import tableToListConverter from "../../src/converters/tableToListConverter";

describe("tableToListConverter", () => {
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

  describe("parameterized tables", () => {
    given([
      `<table>
       <tr> <th>Kolor</th> <th>Rozmiar</th> <th>Typ</th> <th>Cena</th> </tr>
       <tr> <td>black</td> <td>s/m</td> <td>szlafrok</td> <td>116 zł.</td> </tr>
       </table>`,
      `<table>
       <tr> <th><b>K</b>olor</th> <th><b>Rozmiar</b></th> <th>Typ</th> <th><b>Cena</b></th> </tr>
       <tr> <td><b>b</b>lack</td> <td><b>s/m</b></td> <td>szlafrok</td> <td>116 <b>zł.</b></td> </tr>
       </table>`,
      `<table><tbody>
       <tr> <th>Kolor</th> <th>Rozmiar</th> <th>Typ</th> <th>Cena</th> </tr>
       <tr> <td>black</td> <td>s/m</td> <td>szlafrok</td> <td>116 zł.</td> </tr>
       </tbody></table>`,
      `<table>
       <thead><tr> <th>Kolor</th> <th>Rozmiar</th> <th>Typ</th> <th>Cena</th> </tr></thead>
       <tbody>
       <tr> <td>black</td> <td>s/m</td> <td>szlafrok</td> <td>116 zł.</td> </tr>
       </tbody></table>`,
      `<table>
       <tr> <td>Kolor</td> <td>black</td> </tr>
       <tr> <td>Rozmiar</td> <td>s/m</td> </tr>
       <tr> <td>Typ</td> <td>szlafrok</td> </tr>
       <tr> <td>Cena</td>  <td>116 zł.</td> </tr>
       </table>`,
    ]).it("should convert simple parameters table", (table) => {
      // given
      const dom = givenDomWithElement(table);

      // when
      tableToListConverter(dom);

      // then
      const expectedList = `
      <ul>
        <li><b>Kolor:</b> black</li>
        <li><b>Rozmiar:</b> s/m</li>
        <li><b>Typ:</b> szlafrok</li>
        <li><b>Cena:</b> 116 zł.</li>
      </ul>`;
      const expectedHtml = givenHtmlWithElement(expectedList);
      dom.should.contain.html(expectedHtml);
    });

    given([
      `<table>
       <caption>Parametry</caption>
       <tr> <th>Kolor</th> <th>Rozmiar</th> <th>Typ</th> <th>Cena</th> </tr>
       <tr> <td>black</td> <td>s/m</td> <td>szlafrok</td> <td>116 zł.</td> </tr>
       </table>`,
      `<table>
       <tr> <th colspan="4">Parametry</th></tr>
       <tr> <th>Kolor</th> <th>Rozmiar</th> <th>Typ</th> <th>Cena</th> </tr>
       <tr> <td>black</td> <td>s/m</td> <td>szlafrok</td> <td>116 zł.</td> </tr>
       </table>`,
      `<table>
       <caption>Parametry</caption>
       <tr> <td>Kolor</td> <td>black</td> </tr>
       <tr> <td>Rozmiar</td> <td>s/m</td> </tr>
       <tr> <td>Typ</td> <td>szlafrok</td> </tr>
       <tr> <td>Cena</td>  <td>116 zł.</td> </tr>
       </table>`,
      `<table>
       <tr> <th colspan="2">Parametry</th></tr>
       <tr> <td>Kolor</td> <td>black</td> </tr>
       <tr> <td>Rozmiar</td> <td>s/m</td> </tr>
       <tr> <td>Typ</td> <td>szlafrok</td> </tr>
       <tr> <td>Cena</td>  <td>116 zł.</td> </tr>
       </table>`,
    ]).it("should convert table with caption", (table) => {
      // given
      const dom = givenDomWithElement(table);

      // when
      tableToListConverter(dom);

      // then
      const expectedList = `
      <p>Parametry</p>
      <ul>
        <li><b>Kolor:</b> black</li>
        <li><b>Rozmiar:</b> s/m</li>
        <li><b>Typ:</b> szlafrok</li>
        <li><b>Cena:</b> 116 zł.</li>
      </ul>`;
      const expectedHtml = givenHtmlWithElement(expectedList);
      dom.should.contain.html(expectedHtml);
    });

    given([
      `<table>
       <tr> <td></td> <td>black</td> </tr>
       <tr> <td></td> <td>s/m</td> </tr>
       <tr> <td></td> <td>szlafrok</td> </tr>
       <tr> <td>Cena</td>  <td>116 zł.</td> </tr>
       </table>`,
    ]).it("should convert table with empty parameter name", (table) => {
      // given
      const dom = givenDomWithElement(table);

      // when
      tableToListConverter(dom);

      // then
      const expectedList = `
      <ul>
        <li>black</li>
        <li>s/m</li>
        <li>szlafrok</li>
        <li><b>Cena:</b> 116 zł.</li>
      </ul>`;
      const expectedHtml = givenHtmlWithElement(expectedList);
      dom.should.contain.html(expectedHtml);
    });

    it("should convert different parameter sets to separate lists", () => {
      // given
      const dom = givenDomWithElement(`
        <table>
          <tr> <th colspan="2">Parametry 1</th></tr>
          <tr> <td>Kolor</td> <td>black</td> </tr>
          <tr> <td>Rozmiar</td> <td>s/m</td> </tr>
          <tr> <th colspan="2">Parametry 2</th></tr>
          <tr> <td>Typ</td> <td>szlafrok</td> </tr>
          <tr> <td>Cena</td>  <td>116 zł.</td> </tr>
        </table>`);

      // when
      tableToListConverter(dom);

      // then
      const expectedLists = `
      <p>Parametry 1</p>
      <ul>
        <li><b>Kolor:</b> black</li>
        <li><b>Rozmiar:</b> s/m</li>
      </ul>
      <p>Parametry 2</p>
      <ul>
        <li><b>Typ:</b> szlafrok</li>
        <li><b>Cena:</b> 116 zł.</li>
      </ul>`;
      const expectedHtml = givenHtmlWithElement(expectedLists);
      dom.should.contain.html(expectedHtml);
    });

    given([
      `<table>
     <tr> <th>Kolor:</th> <th>Rozmiar:</th> <th>Typ:</th> <th>Cena:</th> </tr>
     <tr> <td>black</td> <td>s/m</td> <td>szlafrok</td> <td>116 zł.</td> </tr>
     </table>`,
      `<table>
     <tr> <th><b>K</b>olor:</th> <th><b>Rozmiar:</b></th> <th>Typ:</th> <th><b>Cena</b>:</th> </tr>
     <tr> <td><b>b</b>lack</td> <td><b>s/m</b></td> <td>szlafrok</td> <td>116 <b>zł.</b></td> </tr>
     </table>`,
      `<table><tbody>
     <tr> <th>Kolor:</th> <th>Rozmiar:</th> <th>Typ:</th> <th>Cena:</th> </tr>
     <tr> <td>black</td> <td>s/m</td> <td>szlafrok</td> <td>116 zł.</td> </tr>
     </tbody></table>`,
      `<table>
     <thead><tr> <th>Kolor:</th> <th>Rozmiar:</th> <th>Typ:</th> <th>Cena:</th> </tr></thead>
     <tbody>
     <tr> <td>black</td> <td>s/m</td> <td>szlafrok</td> <td>116 zł.</td> </tr>
     </tbody></table>`,
      `<table>
     <tr> <td>Kolor:</td> <td>black</td> </tr>
     <tr> <td>Rozmiar:</td> <td>s/m</td> </tr>
     <tr> <td>Typ:</td> <td>szlafrok</td> </tr>
     <tr> <td>Cena:</td>  <td>116 zł.</td> </tr>
     </table>`,
    ]).it("should not add additional colon", (table) => {
      // given
      const dom = givenDomWithElement(table);

      // when
      tableToListConverter(dom);

      // then
      const expectedList = `
      <ul>
        <li><b>Kolor:</b> black</li>
        <li><b>Rozmiar:</b> s/m</li>
        <li><b>Typ:</b> szlafrok</li>
        <li><b>Cena:</b> 116 zł.</li>
      </ul>`;
      const expectedHtml = givenHtmlWithElement(expectedList);
      dom.should.contain.html(expectedHtml);
    });

    it("should convert table with only one row", () => {
      // given
      const dom = givenDomWithElement(
        "<table><tr><th>key</th><td>value</td></tr>",
      );

      // when
      tableToListConverter(dom);

      // then
      const expectedList = `
      <ul>
        <li><b>key:</b> value</li>
      </ul>`;
      const expectedHtml = givenHtmlWithElement(expectedList);
      dom.should.contain.html(expectedHtml);
    });

    it("should skip spacer row", () => {
      // given
      const dom = givenDomWithElement(`
        <table>
          <tr> <th colspan="2">Parametry 1</th></tr>
          <tr> <td>Kolor</td> <td>black</td> </tr>
          <tr> <td colspan="2">&nbsp;</td> </tr>
          <tr> <th colspan="2">Parametry 2</th></tr>
          <tr> <td>Cena</td>  <td>116 zł.</td> </tr>
        </table>`);

      // when
      tableToListConverter(dom);

      // then
      const expectedLists = `
      <p>Parametry 1</p>
      <ul>
        <li><b>Kolor:</b> black</li>
      </ul>
      <p>Parametry 2</p>
      <ul>
        <li><b>Cena:</b> 116 zł.</li>
      </ul>`;
      const expectedHtml = givenHtmlWithElement(expectedLists);
      dom.should.contain.html(expectedHtml);
    });
  });

  describe("tabular data table", () => {
    it("should convert simple tabular data table", () => {
      // given
      const table = `<table>
      <tr>
      <td><a href="http://serwer/data.aspx">AUDI</a></td>
      <td>A2</td>
      <td>1.4</td>
      <td>2000.02 - 2005.08</td>
      </tr>
      <tr>
      <td><a href="http://serwer/data.aspx">AUDI</a></td>
      <td>A3</td>
      <td>1.4</td>
      <td>2000.02 - 2005.08</td>
      </tr>
      <tr>
      <td><a rel="nofollow" href="http://serwer/data.aspx">BMW</a></td>
      <td>M2</td>
      <td>1.4</td>
      <td>2003.11 - 2005.08</td>
      </tr>
      <tr>
      <td><a rel="nofollow" href="http://serwer/data.aspx">BMW</a></td>
      <td>M3</td>
      <td>1.6</td>
      <td>2002.05 - 2005.08</td>
      </tr>
      </table>`;
      const dom = givenDomWithElement(table);

      // when
      tableToListConverter(dom);

      // then
      const expectedHtml = `
      <p>
        <b>AUDI:</b>
      </p>
      <ul>
        <li>A2, 1.4, 2000.02 - 2005.08</li>
        <li>A3, 1.4, 2000.02 - 2005.08</li>
      </ul>
      <p>
        <b>BMW:</b>
      </p>
      <ul>
        <li>M2, 1.4, 2003.11 - 2005.08</li>
        <li>M3, 1.6, 2002.05 - 2005.08</li>
      </ul>`;

      dom.should.contain.html(givenHtmlWithElement(expectedHtml));
    });

    it("should convert simple tabular data table with headings", () => {
      // given
      const table = `<table>
      <tr>
      <th>MARKA</th>
      <th>MODEL</th>
      <th>SILNIK</th>
      <th>SYMBOL</th>
      </tr>  
      <tr>
      <td><a href="http://serwer/data.aspx">AUDI</a></td>
      <td>A2</td>
      <td>1.4</td>
      <td>2000.02 - 2005.08</td>
      </tr>
      <tr>
      <td><a href="http://serwer/data.aspx">AUDI</a></td>
      <td>A3</td>
      <td>1.4</td>
      <td>2000.02 - 2005.08</td>
      </tr>
      <tr>
      <td><a rel="nofollow" href="http://serwer/data.aspx">BMW</a></td>
      <td>M2</td>
      <td>1.4</td>
      <td>2003.11 - 2005.08</td>
      </tr>
      <tr>
      <td><a rel="nofollow" href="http://serwer/data.aspx">BMW</a></td>
      <td>M3</td>
      <td>1.6</td>
      <td>2002.05 - 2005.08</td>
      </tr>
      </table>`;
      const dom = givenDomWithElement(table);

      // when
      tableToListConverter(dom);

      // then
      const expectedHtml = `
      <p>
        <b>MARKA:</b>
      </p>
      <ul>
        <li>MODEL, SILNIK, SYMBOL</li>
      </ul>
      <p>
        <b>AUDI:</b>
      </p>
      <ul>
        <li>A2, 1.4, 2000.02 - 2005.08</li>
        <li>A3, 1.4, 2000.02 - 2005.08</li>
      </ul>
      <p>
        <b>BMW:</b>
      </p>
      <ul>
        <li>M2, 1.4, 2003.11 - 2005.08</li>
        <li>M3, 1.6, 2002.05 - 2005.08</li>
      </ul>`;

      dom.should.contain.html(givenHtmlWithElement(expectedHtml));
    });

    it("should convert tabular data table having unique rows", () => {
      // given
      const table = `<table>
      <tr>
      <td>A</td><td>B</td><td>C</td><td>D</td>
      </tr>
      <tr>
      <td>1</td><td>2</td><td>3</td><td>4</td>
      </tr>
      <tr>
      <td>a</td><td>b</td><td>c</td><td>d</td>
      </tr>
      </table>`;
      const dom = givenDomWithElement(table);

      // when
      tableToListConverter(dom);

      // then
      const expectedHtml = `
      <ul>
        <li>A, B, C, D</li>
        <li>1, 2, 3, 4</li>
        <li>a, b, c, d</li>
      </ul>`;

      dom.should.contain.html(givenHtmlWithElement(expectedHtml));
    });

    it("should tabular data be grouped up to 2 columns", () => {
      // given
      const table = `<table>
      <tr>
      <td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>A</td>
      </tr>
      <tr>
      <td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>B</td>
      </tr>
      <tr>
      <td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>C</td>
      </tr>
      </table>`;
      const dom = givenDomWithElement(table);

      // when
      tableToListConverter(dom);

      // then
      const expectedHtml = `
      <p>
        <b>1, 2:</b>
      </p>
      <ul>
        <li>3, 4, 5, A</li>
        <li>3, 4, 5, B</li>
        <li>3, 4, 5, C</li>
      </ul>`;

      dom.should.contain.html(givenHtmlWithElement(expectedHtml));
    });

    it("should convert table with different number of cells", () => {
      // given
      const table = `<table>
        <tr>
          <th>1</th> <th>2</th> <th>3</th> <th>4</th> <th>5</th>
        </tr> <tr>
          <td>1</td> <td>2</td> <td>3</td> <td>4</td> <td>5</td> <td>A</td>
        </tr> <tr>
          <td>1</td> <td>2</td> <td>3</td> <td>4</td> <td>5</td> <td>B</td>
        </tr>
      </table>`;
      const dom = givenDomWithElement(table);

      // when
      tableToListConverter(dom);

      // then
      const expectedHtml = `
      <p>
        <b>1, 2:</b>
      </p>
      <ul>
        <li>3, 4, 5</li>
        <li>3, 4, 5, A</li>
        <li>3, 4, 5, B</li>
      </ul>`;

      dom.should.contain.html(givenHtmlWithElement(expectedHtml));
    });

    it("should convert table with captions", () => {
      // given
      const table = `
        <table>
        <tbody>
        <tr><td colspan="3">caption 1</td></tr>
        <tr><th>A</th><th>B</th><th>C</th></tr>
        <tr><td>1</td><td>2</td><td>3</td></tr>

        <tr><td colspan="3">caption 2</td></tr>
        <tr><td>11</td><td>12</td><td>13</td></tr>
        <tr><td>11</td><td>12</td><td>23</td></tr>
        </tbody>
        </table>
      `;
      const dom = givenDomWithElement(table);

      // when
      tableToListConverter(dom);

      // then
      const expectedHtml = `
      <p>
        <b>caption 1:</b>
      </p>
      <ul>
        <li>A, B, C</li>
        <li>1, 2, 3</li>
      </ul>
      <p>
        <b>caption 2:</b>
      </p>
      <ul>
        <li>11, 12, 13</li>
        <li>11, 12, 23</li>
      </ul>`;

      dom.should.contain.html(givenHtmlWithElement(expectedHtml));
    });

    given([
      "<table></table>",
      `<table>
         <tr></tr>
         <tr><td>1</td><td>2</td><td>3</td></tr>
       </table>`,
    ]).it("should skip converting incorrect table", (table) => {
      // given
      const dom = givenDomWithElement(table);

      // expect
      (() => tableToListConverter(dom)).should.not.throw();
      dom.should.contain.html(givenHtmlWithElement(table));
    });
  });

  given([
    `<table>
     <tr> <th>1</th> <th>2</th> <th>3</th> </tr>
     </table>`,
    `<table>
     <tr> <th>1</th> <th>2</th> <th>3</th> </tr>
     <tr> <th>1</th> <th>2</th> </tr>
     </table>`,
    `<table>
     <tr> <th>1</th> <th>2</th> </tr>
     <tr> <td>1</td> <td>2</td> </tr>
     <tr> <td>1</td> <td>2</td> <td>3</td> </tr>
     </table>`,
    `<table>
     <tr> <th>1</th> </tr>
     <tr> <td>1</td> </tr>
     <tr> <td>1</td> </tr>
     </table>`,
  ]).it("should skip tables without parameters or tabular data", (table) => {
    // given
    const dom = givenDomWithElement(table);

    // when
    tableToListConverter(dom);

    // then
    const expectedHtml = givenHtmlWithElement(table);
    dom.should.contain.html(expectedHtml);
  });

  given([
    `<table>
     <tr> <th>1</th> <th>2</th> <th>3</th> </tr>
     <tr> <td><img src="dummy.jpg"> </td> <td></td> <td></td> </tr>
     </table>`,
    `<table>
     <tr> <th>1</th> <th>2</th> <th>3</th> </tr>
     <tr> <td><p>text</p></td> <td></td> <td></td> </tr>
     </table>`,
    `<table>
     <tr> <th>1</th> <th>2</th> <th>3</th> </tr>
     <tr> <td><table><tr><td>text</td></tr></table></td> <td></td> <td></td> </tr>
     </table>`,
  ]).it(
    "should skip tables containing images, paragraphs or another tables",
    (table) => {
      // given
      const dom = givenDomWithElement(table);

      // when
      tableToListConverter(dom);

      // then
      const expectedHtml = givenHtmlWithElement(table);
      dom.should.contain.html(expectedHtml);
    },
  );
});
