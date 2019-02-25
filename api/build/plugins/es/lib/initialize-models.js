"use strict";

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = require('../../../util/logger')({
  name: `plugin:es:initialize-model`
});

module.exports = async ({
  client,
  path
}) => {
  const Mods = require(path);

  const models = {};
  await _lodash.default.each(Mods, async model => {
    const instance = new model({
      client
    });
    const name = instance.name,
          properties = instance.properties,
          index = instance.index;
    logger.debug(name);
    const exists = await client.indices.exists({
      index
    });

    if (!exists) {
      await client.indices.create({
        index
      });
    }

    await client.indices.putMapping({
      index,
      type: index,
      body: {
        properties
      }
    });
    models[name] = instance;
  });
  return models;
};
//# sourceMappingURL=initialize-models.js.map