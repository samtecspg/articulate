import _ from 'lodash';
import Boom from 'boom';

import Channels from '../../channels';

module.exports = async function ({ connection, event, response, server }) {

    try {
        return Channels[connection.channel].reply({ connection, event, response, server })
    }
    catch ({ message, statusCode }) {

        return new Boom(message, { statusCode });
    }

};