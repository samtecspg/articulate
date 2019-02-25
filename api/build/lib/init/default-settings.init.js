"use strict";

var _lodash = _interopRequireDefault(require("lodash"));

var _defaultSettings = _interopRequireDefault(require("../../util/default-settings"));

var _constants = require("../../util/constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async server => {
  const redis = server.app.redis;

  const _ref = await server.services(),
        settingsService = _ref.settingsService,
        contextService = _ref.contextService;

  const CurrentSettings = await settingsService.findAll();
  await Promise.all(_lodash.default.map(_defaultSettings.default, async (value, name) => {
    if (CurrentSettings[name]) {
      return;
    }

    return await settingsService.create({
      data: {
        name,
        value
      }
    });
  }));
  const Model = await redis.factory(_constants.MODEL_CONTEXT);
  const sessionId = _defaultSettings.default.defaultUISessionId;
  await Model.findBySessionId({
    sessionId
  });

  if (!Model.inDb) {
    await contextService.create({
      data: {
        sessionId
      }
    });
  }
};
//# sourceMappingURL=default-settings.init.js.map