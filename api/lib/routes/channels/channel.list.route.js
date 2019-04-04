import Boom from 'boom';
import {
    ROUTE_CHANNEL
} from '../../../util/constants';

module.exports = {
    method: 'get',
    path: `/${ROUTE_CHANNEL}`,
    options: {
        tags: ['api'],
        handler: async (request) => {

            const { channelService } = await request.services();

            try {
                return await channelService.info()
            }
            catch ({ message, statusCode }) {
                return new Boom(message, { statusCode });
            }
        }
    }
};
