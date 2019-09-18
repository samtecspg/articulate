import Boom from 'boom';
import {
    ACL_ACTION_WRITE,
    P_HAPI_GBAC,
    PARAM_GROUP,
    ROUTE_ACCESS_CONTROL,
    ROUTE_TO_MODEL
} from '../../../util/constants';
import AccessControlValidator from '../../validators/access-control.validator';

//const logger = require('../../../util/logger')({ name: `route:ac:create` });

module.exports = {
    method: 'post',
    path: `/${ROUTE_ACCESS_CONTROL}/${PARAM_GROUP}`,
    options: {
        plugins: {
            [P_HAPI_GBAC]: [
                `${ROUTE_TO_MODEL[ROUTE_ACCESS_CONTROL]}:${ACL_ACTION_WRITE}`
            ]
        },
        tags: ['api'],
        validate: AccessControlValidator.createGroup,
        handler: async (request) => {

            const { accessControlService } = await request.services();
            try {
                return await accessControlService.upsert({ data: request.payload });
            }
            catch ({ message, statusCode }) {
                return new Boom(message, { statusCode });
            }
        }
    }
};
