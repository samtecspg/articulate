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
    const FrameModel = await redis.factory(_constants.MODEL_FRAME, id);
    await FrameModel.updateInstance({
      data
    });
    return returnModel ? FrameModel : FrameModel.allProperties();
  } catch (error) {
    throw (0, _redis.default)({
      error
    });
  }
};
//# sourceMappingURL=frame.update.service.js.map