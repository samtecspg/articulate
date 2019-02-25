"use strict";

var _joi = _interopRequireDefault(require("joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class SayingKeywordModel {
  static get schema() {
    return {
      start: _joi.default.number(),
      end: _joi.default.number(),
      value: _joi.default.string().trim(),
      keyword: _joi.default.string().trim(),
      keywordId: _joi.default.number(),
      extractor: _joi.default.string().trim()
    };
  }

}

module.exports = SayingKeywordModel;
//# sourceMappingURL=saying.keyword.model.js.map