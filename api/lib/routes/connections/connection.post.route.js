import Boom from 'boom';
import {
    ROUTE_CONNECTION,
    ROUTE_EXTERNAL,
    PARAM_CONNECTION_ID
} from '../../../util/constants';
import Validator from '../../validators/connection.validator';

module.exports = {
    method: 'post',
    path: `/${ROUTE_CONNECTION}/{${PARAM_CONNECTION_ID}}/${ROUTE_EXTERNAL}`,
    options: {
        tags: ['api'],
        validate: Validator.post,
        handler: async (request, h) => {

            const { connectionService } = await request.services();
            const {
                [PARAM_CONNECTION_ID]: connectionId
            } = request.params;

            try {
                return await connectionService.post({ id: connectionId, request, h });
            }
            catch ({ message, statusCode }) {

                return new Boom(message, { statusCode });
            }
        }
    }
};

