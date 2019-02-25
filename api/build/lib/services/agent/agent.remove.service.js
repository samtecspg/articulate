"use strict";

var _constants = require("../../../util/constants");

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async function ({
  id
}) {
  const redis = this.server.app.redis;
  const Agent = await redis.factory(_constants.MODEL_AGENT);

  try {
    //TODO: Delete Categories
    //TODO: Delete Keyword
    //TODO: Delete agentCategoryRecognizer
    await Agent.findById({
      id
    });
    return Agent.removeInstance({
      id
    });
  } catch (error) {
    throw (0, _redis.default)({
      error,
      message: `Agent id=[${id}]`
    });
  }
};
//# sourceMappingURL=agent.remove.service.js.map