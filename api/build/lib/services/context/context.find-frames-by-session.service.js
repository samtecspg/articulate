"use strict";

var _constants = require("../../../util/constants");

var _global = _interopRequireDefault(require("../../errors/global.not-found-error"));

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async function ({
  sessionId,
  returnModel = false,
  skip,
  limit,
  direction,
  field
}) {
  const redis = this.server.app.redis;
  const Model = await redis.factory(_constants.MODEL_CONTEXT);

  const _ref = await this.server.services(),
        globalService = _ref.globalService;

  try {
    await Model.findBySessionId({
      sessionId
    });
    const FrameModel = await redis.factory(_constants.MODEL_FRAME);

    if (Model.inDb) {
      //Only load frames if we are NOT returning the model, or else we can't create and object with a frames list.
      if (!returnModel) {
        // const frames = await globalService.loadAllLinked({ parentModel: Model, model: MODEL_FRAME, returnModel });
        const frameIds = await Model.getAll(_constants.MODEL_FRAME, _constants.MODEL_FRAME);
        const FrameModels = await FrameModel.findAllByIds({
          ids: frameIds,
          skip,
          limit,
          direction,
          field
        });
        const frames = await Promise.all(FrameModels.map(async frameModel => {
          const saying = await frameModel.allProperties();
          return saying;
        }));
        return frames;
      }

      return returnModel ? Model : Model.allProperties();
    }

    return Promise.reject((0, _global.default)({
      model: _constants.MODEL_CONTEXT,
      id: sessionId
    }));
  } catch (error) {
    throw (0, _redis.default)({
      error
    });
  }
};
//# sourceMappingURL=context.find-frames-by-session.service.js.map