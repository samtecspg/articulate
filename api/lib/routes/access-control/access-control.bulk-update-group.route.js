import Boom from 'boom';
import {
    ACL_ACTION_WRITE,
    P_HAPI_GBAC,
    PARAM_BULK,
    ROUTE_ACCESS_CONTROL,
    ROUTE_TO_MODEL
} from '../../../util/constants';
import AccessControlValidator from '../../validators/access-control.validator';

//const logger = require('../../../util/logger')({ name: `route:ac:bulk-update` });

module.exports = {
    method: 'put',
    path: `/${ROUTE_ACCESS_CONTROL}/${PARAM_BULK}`,
    options: {
        plugins: {
            [P_HAPI_GBAC]: [
                `${ROUTE_TO_MODEL[ROUTE_ACCESS_CONTROL]}:${ACL_ACTION_WRITE}`
            ]
        },
        tags: ['api'],
        validate: AccessControlValidator.bulkUpdateGroup,
        handler: async (request) => {

            const { accessControlService } = await request.services();

            try {
                const { payload} = request;
                return await accessControlService.bulkUpdate({ data: payload });
            }
            catch ({ message, statusCode }) {
                return new Boom(message, { statusCode });
            }
        }
    }
};
