import Boom from 'boom';
import {
    ROUTE_CONNECTION,
    ROUTE_EXTERNAL,
    PARAM_CONNECTION_ID
} from '../../../util/constants';
import Validator from '../../validators/connection.validator';

module.exports = {
    method: 'get',
    path: `/${ROUTE_CONNECTION}/{${PARAM_CONNECTION_ID}}/${ROUTE_EXTERNAL}`,
    options: {
        tags: ['api'],
        validate: Validator.get,
        handler: async (request) => {

            const { connectionService } = await request.services();
            const {
                [PARAM_CONNECTION_ID]: connectionId
            } = request.params;

            try {
                return await connectionService.get({ id: connectionId, request });
            }
            catch ({ message, statusCode }) {

                return new Boom(message, { statusCode });
            }
        }
    }
};

