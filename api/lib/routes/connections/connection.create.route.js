import Boom from 'boom';
import { ROUTE_CONNECTION } from '../../../util/constants';
import Validator from '../../validators/connection.validator';

module.exports = {
    method: 'post',
    path: `/${ROUTE_CONNECTION}`,
    options: {
        tags: ['api'],
        validate: Validator.create,
        handler: async (request) => {

            const { connectionService } = await request.services();

            try {
                return await connectionService.create({ data: request.payload });
            }
            catch ({ message, statusCode }) {

                return new Boom(message, { statusCode });
            }
        }
    }
};

