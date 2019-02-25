"use strict";

var _lodash = _interopRequireDefault(require("lodash"));

var _constants = require("../../../util/constants");

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//const logger = require('../../../server/util/logger')({ name: `service:category:unlink-keywords` });
module.exports = async function ({
  model,
  keywordModels = []
}) {
  if (keywordModels.length === 0) {
    return;
  }

  const _ref = await this.server.services(),
        globalService = _ref.globalService;

  try {
    const linkPromises = keywordModels.map(async KeywordModel => {
      const keywordSayingIds = await KeywordModel.getAll(_constants.MODEL_SAYING, _constants.MODEL_SAYING);
      const KeywordSayingModels = await globalService.loadAllByIds({
        ids: keywordSayingIds,
        model: _constants.MODEL_SAYING
      });
      const belongsToPromises = KeywordSayingModels.map(async SayingModel => {
        return await model.belongsTo(SayingModel, _constants.MODEL_SAYING);
      });
      const sayingBelongsTo = await Promise.all(belongsToPromises); // The sayings related to this keyword are not used in the same category

      if (sayingBelongsTo.length === 0 || _lodash.default.findIndex(sayingBelongsTo) === 0) {
        await KeywordModel.unlink(model, _constants.MODEL_CATEGORY);
        await model.unlink(KeywordModel, _constants.MODEL_KEYWORD);
        return await KeywordModel.save();
      }
    });
    await Promise.all(linkPromises);
    await model.save();
  } catch (error) {
    throw (0, _redis.default)({
      error
    });
  }
};
//# sourceMappingURL=category.unlink-keywords.service.js.map