"use strict";

var _constants = require("../../../util/constants");

var _global = _interopRequireDefault(require("../../errors/global.default-error"));

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async function ({
  data,
  context = null,
  returnModel = false
}) {
  const redis = this.server.app.redis;
  const FrameModel = await redis.factory(_constants.MODEL_FRAME);

  if (context === null) {
    return Promise.reject((0, _global.default)({
      message: `Context can't be null for a frame`
    }));
  }

  try {
    await FrameModel.createInstance({
      data
    });
    await context.link(FrameModel, _constants.MODEL_FRAME);
    await context.saveInstance();
    return returnModel ? FrameModel : FrameModel.allProperties();
  } catch (error) {
    throw (0, _redis.default)({
      error
    });
  }
};
//# sourceMappingURL=frame.create.service.js.map