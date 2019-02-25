"use strict";

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async function ({
  parentModel,
  model,
  relationName = model,
  returnModel = false
}) {
  const redis = this.server.app.redis;

  try {
    const ids = await parentModel.getAll(model, relationName);
    const Model = await redis.factory(model, ids[0]);
    return returnModel ? Model : Model.allProperties();
  } catch (error) {
    throw (0, _redis.default)({
      error,
      message: `${model} error loading linked models`
    });
  }
};
//# sourceMappingURL=global.load-first-linked.service.js.map