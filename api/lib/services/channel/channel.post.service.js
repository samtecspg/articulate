import _ from 'lodash';
import Boom from 'boom';
import Channels from '../../channels';

module.exports = async function ({ connection, request, h }) {

    try {
        const url = request.server.info.protocol 
          + '://' 
          + request.server.info.host
          + ':'
          + request.server.info.port;
        connection.requestURL = url;
        return Channels[connection.channel].post({ connection, request, h })
    }
    catch ({ message, statusCode }) {

        return new Boom(message, { statusCode });
    }
};
