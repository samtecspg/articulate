"use strict";

var _moment = _interopRequireDefault(require("moment"));

var _constants = require("../../../util/constants");

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async function ({
  data,
  agent = null,
  returnModel = false
}) {
  const redis = this.server.app.redis;
  data.status = _constants.STATUS_READY;
  data.lastTraining = (0, _moment.default)(data.lastTraining).utc().format();
  const CategoryModel = await redis.factory(_constants.MODEL_CATEGORY);

  try {
    await CategoryModel.createInstance({
      data
    });

    if (agent) {
      await agent.link(CategoryModel, _constants.MODEL_CATEGORY);
      await agent.save();
    }

    return returnModel ? CategoryModel : CategoryModel.allProperties();
  } catch (error) {
    throw (0, _redis.default)({
      error
    });
  }
};
//# sourceMappingURL=category.create.service.js.map