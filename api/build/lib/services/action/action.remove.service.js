"use strict";

var _constants = require("../../../util/constants");

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

var _global = _interopRequireDefault(require("../../errors/global.default-error"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async function ({
  id
}) {
  const redis = this.server.app.redis;

  const _ref = await this.server.services(),
        postFormatService = _ref.postFormatService,
        webhookService = _ref.webhookService;

  const ActionModel = await redis.factory(_constants.MODEL_ACTION);

  try {
    await ActionModel.findById({
      id
    });
    const actionSayingIds = await ActionModel.getAll(_constants.MODEL_SAYING, _constants.MODEL_SAYING);

    if (actionSayingIds.length > 0) {
      const actionName = await ActionModel.allProperties().actionName;
      return Promise.reject((0, _global.default)({
        statusCode: 400,
        message: `Action '${actionName}' is been used by ${actionSayingIds.length} sayings`
      }));
    }

    const postFormatIds = await ActionModel.getAll(_constants.MODEL_POST_FORMAT, _constants.MODEL_POST_FORMAT);
    const webhookIds = await ActionModel.getAll(_constants.MODEL_WEBHOOK, _constants.MODEL_WEBHOOK);
    const removePostFormatPromises = postFormatIds.map(async postFormatId => {
      return await postFormatService.remove({
        id: postFormatId
      });
    });
    await Promise.all(removePostFormatPromises);
    const removeWebhookPromises = webhookIds.map(async webhookId => {
      return await webhookService.remove({
        id: webhookId
      });
    });
    await Promise.all(removeWebhookPromises);
    return ActionModel.removeInstance({
      id
    });
  } catch (error) {
    throw (0, _redis.default)({
      error,
      message: `${_constants.MODEL_ACTION} id=[${id}]`
    });
  }
};
//# sourceMappingURL=action.remove.service.js.map