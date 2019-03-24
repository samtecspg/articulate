import Boom from 'boom';
import {
    ROUTE_CONNECTION,
    PARAM_CONNECTION_ID
} from '../../../util/constants';
import Validator from '../../validators/connection.validator';

module.exports = {
    method: 'delete',
    path: `/${ROUTE_CONNECTION}/{${PARAM_CONNECTION_ID}}`,
    options: {
        tags: ['api'],
        validate: Validator.get,
        handler: async (request) => {

            const { connectionService } = await request.services();
            const {
                [PARAM_CONNECTION_ID]: connectionId
            } = request.params;

            try {
                return await connectionService.delete({ id: connectionId });
            }
            catch ({ message, statusCode }) {

                return new Boom(message, { statusCode });
            }
        }
    }
};

