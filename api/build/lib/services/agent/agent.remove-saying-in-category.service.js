"use strict";

var _constants = require("../../../util/constants");

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async function ({
  id,
  categoryId,
  sayingId
}) {
  const _ref = await this.server.services(),
        globalService = _ref.globalService,
        sayingService = _ref.sayingService;

  try {
    const modelPath = [_constants.MODEL_AGENT, _constants.MODEL_CATEGORY, _constants.MODEL_SAYING];
    const modelPathIds = [id, categoryId, sayingId];
    const models = await globalService.getAllModelsInPath({
      modelPath,
      ids: modelPathIds,
      returnModel: true
    });
    const AgentModel = models[_constants.MODEL_AGENT];
    const CategoryModel = models[_constants.MODEL_CATEGORY];
    const SayingModel = models[_constants.MODEL_SAYING];
    return await sayingService.remove({
      SayingModel,
      AgentModel,
      CategoryModel
    });
  } catch (error) {
    throw (0, _redis.default)({
      error,
      message: `Agent id=[${id}] error removing Saying id=[${sayingId}]`
    });
  }
};
//# sourceMappingURL=agent.remove-saying-in-category.service.js.map