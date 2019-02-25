"use strict";

var _joi = _interopRequireDefault(require("joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ParseModel {
  static get schema() {
    return {
      text: _joi.default.string().description('Text to parse'),
      timezone: _joi.default.string().description('Timezone for duckling parse. Default UTC')
    };
  }

}

module.exports = ParseModel;
//# sourceMappingURL=parse.model.js.map