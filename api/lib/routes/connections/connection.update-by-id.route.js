import Boom from 'boom';
import { ROUTE_CONNECTION, PARAM_CONNECTION_ID } from '../../../util/constants';
import Validator from '../../validators/connection.validator';

module.exports = {
    method: 'put',
    path: `/${ROUTE_CONNECTION}/{${PARAM_CONNECTION_ID}}`,
    options: {
        tags: ['api'],
        validate: Validator.updateById,
        handler: async (request) => {

            const { connectionService } = await request.services();
            const { [PARAM_CONNECTION_ID]: id } = request.params;
            try {
                return await connectionService.updateById({ id, data: request.payload });
            }
            catch ({ message, statusCode }) {
                return new Boom(message, { statusCode });
            }
        }
    }
};
