const Hapi = require('hapi');
const WebpackPlugin = require('./middlewares/hapi-webpack-plugin');
const Webpack = require('webpack');
const argv = require('./argv');
const port = require('./port');
const isDev = process.env.NODE_ENV !== 'production';
const logger = require('./logger');
const ngrok =
  (isDev && process.env.ENABLE_TUNNEL) || argv.tunnel
    ? require('ngrok')
    : false;
let Config = {};

if (isDev) {
  Config = require('../internals/webpack/webpack.dev.babel');
}
else {
  Config = require('../internals/webpack/webpack.prod.babel');
}

// get the intended host and port number, use localhost and port 3000 if not provided
const customHost = argv.host || process.env.HOST;
const host = customHost || null; // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || 'localhost';

const server = Hapi.server({
  port,
  host
});

const compiler = Webpack(Config);
const assets = {
  // webpack-dev-middleware options
  // See https://github.com/webpack/webpack-dev-middleware
};

const hot = {
  // webpack-hot-middleware options
  // See https://github.com/glenjamin/webpack-hot-middleware
};

const init = async () => {

  try {
    await server.register({
      plugin: WebpackPlugin,
      options: { compiler, assets, hot }
    });
  }
  catch (error) {
    return logger.error(error);
  }

  try {
    await server.start();
  }
  catch (error) {
    return logger.error(error);
  }

  if (ngrok) {
    let url;
    try {
      url = await ngrok.connect(port);
    }
    catch (error) {
      return logger.error(error);
    }
    logger.appStarted(port, prettyHost, url);
  }
  else {
    logger.appStarted(port, prettyHost);
  }
};

process.on('unhandledRejection', (error) => {

  logger.error(error);
  process.exit(1);
});

return init();
