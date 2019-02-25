"use strict";

var _handlebars = _interopRequireDefault(require("handlebars"));

var _package = _interopRequireDefault(require("../../../package.json"));

var _initializeHelpers = _interopRequireDefault(require("./lib/initialize-helpers"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const name = 'handlebars';

const logger = require('../../util/logger')({
  name: `plugin:${name}`
});

module.exports = {
  name,
  pkg: _package.default,

  async register(server) {
    await (0, _initializeHelpers.default)({
      Handlebars: _handlebars.default,
      path: `${__dirname}/helpers`
    });
    server.app[name] = _handlebars.default;
    logger.info('registered');
  }

};
//# sourceMappingURL=index.js.map