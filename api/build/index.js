"use strict";

var _glue = _interopRequireDefault(require("glue"));

var _manifest = _interopRequireDefault(require("./manifest"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = require('./util/logger')({
  name: `server`
});

exports.deployment = async start => {
  const manifest = _manifest.default.get('/', process.env);

  const server = await _glue.default.compose(manifest, {
    relativeTo: __dirname
  });
  await server.initialize();

  if (!start) {
    return server;
  }

  await server.start();
  logger.info(`Server started at ${server.info.uri}`);
  return server;
};

if (!module.parent) {
  exports.deployment(true);
  process.on('unhandledRejection', err => {
    throw err;
  });
}
//# sourceMappingURL=index.js.map