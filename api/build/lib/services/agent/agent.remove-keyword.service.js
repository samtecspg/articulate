"use strict";

var _constants = require("../../../util/constants");

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async function ({
  id,
  keywordId
}) {
  const _ref = await this.server.services(),
        globalService = _ref.globalService,
        keywordService = _ref.keywordService;

  try {
    const modelPath = [_constants.MODEL_AGENT, _constants.MODEL_KEYWORD];
    const modelPathIds = [id, keywordId];
    const models = await globalService.getAllModelsInPath({
      modelPath,
      ids: modelPathIds,
      returnModel: true
    });
    const KeywordModel = models[_constants.MODEL_KEYWORD];
    return await keywordService.remove({
      KeywordModel
    });
  } catch (error) {
    throw (0, _redis.default)({
      error
    });
  }
};
//# sourceMappingURL=agent.remove-keyword.service.js.map