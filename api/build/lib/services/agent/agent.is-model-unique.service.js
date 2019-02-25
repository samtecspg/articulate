"use strict";

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async function ({
  AgentModel,
  field,
  model,
  value
}) {
  const _ref = await this.server.services(),
        globalService = _ref.globalService;

  try {
    const Models = await globalService.searchByField({
      field,
      value,
      model
    });
    return Models && Models.length === 0 ? true : !(await AgentModel.belongsTo(Models[0], model));
  } catch (error) {
    throw (0, _redis.default)({
      error
    });
  }
};
//# sourceMappingURL=agent.is-model-unique.service.js.map