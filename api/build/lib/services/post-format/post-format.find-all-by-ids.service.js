"use strict";

var _constants = require("../../../util/constants");

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async function ({
  ids
}) {
  const redis = this.server.app.redis;

  try {
    const Model = await redis.factory(_constants.MODEL_POST_FORMAT);
    return await Model.findAllByIds({
      ids
    });
  } catch (error) {
    throw (0, _redis.default)({
      error
    });
  }
};
//# sourceMappingURL=post-format.find-all-by-ids.service.js.map