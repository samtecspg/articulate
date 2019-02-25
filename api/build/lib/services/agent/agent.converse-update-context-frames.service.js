"use strict";

var _lodash = _interopRequireDefault(require("lodash"));

var _constants = require("../../../util/constants");

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

module.exports = async function ({
  id,
  frames
}) {
  const redis = this.server.app.redis;

  const _ref = await this.server.services(),
        frameService = _ref.frameService;

  try {
    const ContextModel = await redis.factory(_constants.MODEL_CONTEXT, id);

    const framesToUpdate = _lodash.default.filter(frames, frame => {
      return !_lodash.default.isNil(frame.id);
    });

    const framesToCreate = _lodash.default.without(frames, ...framesToUpdate);

    await Promise.all(framesToUpdate.map(async frame => {
      const frameId = frame.id,
            data = _objectWithoutProperties(frame, ["id"]);

      return await frameService.update({
        id: frameId,
        data
      });
    }));
    await Promise.all(framesToCreate.map(async data => {
      return await frameService.create({
        data,
        context: ContextModel
      });
    }));
  } catch (error) {
    throw (0, _redis.default)({
      error
    });
  }
};
//# sourceMappingURL=agent.converse-update-context-frames.service.js.map