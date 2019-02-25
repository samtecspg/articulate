"use strict";

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async function ({
  model,
  id,
  relationNames = []
}) {
  const redis = this.server.app.redis;

  try {
    const Model = await redis.factory(model, id);
    const props = Model.allProperties();
    relationNames.forEach(relationName => {
      props[relationName] = [];
    });
    await Promise.all(relationNames.map(async relationName => {
      const RelationModel = await redis.factory(relationName);
      const ids = await Model.getAll(relationName, relationName);
      const results = await RelationModel.loadAllByIds({
        ids
      });
      props[relationName].push(...results.map(r => r.allProperties()));
    }));
    return props;
  } catch (error) {
    throw (0, _redis.default)({
      error,
      message: `${model} error loading linked models`
    });
  }
};
//# sourceMappingURL=global.load-with-includes.service.js.map