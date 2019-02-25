"use strict";

var _joi = _interopRequireDefault(require("joi"));

var _keywordExample = _interopRequireDefault(require("./keyword-example.model"));

var _modifier = _interopRequireDefault(require("./modifier.model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class KeywordModel {
  static get schema() {
    return {
      id: _joi.default.number(),
      keywordName: _joi.default.string().trim(),
      uiColor: _joi.default.string().trim(),
      examples: _joi.default.array().items(_keywordExample.default.schema),
      modifiers: _joi.default.array().items(_modifier.default.schema),
      regex: _joi.default.string().trim(),
      type: _joi.default.string().trim(),
      creationDate: _joi.default.string(),
      modificationDate: _joi.default.string()
    };
  }

}

module.exports = KeywordModel;
//# sourceMappingURL=keyword.model.js.map