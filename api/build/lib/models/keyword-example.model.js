"use strict";

var _joi = _interopRequireDefault(require("joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ExampleModel {
  static get schema() {
    return {
      value: _joi.default.string().trim(),
      synonyms: _joi.default.array().items(_joi.default.string().trim())
    };
  }

}

module.exports = ExampleModel;
//# sourceMappingURL=keyword-example.model.js.map