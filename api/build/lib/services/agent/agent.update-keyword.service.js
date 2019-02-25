"use strict";

var _lodash = _interopRequireDefault(require("lodash"));

var _constants = require("../../../util/constants");

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async function ({
  id,
  keywordId,
  keywordData,
  returnModel = false
}) {
  const _ref = await this.server.services(),
        globalService = _ref.globalService;

  try {
    const modelPath = [_constants.MODEL_AGENT, _constants.MODEL_KEYWORD];
    const modelPathIds = [id, keywordId]; // Load Used Models

    const models = await globalService.getAllModelsInPath({
      modelPath,
      ids: modelPathIds,
      returnModel: true
    });
    const AgentModel = models[_constants.MODEL_AGENT];
    const KeywordModel = models[_constants.MODEL_KEYWORD];
    await KeywordModel.updateInstance({
      data: keywordData
    }); // Update Agent and related categories status
    // TODO: Publish Agent update

    AgentModel.property('status', _constants.STATUS_OUT_OF_DATE);
    await AgentModel.saveInstance();
    const keywordCategoryIds = await KeywordModel.getAll(_constants.MODEL_CATEGORY, _constants.MODEL_CATEGORY);
    const KeywordCategoryModels = await globalService.loadAllByIds({
      ids: keywordCategoryIds,
      //Only load the keywords we are going to use
      model: _constants.MODEL_CATEGORY,
      returnModel: true
    });
    const categoryStatusUpdatePromise = KeywordCategoryModels.map(async CategoryModel => {
      CategoryModel.property('status', _constants.STATUS_OUT_OF_DATE);
      return await CategoryModel.saveInstance();
    });
    await Promise.all(categoryStatusUpdatePromise);
    return returnModel ? KeywordModel : KeywordModel.allProperties();
  } catch (error) {
    throw (0, _redis.default)({
      error
    });
  }
};
//# sourceMappingURL=agent.update-keyword.service.js.map