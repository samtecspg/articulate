import _ from 'lodash';
import Nes from 'nes';
import { PROXY_ROUTE_PREFIX } from '../../common/constants';
import { API_URL } from '../../common/env';

const name = 'ws-proxy-plugin';
exports.plugin = {
  name,
  async register(server) {
    try {
      const subscriptions = [];

      // Setup connection with API WS
      const apiURL = new URL('', API_URL);
      const apiClient = new Nes.Client(`ws://${apiURL.host}`);
      await apiClient.connect();

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
      console.error(name);
      console.error(e);
    }
  },
};
