import Boom from 'boom';
import {
    ACL_ACTION_WRITE,
    P_HAPI_GBAC,
    PARAM_GROUP,
    PARAM_GROUP_NAME,
    ROUTE_ACCESS_CONTROL,
    ROUTE_TO_MODEL
} from '../../../util/constants';
import AccessControlValidator from '../../validators/access-control.validator';

//const logger = require('../../../util/logger')({ name: `route:ac:create` });

module.exports = {
    method: 'get',
    path: `/${ROUTE_ACCESS_CONTROL}/${PARAM_GROUP}/{${PARAM_GROUP_NAME}}`,
    options: {
        plugins: {
            [P_HAPI_GBAC]: [
                `${ROUTE_TO_MODEL[ROUTE_ACCESS_CONTROL]}:${ACL_ACTION_WRITE}`
            ]
        },
        tags: ['api'],
        validate: AccessControlValidator.findByName,
        handler: async (request) => {

            const { accessControlService } = await request.services();
            const { [PARAM_GROUP_NAME]: name } = request.params;
            try {
                return await accessControlService.findByName({ name });
            }
            catch ({ message, statusCode }) {
                return new Boom(message, { statusCode });
            }
        }
    }
};
