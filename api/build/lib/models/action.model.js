"use strict";

var _joi = _interopRequireDefault(require("joi"));

var _slot = _interopRequireDefault(require("./slot.model"));

var _actionResponse = _interopRequireDefault(require("./action.response.model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ActionModel {
  static get schema() {
    return {
      id: _joi.default.number(),
      actionName: _joi.default.string().trim(),
      slots: _joi.default.array().items(_slot.default.schema),
      responses: _joi.default.array().items(_actionResponse.default.schema),
      useWebhook: _joi.default.boolean(),
      usePostFormat: _joi.default.boolean(),
      creationDate: _joi.default.string(),
      modificationDate: _joi.default.date()
    };
  }

}

module.exports = ActionModel;
//# sourceMappingURL=action.model.js.map