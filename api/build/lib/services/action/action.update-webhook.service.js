"use strict";

var _constants = require("../../../util/constants");

var _global = _interopRequireDefault(require("../../errors/global.not-found-error"));

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async function ({
  id,
  webhookData,
  returnModel = false
}) {
  const _ref = await this.server.services(),
        globalService = _ref.globalService;

  try {
    const ActionModel = await globalService.findById({
      id,
      model: _constants.MODEL_ACTION,
      returnModel: true
    });
    const ids = await ActionModel.getAll(_constants.MODEL_WEBHOOK, _constants.MODEL_WEBHOOK);
    const WebhookModel = await globalService.findById({
      id: ids[0],
      model: _constants.MODEL_WEBHOOK,
      returnModel: true
    });

    if (WebhookModel.inDb) {
      await WebhookModel.updateInstance({
        data: webhookData
      });
      return returnModel ? WebhookModel : WebhookModel.allProperties();
    }

    return Promise.reject((0, _global.default)({
      model: _constants.MODEL_WEBHOOK
    }));
  } catch (error) {
    throw (0, _redis.default)({
      error
    });
  }
};
//# sourceMappingURL=action.update-webhook.service.js.map