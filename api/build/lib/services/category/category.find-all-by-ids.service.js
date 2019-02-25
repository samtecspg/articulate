"use strict";

var _constants = require("../../../util/constants");

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async function ({
  ids
}) {
  const redis = this.server.app.redis;

  try {
    const CategoryModel = await redis.factory(_constants.MODEL_CATEGORY);
    return await CategoryModel.findAllByIds({
      ids
    });
  } catch (error) {
    throw (0, _redis.default)({
      error
    });
  }
};
//# sourceMappingURL=category.find-all-by-ids.service.js.map