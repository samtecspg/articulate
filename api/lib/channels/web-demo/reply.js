import {
  ROUTE_EXTERNAL,
  ROUTE_CONNECTION
} from '../../../util/constants';

module.exports = async function ({ connection, event, response }) {

  event.server.publish(`/${ROUTE_CONNECTION}/${connection.id}/${ROUTE_EXTERNAL}/${event.sessionId}`, response);
}
