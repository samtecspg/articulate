"use strict";

var _joi = _interopRequireDefault(require("joi"));

var _modifierSaying = _interopRequireDefault(require("./modifier.saying.model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ModifierModel {
  static get schema() {
    return {
      modifierName: _joi.default.string().trim(),
      action: _joi.default.string().trim(),
      valueSource: _joi.default.string().trim(),
      staticValue: _joi.default.string().trim().allow(''),
      sayings: _joi.default.array().items(_modifierSaying.default.schema)
    };
  }

}

module.exports = ModifierModel;
//# sourceMappingURL=modifier.model.js.map