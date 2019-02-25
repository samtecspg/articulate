"use strict";

var _constants = require("../../../util/constants");

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async function ({
  asArray = false
} = {}) {
  const redis = this.server.app.redis;
  const Model = await redis.factory(_constants.MODEL_SETTINGS);

  try {
    const settingsArray = await Model.findAll();

    if (asArray) {
      return settingsArray;
    }

    const settings = {};
    settingsArray.forEach(setting => {
      const _setting$allPropertie = setting.allProperties(),
            name = _setting$allPropertie.name,
            value = _setting$allPropertie.value;

      settings[name] = value;
    });
    return settings;
  } catch (error) {
    throw (0, _redis.default)({
      error
    });
  }
};
//# sourceMappingURL=settings.find-all.service.js.map