"use strict";

var _constants = require("../../../util/constants");

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

module.exports = async function ({
  id,
  settingsData,
  AgentModel = null,
  returnModel = false
}) {
  const _ref = await this.server.services(),
        globalService = _ref.globalService;

  try {
    AgentModel = AgentModel || (await globalService.findById({
      id,
      model: _constants.MODEL_AGENT,
      returnModel: true
    })); //Keep settings that are not in the new object

    const oldSettings = AgentModel.property('settings');

    const newSettings = _objectSpread({}, oldSettings, settingsData);

    const trainingSettingsChanged = _constants.CONFIG_SETTINGS_RASA_TRAINING.some(setting => {
      return !_lodash.default.isEqual(oldSettings[setting], newSettings[setting]);
    });

    if (trainingSettingsChanged) {
      await AgentModel.property('status', _constants.STATUS_OUT_OF_DATE);
    }

    await AgentModel.property('settings', newSettings);
    await AgentModel.saveInstance();
    return returnModel ? AgentModel : AgentModel.allProperties();
  } catch (error) {
    throw (0, _redis.default)({
      error
    });
  }
};
//# sourceMappingURL=agent.update-all-settings.service.js.map