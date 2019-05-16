import Blipp from 'blipp';
import h2o2 from 'h2o2';
import Hapi from 'hapi';
import Webpack from 'webpack';
import argv from './argv';
import logger from './logger';
import * as WebpackPlugin from './middlewares/hapi-webpack-plugin';
import port from './port';

const isDev = process.env.NODE_ENV !== 'production';
const ngrok =
  (isDev && process.env.ENABLE_TUNNEL) || argv.tunnel
    ? require('ngrok')
    : false;
const Config = isDev ? require('../internals/webpack/webpack.dev.babel') : require('../internals/webpack/webpack.prod.babel');

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
    await server.register([
      {
        plugin: WebpackPlugin,
        options: { compiler, assets, hot }
      }, {
        plugin: h2o2
      }, {
        plugin: Blipp
      }
    ]);
  }
  catch (error) {
    return logger.error(error);
  }

  try {
    await server.start();
    //await server.route(Routes);
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
  // eslint-disable-next-line no-console
  console.log(server.plugins.blipp.text());
  return server;
};

process.on('unhandledRejection', (error) => {

  logger.error(error);
  process.exit(1);
});

// noinspection JSIgnoredPromiseFromCall
init();
