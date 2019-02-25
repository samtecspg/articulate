"use strict";

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async function ({
  ids,
  model,
  returnModel = false
}) {
  const redis = this.server.app.redis;

  try {
    const Model = await redis.factory(model);
    const results = await Model.loadAllByIds({
      ids
    });

    if (returnModel) {
      return results;
    }

    return results.map(resultModel => resultModel.allProperties());
  } catch (error) {
    throw (0, _redis.default)({
      error,
      message: `${model} ids=[${ids.join(',')}]`
    });
  }
};
//# sourceMappingURL=global.load-all-by-ids.service.js.map