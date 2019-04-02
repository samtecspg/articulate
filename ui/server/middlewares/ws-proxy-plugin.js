import _ from 'lodash';
import Nes from 'nes';
import { PROXY_ROUTE_PREFIX } from '../../common/constants';
import { API_URL } from '../../common/env';
import logger from '../logger';

const name = 'ws-proxy-plugin';
exports.plugin = {
  name,
  async register(server) {
    let apiClient;
    const subscriptions = [];

    const initServer = async ({ server }) => {
      await server.register({ plugin: Nes, options: {} });

      const onSubscribe = (socket, path) => {
        if (_.isNil(apiClient)) {
          logger.log('[WS] [onSubscribe] API WS Not connected ');
          throw new Error('API Client not ready');
        }
        const clientPath = path.substring(PROXY_ROUTE_PREFIX.length);
        subscriptions.push({ id: socket.id, path });
        apiClient.subscribe(clientPath, (update) => {
          server.publish(`${PROXY_ROUTE_PREFIX}${clientPath}`, update);
        });
      };

      const onUnsubscribe = (socket, path) => {
        _.remove(subscriptions, item => item.id === socket.id && item.path === path);
        if (_.isNil(apiClient)) {
          logger.log('[WS] [onUnsubscribe] API WS Not connected ');
          return;
        }
        const samePath = subscriptions.find((item) => item.path === path);
        if (!samePath) {
          apiClient.unsubscribe(path.substring(PROXY_ROUTE_PREFIX.length));
        }
      };

      server.subscription(`${PROXY_ROUTE_PREFIX}/agent/{id}`, { onSubscribe, onUnsubscribe });
      server.subscription(`${PROXY_ROUTE_PREFIX}/agent/{id}/doc`, { onSubscribe, onUnsubscribe });
    };
    
    const initClient = async () => {
      // Setup connection with API WS
      const apiURL = new URL('', API_URL);
      const client = new Nes.Client(`ws://${apiURL.host}`);
      client.onError = (err) => {
        logger.error(`[WS] Error ${API_URL}`);
        logger.error(err);
        apiClient = null;
      };
      client.onConnect = async () => {
        logger.log(`[WS] Connected to ${API_URL}`);
        apiClient = client;
      };
      client.onDisconnect = (willReconnect, log) => {
        logger.log(`[WS] Disconnect from ${API_URL}`);
        logger.log(log);
        logger.log(`[WS] Will Reconnect = ${willReconnect}`);
        subscriptions.splice(0, subscriptions.length);
        apiClient = null;
      };
      client.onHeartbeatTimeout = (willReconnect) => {
        logger.log(`[WS] Heartbeat Timeout from ${API_URL}`);
        logger.log(`[WS] Will Reconnect = ${willReconnect}`);
        apiClient = null;
      };
      await client.connect({
        delay: 1000
      });
    };
    try {
      await initServer({ server });
      await initClient();

    }
    catch (e) {
      logger.error(name);
      logger.error(e);
    }
  }
};
