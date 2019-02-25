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

  try {
    const Model = await redis.factory(_constants.MODEL_WEBHOOK, id);
    await Model.updateInstance({
      data
    });
    return returnModel ? Model : Model.allProperties();
  } catch (error) {
    throw (0, _redis.default)({
      error
    });
  }
};
//# sourceMappingURL=webhook.update.service.js.map