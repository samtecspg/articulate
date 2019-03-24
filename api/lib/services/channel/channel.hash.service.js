import _ from 'lodash';
import Boom from 'boom';

import Channels from '../../channels';

module.exports = async function ({ connection, event }) {

    try {
        return Channels[connection.channel].hash({ event })
    }
    catch ({ message, statusCode }) {

        return new Boom(message, { statusCode });
    }
    
};
