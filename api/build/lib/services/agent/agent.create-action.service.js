"use strict";

var _constants = require("../../../util/constants");

var _global = _interopRequireDefault(require("../../errors/global.default-error"));

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async function ({
  id,
  AgentModel = null,
  actionId,
  actionData,
  returnModel = false
}) {
  const _ref = await this.server.services(),
        globalService = _ref.globalService,
        actionService = _ref.actionService,
        agentService = _ref.agentService;

  try {
    AgentModel = AgentModel || (await globalService.findById({
      id,
      model: _constants.MODEL_AGENT,
      returnModel: true
    }));
    const isUnique = await agentService.isModelUnique({
      AgentModel,
      model: _constants.MODEL_ACTION,
      field: 'actionName',
      value: actionData.actionName
    });

    if (isUnique) {
      return await actionService.upsert({
        data: actionData,
        actionId,
        AgentModel,
        returnModel
      });
    }

    return Promise.reject((0, _global.default)({
      message: `The ${_constants.MODEL_AGENT} already has a ${_constants.MODEL_ACTION} with the name= "${actionData.actionName}".`
    }));
  } catch (error) {
    throw (0, _redis.default)({
      error
    });
  }
};
//# sourceMappingURL=agent.create-action.service.js.map