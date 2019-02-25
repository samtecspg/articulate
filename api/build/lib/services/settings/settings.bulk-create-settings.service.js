"use strict";

var _lodash = _interopRequireDefault(require("lodash"));

var _constants = require("../../../util/constants");

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async function ({
  settingsData
}) {
  const redis = this.server.app.redis;

  const _ref = await this.server.services(),
        settingsService = _ref.settingsService;

  try {
    await Promise.all(_lodash.default.map(settingsData, async (value, name) => {
      const Model = await redis.factory(_constants.MODEL_SETTINGS);
      await Model.createInstance({
        data: {
          name,
          value
        }
      });
    }));
    return await settingsService.findAll();
  } catch (error) {
    throw (0, _redis.default)({
      error
    });
  }
};
//# sourceMappingURL=settings.bulk-create-settings.service.js.map