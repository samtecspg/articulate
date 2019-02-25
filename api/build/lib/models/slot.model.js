"use strict";

var _joi = _interopRequireDefault(require("joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const KeywordSchema = require('./keyword.model').schema;

class SlotModel {
  static get schema() {
    return {
      slotName: _joi.default.string().trim(),
      uiColor: _joi.default.string().trim(),
      keyword: _joi.default.string().trim(),
      keywordId: KeywordSchema.id,
      isList: _joi.default.boolean(),
      isRequired: _joi.default.boolean(),
      textPrompts: _joi.default.array().items(_joi.default.string().trim()),
      remainingLife: _joi.default.number().allow(null)
    };
  }

}

module.exports = SlotModel;
//# sourceMappingURL=slot.model.js.map