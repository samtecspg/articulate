"use strict";

var _constants = require("../../../util/constants");

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

var _global = _interopRequireDefault(require("../../errors/global.default-error"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async function ({
  id,
  CategoryModel,
  AgentModel
}) {
  const redis = this.server.app.redis;

  try {
    CategoryModel = CategoryModel || (await redis.factory(_constants.MODEL_CATEGORY, id));
    const categorySayingIds = await CategoryModel.getAll(_constants.MODEL_SAYING, _constants.MODEL_SAYING);

    if (categorySayingIds.length > 0) {
      const categoryName = await CategoryModel.allProperties().categoryName;
      return Promise.reject((0, _global.default)({
        statusCode: 400,
        message: `Category '${categoryName}' is been used by ${categorySayingIds.length} sayings`
      }));
    }

    AgentModel.property('status', _constants.STATUS_OUT_OF_DATE);
    await AgentModel.saveInstance();
    return CategoryModel.removeInstance();
  } catch (error) {
    throw (0, _redis.default)({
      error,
      message: `Category id=[${id}]`
    });
  }
};
//# sourceMappingURL=category.remove.service.js.map