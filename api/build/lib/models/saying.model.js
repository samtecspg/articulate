"use strict";

var _joi = _interopRequireDefault(require("joi"));

var _sayingKeyword = _interopRequireDefault(require("./saying.keyword.model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class SayingModel {
  static get schema() {
    return {
      id: _joi.default.number(),
      agent: _joi.default.string().trim(),
      category: _joi.default.string().trim(),
      userSays: _joi.default.string().trim(),
      keywords: _joi.default.array().items(_sayingKeyword.default.schema),
      actions: _joi.default.array().items(_joi.default.string().trim()),
      creationDate: _joi.default.string(),
      modificationDate: _joi.default.string()
    };
  }

}

module.exports = SayingModel;
//# sourceMappingURL=saying.model.js.map