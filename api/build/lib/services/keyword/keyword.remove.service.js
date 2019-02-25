"use strict";

var _constants = require("../../../util/constants");

var _global = _interopRequireDefault(require("../../errors/global.default-error"));

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async function ({
  id,
  KeywordModel
}) {
  const redis = this.server.app.redis;

  const _ref = await this.server.services(),
        globalService = _ref.globalService;

  try {
    KeywordModel = KeywordModel || (await redis.factory(_constants.MODEL_KEYWORD, id)); //const keywordCategoryIds = await KeywordModel.getAll(MODEL_CATEGORY, MODEL_CATEGORY);

    const categories = await globalService.loadAllLinked({
      parentModel: KeywordModel,
      model: _constants.MODEL_CATEGORY
    });

    if (categories.length > 0) {
      const keywordName = await KeywordModel.allProperties().keywordName;
      const categoriesNames = categories.map(category => {
        return category.categoryName;
      });
      return Promise.reject((0, _global.default)({
        statusCode: 400,
        message: `Keyword '${keywordName}' is been used by the following category(s): ${categoriesNames.join(', ')}`
      }));
    } // TODO: Find any Action.slots or Saying.keywords that contains this ID?


    return KeywordModel.removeInstance();
  } catch (error) {
    throw (0, _redis.default)({
      error,
      message: `${_constants.MODEL_KEYWORD} id=[${id}]`
    });
  }
};
//# sourceMappingURL=keyword.remove.service.js.map