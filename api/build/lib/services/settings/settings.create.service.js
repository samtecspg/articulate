"use strict";

var _constants = require("../../../util/constants");

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async function ({
  data,
  returnModel = false
}) {
  const redis = this.server.app.redis;
  const SettingsModel = await redis.factory(_constants.MODEL_SETTINGS);

  try {
    await SettingsModel.createInstance({
      data
    });
    return returnModel ? SettingsModel : SettingsModel.allProperties();
  } catch (error) {
    throw (0, _redis.default)({
      error
    });
  }
};
//# sourceMappingURL=settings.create.service.js.map