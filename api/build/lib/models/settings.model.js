"use strict";

var _joi = _interopRequireDefault(require("joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class SettingsModel {
  static get schema() {
    return {
      id: _joi.default.number(),
      name: _joi.default.string().trim().description('Setting Name'),
      value: _joi.default.alternatives().try(_joi.default.array(), _joi.default.string(), _joi.default.object(), _joi.default.number()).description('Setting Value (string|object|array)')
    };
  }

}

module.exports = SettingsModel;
//# sourceMappingURL=settings.model.js.map