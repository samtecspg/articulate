"use strict";

var _constants = require("../../../util/constants");

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async function ({
  id,
  actionId
}) {
  const _ref = await this.server.services(),
        globalService = _ref.globalService,
        actionService = _ref.actionService;

  try {
    const modelPath = [{
      model: _constants.MODEL_AGENT,
      id
    }, {
      model: _constants.MODEL_ACTION,
      id: actionId
    }]; // Validate action belongs to agent

    await globalService.findInModelPath({
      modelPath,
      returnModel: true
    });
    return await actionService.remove({
      id: actionId
    });
  } catch (error) {
    throw (0, _redis.default)({
      error
    });
  }
};
//# sourceMappingURL=agent.remove-action.service.js.map