"use strict";

var _constants = require("../../../util/constants");

var _global = _interopRequireDefault(require("../../errors/global.not-found-error"));

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async function ({
  id,
  data,
  returnModel = false
}) {
  const redis = this.server.app.redis;

  try {
    const AgentModel = await redis.factory(_constants.MODEL_AGENT, id);

    if (!AgentModel.isLoaded) {
      return Promise.reject((0, _global.default)({
        id,
        model: _constants.MODEL_AGENT
      }));
    }

    const requiresRetrain = data.extraTrainingData !== undefined && data.extraTrainingData !== AgentModel.property('extraTrainingData') || data.enableModelsPerCategory !== undefined && data.enableModelsPerCategory !== AgentModel.property('enableModelsPerCategory') || data.agentName !== undefined && data.agentName !== AgentModel.property('agentName');
    data.status = requiresRetrain ? _constants.STATUS_OUT_OF_DATE : data.status; // TODO: Publish Agent update

    await AgentModel.updateInstance({
      data
    });
    return returnModel ? AgentModel : AgentModel.allProperties();
  } catch (error) {
    throw (0, _redis.default)({
      error
    });
  }
};
//# sourceMappingURL=agent.update-by-id.service.js.map