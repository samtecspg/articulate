import Boom from 'boom';
import {
    ROUTE_CATEGORY
} from '../../../util/constants';

module.exports = {
    method: 'get',
    path: `/${ROUTE_CATEGORY}`,
    options: {
        tags: ['api'],
        handler: async (request) => {

            const { categoryService } = await request.services();

            try {
                return await categoryService.info()
            }
            catch ({ message, statusCode }) {
                return new Boom(message, { statusCode });
            }
        }
    }
};
