import _ from 'lodash';
import Boom from 'boom';

import Channels from '../../channels';

module.exports = async function ({ connection, request }) {

    try {
        return Channels[connection.channel].get({ connection, request })
    }
    catch ({ message, statusCode }) {

        return new Boom(message, { statusCode });
    }
    
};
