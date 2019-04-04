import _ from 'lodash';
import Boom from 'boom';
import Channels from '../../channels';

module.exports = async function ({ connection, request, h }) {

    try {
        return Channels[connection.channel].post({ connection, request, h })
    }
    catch ({ message, statusCode }) {

        return new Boom(message, { statusCode });
    }
};
