import _ from 'lodash';
import Boom from 'boom';

import Channels from '../../channels';

module.exports = async function ({ connection, event, response }) {

    try {
        return Channels[connection.channel].reply({ connection, event, response })
    }
    catch ({ message, statusCode }) {

        return new Boom(message, { statusCode });
    }
    
};
