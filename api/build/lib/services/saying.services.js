"use strict";

var _schmervice = _interopRequireDefault(require("schmervice"));

var _sayingRemove = _interopRequireDefault(require("./saying/saying.remove.service"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = class SayingService extends _schmervice.default.Service {
  async remove() {
    return await _sayingRemove.default.apply(this, arguments);
  }

};
//# sourceMappingURL=saying.services.js.map