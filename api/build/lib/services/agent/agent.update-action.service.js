"use strict";

var _constants = require("../../../util/constants");

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
        actionService = _ref.actionService;

  try {
    AgentModel = AgentModel || (await globalService.findById({
      id,
      model: _constants.MODEL_AGENT,
      returnModel: true
    }));
    return await actionService.upsert({
      data: actionData,
      actionId,
      AgentModel,
      returnModel
    });
  } catch (error) {
    throw (0, _redis.default)({
      error
    });
  }
};
//# sourceMappingURL=agent.update-action.service.js.map