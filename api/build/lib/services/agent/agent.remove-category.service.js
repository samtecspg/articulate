"use strict";

var _constants = require("../../../util/constants");

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async function ({
  id,
  categoryId
}) {
  const _ref = await this.server.services(),
        globalService = _ref.globalService,
        categoryService = _ref.categoryService;

  try {
    const modelPath = [_constants.MODEL_AGENT, _constants.MODEL_CATEGORY];
    const modelPathIds = [id, categoryId];
    const models = await globalService.getAllModelsInPath({
      modelPath,
      ids: modelPathIds,
      returnModel: true
    });
    const AgentModel = models[_constants.MODEL_AGENT];
    const CategoryModel = models[_constants.MODEL_CATEGORY];
    return await categoryService.remove({
      CategoryModel,
      AgentModel
    });
  } catch (error) {
    throw (0, _redis.default)({
      error
    });
  }
};
//# sourceMappingURL=agent.remove-category.service.js.map