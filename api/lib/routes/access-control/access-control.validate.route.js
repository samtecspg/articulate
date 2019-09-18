import Boom from 'boom';
import {
    ACL_ACTION_READ,
    P_HAPI_GBAC,
    PARAM_VALIDATE,
    ROUTE_ACCESS_CONTROL,
    ROUTE_TO_MODEL
} from '../../../util/constants';

//const logger = require('../../../util/logger')({ name: `route:ac:create` });

module.exports = {
    method: 'post',
    path: `/${ROUTE_ACCESS_CONTROL}/${PARAM_VALIDATE}`,
    options: {
        plugins: {
            [P_HAPI_GBAC]: [
                `${ROUTE_TO_MODEL[ROUTE_ACCESS_CONTROL]}:${ACL_ACTION_READ}`
            ]
        },
        tags: ['api'],
        //validate: SettingsValidator.create, //TODO: add validation
        handler: async (request) => {

            const { acService } = await request.services();
            try {
                return await acService.create({ data: request.payload });
            }
            catch ({ message, statusCode }) {
                return new Boom(message, { statusCode });
            }
        }
    }
};
