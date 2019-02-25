"use strict";

var _constants = require("../../../util/constants");

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async function ({
  id,
  actionId,
  data,
  returnModel = false
}) {
  const _ref = await this.server.services(),
        globalService = _ref.globalService,
        webhookService = _ref.webhookService;

  try {
    const modelPath = [{
      model: _constants.MODEL_AGENT,
      id
    }, {
      model: _constants.MODEL_ACTION,
      id: actionId
    }];
    let actionModel = await globalService.findInModelPath({
      modelPath,
      returnModel: true
    });
    actionModel = actionModel.data;
    const children = await actionModel.getAll(_constants.MODEL_WEBHOOK, _constants.MODEL_WEBHOOK);

    if (children.length > 0) {
      // Update
      return await webhookService.update({
        id: children[0],
        data,
        returnModel
      });
    } // Create


    return await webhookService.create({
      data,
      parent: actionModel,
      returnModel
    });
  } catch (error) {
    throw (0, _redis.default)({
      error
    });
  }
};
//# sourceMappingURL=agent.upsert-webhook-in-action.service.js.map