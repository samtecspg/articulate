"use strict";

var _lodash = _interopRequireDefault(require("lodash"));

var _nohm = _interopRequireDefault(require("nohm"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = require('../../../util/logger')({
  name: `plugin:redis:initialize-model`
});

module.exports = async ({
  redis,
  path,
  prefix
}) => {
  _nohm.default.setPrefix(prefix);

  _nohm.default.setClient(redis);

  _nohm.default.setPublish(true);

  const Mods = require(path);

  await _lodash.default.each(Mods, model => {
    logger.debug(model.modelName);

    _nohm.default.register(model);
  });
  return _nohm.default;
};
//# sourceMappingURL=initialize-models.js.map