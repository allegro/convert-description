import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import sinonChai from "sinon-chai";

import chaiHtml from "./chaiHtml";

chai.config.truncateThreshold = 0;

(function setUpChai() {
  chai.should();
  chai.use(sinonChai);
  chai.use(chaiHtml);
  chai.use(chaiAsPromised);
})();
