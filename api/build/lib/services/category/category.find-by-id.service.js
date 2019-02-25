"use strict";

var _constants = require("../../../util/constants");

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async function ({
  id,
  returnModel = false
}) {
  const redis = this.server.app.redis;

  try {
    const CategoryModel = await redis.factory(_constants.MODEL_CATEGORY, id);
    return returnModel ? CategoryModel : CategoryModel.allProperties();
  } catch (error) {
    throw (0, _redis.default)({
      error,
      message: `Category id=[${id}]`
    });
  }
};
//# sourceMappingURL=category.find-by-id.service.js.map