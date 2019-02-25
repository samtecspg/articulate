"use strict";

var _constants = require("../../../util/constants");

var _global = _interopRequireDefault(require("../../errors/global.not-found-error"));

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async function ({
  sessionId,
  frameId,
  returnModel = false
}) {
  const redis = this.server.app.redis;

  const _ref = await this.server.services(),
        globalService = _ref.globalService;

  try {
    const Session = await redis.factory(_constants.MODEL_CONTEXT);
    await Session.findBySessionId({
      sessionId
    });
    const Frame = await globalService.findById({
      id: frameId,
      model: _constants.MODEL_FRAME,
      returnModel: true
    });

    if (Session.inDb) {
      if (Frame.inDb) {
        const belongs = await Session.belongsTo(Frame, _constants.MODEL_FRAME);

        if (belongs) {
          return returnModel ? Frame : Frame.allProperties();
        }
      } else {
        return Promise.reject((0, _global.default)({
          model: _constants.MODEL_FRAME,
          id: frameId
        }));
      }
    } else {
      return Promise.reject((0, _global.default)({
        model: _constants.MODEL_CONTEXT,
        id: sessionId
      }));
    }
  } catch (error) {
    throw (0, _redis.default)({
      error
    });
  }
};
//# sourceMappingURL=context.find-frame-by-session-and-frame.service.js.map