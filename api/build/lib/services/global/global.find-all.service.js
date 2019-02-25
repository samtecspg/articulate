"use strict";

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async function ({
  skip,
  limit,
  direction,
  field,
  model,
  filter,
  returnModel = false
}) {
  const redis = this.server.app.redis;
  const Model = await redis.factory(model);

  try {
    const allResultsModels = await Model.findAll({
      skip,
      limit,
      direction,
      field,
      filter
    });

    if (returnModel) {
      return allResultsModels;
    }

    const totalCount = await Model.count();
    const data = allResultsModels.map(resultModel => resultModel.allProperties());
    return {
      data,
      totalCount
    };
  } catch (error) {
    throw (0, _redis.default)({
      error
    });
  }
};
//# sourceMappingURL=global.find-all.service.js.map