"use strict";

var _joi = _interopRequireDefault(require("joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ScenarioModel {
  static get schema() {
    return {
      id: _joi.default.number(),
      sessionId: _joi.default.string().description('Session').trim(),
      savedSlots: _joi.default.object(),
      actionQueue: _joi.default.array(),
      responseQueue: _joi.default.array(),
      creationDate: _joi.default.string(),
      modificationDate: _joi.default.string()
    };
  }

}

module.exports = ScenarioModel;
//# sourceMappingURL=context.model.js.map