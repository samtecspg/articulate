"use strict";

var _constants = require("../../../util/constants");

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async function ({
  id
}) {
  const redis = this.server.app.redis;

  try {
    const Model = await redis.factory(_constants.MODEL_WEBHOOK, id);
    return await Model.removeInstance();
  } catch (error) {
    throw (0, _redis.default)({
      error
    });
  }
};
//# sourceMappingURL=webhook.remove.service.js.map