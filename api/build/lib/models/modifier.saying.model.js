"use strict";

var _joi = _interopRequireDefault(require("joi"));

var _sayingKeyword = _interopRequireDefault(require("./saying.keyword.model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ModifierSayingModel {
  static get schema() {
    return {
      userSays: _joi.default.string().trim(),
      keywords: _joi.default.array().items(_sayingKeyword.default.schema)
    };
  }

}

module.exports = ModifierSayingModel;
//# sourceMappingURL=modifier.saying.model.js.map