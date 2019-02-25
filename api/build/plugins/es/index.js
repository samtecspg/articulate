"use strict";

var _elasticsearch = _interopRequireDefault(require("elasticsearch"));

var _package = _interopRequireDefault(require("../../../package.json"));

var _initializeModels = _interopRequireDefault(require("./lib/initialize-models"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const name = 'es';

const logger = require('../../util/logger')({
  name: `plugin:${name}`
});

module.exports = {
  name,
  pkg: _package.default,

  async register(server, options) {
    const client = new _elasticsearch.default.Client(options);

    try {
      await client.ping({
        requestTimeout: 1000
      });
      server.app[name] = {
        client,
        models: await (0, _initializeModels.default)({
          client,
          path: `${__dirname}/models`
        })
      };
      logger.info('registered');
    } catch (e) {
      console.error('elasticsearch cluster is down!');
      throw e;
    }
  }

};
//# sourceMappingURL=index.js.map