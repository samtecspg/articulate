"use strict";

var _constants = require("../../../util/constants");

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async function ({
  id,
  name
}) {
  const _ref = await this.server.services(),
        globalService = _ref.globalService;

  try {
    const agent = await globalService.findById({
      id,
      model: _constants.MODEL_AGENT
    });
    return await agent.settings[name];
  } catch (error) {
    throw (0, _redis.default)({
      error
    });
  }
};
//# sourceMappingURL=agent.find-setting-by-name.service.js.map