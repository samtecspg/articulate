/**
 * Import dependencies https://github.com/SimonDegraeve/hapi-webpack-plugin
 */
require('babel-polyfill');
const Path = require('path');
const Webpack = require('webpack');
const WebpackDevMiddleware = require('webpack-dev-middleware');
const WebpackHotMiddleware = require('webpack-hot-middleware');
const Pack = require('../../package.json');

function register(server, options) {

  // Define variables
  let config = {};
  let compiler;

  // Require config from path
  if (typeof options === 'string') {
    const configPath = Path.resolve(process.cwd(), options);
    config = require(configPath);
    compiler = new Webpack(config);
  }
  else {
    config = options;
    compiler = config.compiler;
  }

  // Create middlewares
  const webpackDevMiddleware = WebpackDevMiddleware(compiler, config.assets);
  const webpackHotMiddleware = WebpackHotMiddleware(compiler, config.hot);

  // Handle webpackDevMiddleware
  server.ext({
    type: 'onRequest',
    method: async (request, h) => {
      const { req, res } = request.raw;
      try {
        const setupWebpackDevMiddleware = new Promise((resolve, reject) => {
          webpackDevMiddleware(req, res, error => {
            if (error) reject(error);
            resolve();
          });
        });

        await setupWebpackDevMiddleware;
        return h.continue;
      }
      catch (err) {
        throw err;
      }
    },
  });

  // Handle webpackHotMiddleware
  server.ext({
    type: 'onRequest',
    method: async (request, h) => {
      const { req, res } = request.raw;
      try {
        const setupWebpackHotMiddleware = new Promise((resolve, reject) => {
          webpackHotMiddleware(req, res, error => {
            if (error) reject(error);
            resolve();
          });
        });

        await setupWebpackHotMiddleware;
        return h.continue;
      }
      catch (err) {
        throw err;
      }
    },
  });

  const onPreResponse = async function() {

    const filename = Path.join(compiler.outputPath, 'index.html');
    return new Promise(function(resolve, reject) {
      compiler.outputFileSystem.readFile(filename, (fileReadErr, result) => {
        fileReadErr ? reject(fileReadErr) : resolve(result.toString('utf8'));
      });
    });
  };

  server.ext('onPreResponse', onPreResponse);

  // Expose compiler
  server.expose({ compiler });
}

exports.plugin = {
  pkg: Pack,
  once: true,
  register,
};
