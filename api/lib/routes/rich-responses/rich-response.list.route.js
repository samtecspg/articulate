import Boom from 'boom';
import {
    ROUTE_RICH_RESPONSE
} from '../../../util/constants';

module.exports = {
    method: 'get',
    path: `/${ROUTE_RICH_RESPONSE}`,
    options: {
        tags: ['api'],
        handler: async (request) => {

            const { richResponseService } = await request.services();

            try {
                return await richResponseService.info()
            }
            catch ({ message, statusCode }) {
                return new Boom(message, { statusCode });
            }
        }
    }
};
