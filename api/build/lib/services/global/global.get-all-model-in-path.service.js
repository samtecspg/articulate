"use strict";

var _lodash = _interopRequireDefault(require("lodash"));

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

var _redis2 = _interopRequireDefault(require("../../errors/redis.not-linked-error"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async function ({
  modelPath = [],
  ids = [],
  returnModel = false
}) {
  const redis = this.server.app.redis;

  try {
    const models = {};

    const reducer = async (parent, current, index) => {
      if (!parent) {
        models[current] = await redis.factory(current, ids[index]);
        return models[current];
      }

      parent = await parent;
      models[current] = await redis.factory(current, ids[index]);
      const belongs = await parent.belongsTo(models[current], current);

      if (belongs) {
        return models[current];
      }

      throw (0, _redis2.default)({
        mainType: parent.modelName,
        mainId: parent.id,
        subType: current,
        subId: current.id
      });
    };

    await modelPath.reduce(reducer, null);

    if (returnModel) {
      return models;
    }

    return _lodash.default.map(models, model => model.allProperties());
  } catch (error) {
    throw (0, _redis.default)({
      error,
      message: `Can't find models in the path '${modelPath.join('->')}' with the ids '${ids.join(',')}'`
    });
  }
};
//# sourceMappingURL=global.get-all-model-in-path.service.js.map