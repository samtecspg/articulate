"use strict";

var _boom = _interopRequireDefault(require("boom"));

var _confidence = _interopRequireDefault(require("confidence"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _nes = _interopRequireDefault(require("nes"));

var _schmervice = _interopRequireDefault(require("schmervice"));

var _toys = _interopRequireDefault(require("toys"));

var _package = _interopRequireDefault(require("../package.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Pull .env into process.env
_dotenv.default.config({
  path: `${__dirname}/.env`
});

const redisOptions = {
  host: process.env.REDIS_HOST || 'redis',
  port: process.env.REDIS_PORT || 6379,
  retry: process.env.INIT_RETRY || 10,
  retryTimeout: process.env.INIT_RETRY_TIMEOUT || 15000,
  prefix: process.env.REDIS_PREFIX || _package.default.name
}; // Glue manifest as a confidence store

module.exports = new _confidence.default.Store({
  server: {
    host: process.env.HOST || '0.0.0.0',
    port: process.env.PORT || 7500,
    routes: {
      cors: true,
      validate: {
        failAction: (request, h, err) => {
          if (process.env.NODE_ENV === 'production') {
            // In prod, log a limited error message and throw the default Bad Request error.
            console.error('ValidationError:', err.message);
            throw _boom.default.badRequest(`Invalid request payload input`);
          } else {
            // During development, log and respond with the full error.
            console.error(err);
            throw err;
          }
        }
      }
    },
    debug: {
      $filter: 'NODE_ENV',
      development: {
        log: ['error', 'implementation', 'internal'],
        request: ['error', 'implementation', 'internal']
      }
    }
  },
  register: {
    plugins: [{
      plugin: _schmervice.default,
      options: {}
    }, {
      plugin: _nes.default,
      options: {}
    }, {
      plugin: './plugins/rasa-nlu',
      options: {
        //options passed to axios
        baseURL: process.env.RASA_URL || 'http://rasa:5000'
      }
    }, {
      plugin: './plugins/duckling',
      options: {
        //options passed to axios
        baseURL: process.env.DUCKLING_URL || 'http://localhost:8000'
      }
    }, {
      plugin: './plugins/redis',
      options: redisOptions
    }, {
      plugin: './plugins/es',
      options: {
        host: process.env.ES_HOST || 'http://elasticsearch:9200',
        log: process.env.ES_LOG || 'error'
      }
    }, {
      plugin: './plugins/redis-messaging',
      options: redisOptions
    }, {
      plugin: './plugins/handlebars',
      options: {}
    }, {
      plugin: {
        $filter: 'NODE_ENV',
        $default: 'hpal-debug',
        production: _toys.default.noop
      }
    }, {
      plugin: './plugins/swagger',
      options: {
        info: {
          title: 'Articulate API Documentation',
          version: _package.default.version,
          contact: {
            name: 'Smart Platform Group'
          }
        },
        documentationPage: false,
        schemes: process.env.SWAGGER_SCHEMES || null,
        host: process.env.SWAGGER_HOST || null,
        basePath: process.env.SWAGGER_BASE_PATH || null
      }
    }, {
      plugin: './lib',
      // Main plugin
      options: {}
    }]
  }
});
//# sourceMappingURL=manifest.js.map