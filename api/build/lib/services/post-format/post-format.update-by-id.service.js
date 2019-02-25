"use strict";

var _constants = require("../../../util/constants");

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async function ({
  id,
  data,
  returnModel = false
}) {
  const redis = this.server.app.redis;
  const Model = await redis.factory(_constants.MODEL_POST_FORMAT);

  try {
    await Model.updateInstance({
      id,
      data
    });
    return returnModel ? Model : Model.allProperties();
  } catch (error) {
    throw (0, _redis.default)({
      error
    });
  }
};
//# sourceMappingURL=post-format.update-by-id.service.js.map