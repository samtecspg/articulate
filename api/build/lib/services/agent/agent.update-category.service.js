"use strict";

var _constants = require("../../../util/constants");

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async function ({
  id,
  categoryId,
  categoryData,
  returnModel = false
}) {
  const _ref = await this.server.services(),
        globalService = _ref.globalService;

  try {
    const modelPath = [_constants.MODEL_AGENT, _constants.MODEL_CATEGORY];
    const modelPathIds = [id, categoryId]; // Load Used Models

    const models = await globalService.getAllModelsInPath({
      modelPath,
      ids: modelPathIds,
      returnModel: true
    });
    const AgentModel = models[_constants.MODEL_AGENT];
    const CategoryModel = models[_constants.MODEL_CATEGORY];

    if (categoryData.categoryName !== undefined && CategoryModel.property('categoryName') !== categoryData.categoryName && categoryData.actionThreshold !== undefined && CategoryModel.property('actionThreshold') !== categoryData.actionThreshold) {
      categoryData.status = _constants.STATUS_OUT_OF_DATE;
      AgentModel.property('status', _constants.STATUS_OUT_OF_DATE);
    }

    await AgentModel.saveInstance();
    await CategoryModel.updateInstance({
      data: categoryData
    });
    return returnModel ? CategoryModel : CategoryModel.allProperties();
  } catch (error) {
    throw (0, _redis.default)({
      error
    });
  }
};
//# sourceMappingURL=agent.update-category.service.js.map