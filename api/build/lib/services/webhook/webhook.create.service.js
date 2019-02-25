"use strict";

var _constants = require("../../../util/constants");

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async function ({
  data,
  parent = null,
  returnModel = false
}) {
  const redis = this.server.app.redis;
  const model = await redis.factory(_constants.MODEL_WEBHOOK);

  try {
    await model.createInstance({
      data
    });
    await parent.link(model, _constants.MODEL_WEBHOOK);
    await parent.save();
    return returnModel ? model : model.allProperties();
  } catch (error) {
    throw (0, _redis.default)({
      error
    });
  }
};
//# sourceMappingURL=webhook.create.service.js.map