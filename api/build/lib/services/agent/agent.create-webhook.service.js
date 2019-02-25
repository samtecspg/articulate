"use strict";

var _constants = require("../../../util/constants");

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

var _redis2 = _interopRequireDefault(require("../../errors/redis.only-one-linked-error"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async function ({
  id,
  AgentModel = null,
  webhookData,
  returnModel = false
}) {
  const _ref = await this.server.services(),
        globalService = _ref.globalService,
        webhookService = _ref.webhookService;

  try {
    AgentModel = AgentModel || (await globalService.findById({
      id,
      model: _constants.MODEL_AGENT,
      returnModel: true
    }));
    const children = await AgentModel.getAll(_constants.MODEL_WEBHOOK, _constants.MODEL_WEBHOOK);

    if (children.length > 0) {
      return Promise.reject((0, _redis2.default)({
        mainType: _constants.MODEL_AGENT,
        mainId: id,
        subType: _constants.MODEL_WEBHOOK
      }));
    }

    return await webhookService.create({
      data: webhookData,
      parent: AgentModel,
      returnModel
    });
  } catch (error) {
    throw (0, _redis.default)({
      error
    });
  }
};
//# sourceMappingURL=agent.create-webhook.service.js.map