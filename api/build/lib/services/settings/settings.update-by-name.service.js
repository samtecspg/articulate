"use strict";

var _constants = require("../../../util/constants");

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async function ({
  name,
  value,
  returnModel = false
}) {
  const redis = this.server.app.redis;
  const Model = await redis.factory(_constants.MODEL_SETTINGS);

  try {
    await Model.findByName({
      name
    });
    await Model.updateInstance({
      data: {
        value
      }
    });
    return returnModel ? Model : Model.allProperties();
  } catch (error) {
    throw (0, _redis.default)({
      error
    });
  }
};
//# sourceMappingURL=settings.update-by-name.service.js.map