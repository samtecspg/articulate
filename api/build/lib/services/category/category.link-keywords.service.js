"use strict";

var _constants = require("../../../util/constants");

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = require('../../../util/logger')({
  name: `service:category:link-keywords`
});

module.exports = async function ({
  model,
  keywordModels = []
}) {
  logger.debug(keywordModels.length);

  if (keywordModels.length === 0) {
    return;
  }

  try {
    const linkPromises = keywordModels.map(async KeywordModel => {
      await KeywordModel.link(model, _constants.MODEL_CATEGORY);
      await model.link(KeywordModel, _constants.MODEL_KEYWORD);
      return await KeywordModel.save();
    });
    await Promise.all(linkPromises);
    await model.save();
    logger.debug('complete');
  } catch (error) {
    throw (0, _redis.default)({
      error
    });
  }
};
//# sourceMappingURL=category.link-keywords.service.js.map