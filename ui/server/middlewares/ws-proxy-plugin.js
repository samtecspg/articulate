import _ from 'lodash';
import Nes from 'nes';
import { PROXY_ROUTE_PREFIX } from '../../common/constants';
import { API_URL } from '../../common/env';
import logger from '../logger';

const name = 'ws-proxy-plugin';
exports.plugin = {
  name,
  async register(server) {
    try {
      const subscriptions = [];
      logger.log(`ws-proxy-plugin::register`); // TODO: REMOVE!!!!
      // Setup connection with API WS
      const apiURL = new URL('', API_URL);
      logger.log({ API_URL, apiURL }); // TODO: REMOVE!!!!

      const apiClient = new Nes.Client(`ws://${apiURL.host}`);
      apiClient.onError = (err) => {
        logger.error(`[WS] Error ${API_URL}`);
        logger.error(err);
      };
      apiClient.onConnect = () => {
        logger.log(`[WS] Connected to ${API_URL}`);
      };
      apiClient.onDisconnect = (willReconnect, log) => {
        logger.log(`[WS] Disconnect from ${API_URL}`);
        logger.log(log);
        logger.log(`[WS] Will Reconnect = ${willReconnect}`);
      };
      apiClient.onHeartbeatTimeout = (willReconnect) => {
        logger.log(`[WS] Heartbeat Timeout from ${API_URL}`);
        logger.log(`[WS] Will Reconnect = ${willReconnect}`);
      };
      await apiClient.connect({
        delay: 1000,
      });

      // Setup local WS
      await server.register({ plugin: Nes, options: {} });

      const onSubscribe = (socket, path) => {

        const clientPath = path.substring(PROXY_ROUTE_PREFIX.length);
        subscriptions.push({ id: socket.id, path });
        apiClient.subscribe(clientPath, (update) => {
          server.publish(`${PROXY_ROUTE_PREFIX}${clientPath}`, update);
        });
      };

      const onUnsubscribe = (socket, path) => {

        _.remove(subscriptions, item => item.id === socket.id && item.path === path);
        const samePath = subscriptions.find((item) => item.path === path);
        if (!samePath) {
          apiClient.unsubscribe(path.substring(PROXY_ROUTE_PREFIX.length));
        }
      };

      server.subscription(`${PROXY_ROUTE_PREFIX}/agent/{id}`, { onSubscribe, onUnsubscribe });
      server.subscription(`${PROXY_ROUTE_PREFIX}/agent/{id}/doc`, { onSubscribe, onUnsubscribe });

    }
    catch (e) {
      logger.error(name);
      logger.error(e);
    }
  },
};
