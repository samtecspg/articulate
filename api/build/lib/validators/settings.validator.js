"use strict";

var _joi = _interopRequireDefault(require("joi"));

var _constants = require("../../util/constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const SettingsModel = require('../models/settings.model').schema;

class SettingsValidate {
  constructor() {
    this.create = {
      payload: (() => {
        return {
          [_constants.PARAM_NAME]: SettingsModel.name.required().description('Name'),
          [_constants.PARAM_VALUE]: SettingsModel.value.required().description('Value')
        };
      })()
    };
    this.findByName = {
      params: (() => {
        return {
          [_constants.PARAM_NAME]: SettingsModel.name.required().allow(_constants.CONFIG_SETTINGS_ALL).description('Name')
        };
      })()
    };
    this.updateByName = {
      params: (() => {
        return {
          [_constants.PARAM_NAME]: SettingsModel.name.required().allow(_constants.CONFIG_SETTINGS_ALL)
        };
      })(),
      payload: (() => {
        return SettingsModel.value.required();
      })()
    };
    this.updateAll = {
      payload: (() => {
        const keys = {};

        _constants.CONFIG_SETTINGS_ALL.forEach(key => {
          keys[key] = SettingsModel.value.optional();
        });

        return _joi.default.object().keys(keys);
      })()
    };
  }

}

const actionValidate = new SettingsValidate();
module.exports = actionValidate;
//# sourceMappingURL=settings.validator.js.map