"use strict";

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = require('../../../util/logger')({
  name: `plugin:duckling:initialize-model`
});

module.exports = async ({
  http,
  path
}) => {
  const Models = require(path);

  const initializedModels = {};
  await _lodash.default.each(Models, (model, index) => {
    if (_lodash.default.isNil(model.name) || _lodash.default.isNil(model.path)) {
      throw new Error(`Model [${path}/${index}] should have a name and path properties.`);
    }

    const defaultFunction = model.default({
      http
    });

    if (_lodash.default.isNil(defaultFunction)) {
      throw new Error(`Model [${model.name}] should have a default export`);
    }

    logger.debug(model.name);
    initializedModels[model.name] = defaultFunction;
  });
  return initializedModels;
};
//# sourceMappingURL=initialize-models.js.map