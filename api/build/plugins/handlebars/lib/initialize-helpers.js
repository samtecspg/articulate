"use strict";

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = require('../../../util/logger')({
  name: `plugin:handlebars:initialize-helpers`
});

module.exports = async ({
  Handlebars,
  path
}) => {
  const Models = require(path);

  const initializedModels = {};
  await _lodash.default.each(Models, model => {
    model.default({
      Handlebars
    });
    logger.debug(model.name);
  });
  return initializedModels;
};
//# sourceMappingURL=initialize-helpers.js.map