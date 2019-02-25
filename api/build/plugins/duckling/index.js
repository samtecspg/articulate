"use strict";

var _axios = _interopRequireDefault(require("axios"));

var _package = _interopRequireDefault(require("../../../package.json"));

var _initializeModels = _interopRequireDefault(require("./lib/initialize-models"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const name = 'duckling';

const logger = require('../../util/logger')({
  name: `plugin:${name}`
});

module.exports = {
  name,
  pkg: _package.default,

  async register(server, options) {
    // Set config defaults when creating the instance
    const axios = _axios.default.create(options);

    server.app[name] = await (0, _initializeModels.default)({
      http: axios,
      path: `${__dirname}/models`
    });
    logger.info('registered');
  }

};
//# sourceMappingURL=index.js.map