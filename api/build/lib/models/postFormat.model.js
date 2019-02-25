"use strict";

var _joi = _interopRequireDefault(require("joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class PostFormat {
  static get schema() {
    return {
      id: _joi.default.number(),
      postFormatPayload: _joi.default.string().trim(),
      creationDate: _joi.default.string(),
      modificationDate: _joi.default.string()
    };
  }

}

module.exports = PostFormat;
//# sourceMappingURL=postFormat.model.js.map