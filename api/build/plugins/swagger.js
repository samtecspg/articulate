"use strict";

var _hapiSwagger = _interopRequireDefault(require("hapi-swagger"));

var _hapiSwaggeredUi = _interopRequireDefault(require("hapi-swaggered-ui"));

var _inert = _interopRequireDefault(require("inert"));

var _vision = _interopRequireDefault(require("vision"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const name = 'swagger';

const logger = require('../util/logger')({
  name: `plugin:${name}`
});

module.exports = {
  name,

  async register(server, options) {
    // We added in HapiSwaggerUI because HapiSwagger hadn't been updated and had an SSL bug.
    await server.register([_inert.default, _vision.default, {
      plugin: _hapiSwagger.default,
      options
    }, {
      plugin: _hapiSwaggeredUi.default,
      options: {
        title: options.info.title,
        path: '/documentation',
        swaggerEndpoint: '/swagger.json',
        swaggerOptions: {
          validatorUrl: null
        }
      }
    }]);
    logger.info('registered');
  }

};
//# sourceMappingURL=swagger.js.map