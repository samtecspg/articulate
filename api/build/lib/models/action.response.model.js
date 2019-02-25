"use strict";

var _joi = _interopRequireDefault(require("joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ActionResponseModel {
  static get schema() {
    return {
      textResponse: _joi.default.string().trim(),
      actions: _joi.default.array().items(_joi.default.string().trim())
    };
  }

}

module.exports = ActionResponseModel;
//# sourceMappingURL=action.response.model.js.map