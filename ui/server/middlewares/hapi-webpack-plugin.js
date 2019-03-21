/**
 * Import dependencies https://github.com/SimonDegraeve/hapi-webpack-plugin
 */
import Path from 'path';
import Webpack from 'webpack';
import WebpackDevMiddleware from 'webpack-dev-middleware';
import WebpackHotMiddleware from 'webpack-hot-middleware';

exports.plugin = {
  name: 'hapi-webpack-plugin',
  once: true,
  async register(server, options) {

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

    const onPreResponse = async (request, h) => {
      if (!request.response.isBoom) {
        return h.continue;
      }
      const filename = Path.join(compiler.outputPath, 'index.html');
      return new Promise((resolve, reject) => {

        compiler.outputFileSystem.readFile(filename, (fileReadErr, result) => {
          if (fileReadErr) {
            reject(fileReadErr);
          }
          else {
            resolve(result.toString('utf8'));
          }
        });
      });
    };

    server.ext('onPreResponse', onPreResponse);

    // Expose compiler
    server.expose({ compiler });
  },
};
