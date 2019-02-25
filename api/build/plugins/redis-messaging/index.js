"use strict";

var _nohm = _interopRequireDefault(require("nohm"));

var _redis = _interopRequireDefault(require("redis"));

var _package = _interopRequireDefault(require("../../../package.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const name = 'redis-messaging';

const logger = require('../../util/logger')({
  name: `plugin:${name}`
});

module.exports = {
  name,
  pkg: _package.default,

  async register(server, options) {
    const host = options.host,
          port = options.port,
          retry = options.retry,
          retryTimeout = options.retryTimeout;

    const retryStrategy = settings => {
      logger.info(`redis::retryStrategy::${JSON.stringify(settings)}`);

      if (settings.error && settings.error.code === 'ECONNREFUSED') {
        logger.info(`Connection failed. Attempt ${settings.attempt} of ${retry}`);

        if (settings.attempt === retry) {
          logger.error('Failure during Redis connection ');
          logger.error(settings.error);
          return process.exit(1);
        }

        return retryTimeout;
      }

      return retryTimeout;
    };

    await new Promise((resolve, reject) => {
      const client = _redis.default.createClient(port, host, {
        retry_strategy: retryStrategy
      }); // Wait for connection


      client.once('ready', async () => {
        logger.info('ready');
        await _nohm.default.setPubSubClient(client);
        server.app[name] = _nohm.default;
        resolve();
      }); // Listen to errors

      client.on('error', err => {
        logger.error(err);
        reject(err);
      });
    });
    logger.info('registered');
  }

};
//# sourceMappingURL=index.js.map