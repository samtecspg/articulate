"use strict";

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async function ({
  field,
  value,
  model
}) {
  const redis = this.server.app.redis;

  try {
    const Model = await redis.factory(model);
    return await Model.searchByField({
      field,
      value
    });
  } catch (error) {
    throw (0, _redis.default)({
      error,
      message: `${model} ${field}=[${value}]`
    });
  }
};
//# sourceMappingURL=global.search-by-field.service.js.map