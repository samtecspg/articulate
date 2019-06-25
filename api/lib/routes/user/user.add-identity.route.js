import Boom from 'boom';
import {
    PARAM_USER_ACCOUNT_ID,
    ROUTE_USER_ACCOUNT,
    ROUTE_USER_IDENTITY
} from '../../../util/constants';
import UserValidator from '../../validators/user.validator';

//const logger = require('../../../util/logger')({ name: `route:agent:create` });

module.exports = {
    method: 'post',
    path: `/${ROUTE_USER_ACCOUNT}/{${PARAM_USER_ACCOUNT_ID}}/${ROUTE_USER_IDENTITY}`,
    options: {
        tags: ['api'],
        validate: UserValidator.createIdentity,
        handler: async (request) => {

            const { userService } = await request.services();
            const { [PARAM_USER_ACCOUNT_ID]: id } = request.params;
            try {
                return await userService.addIdentity({ id, identityData: request.payload, filterSensitiveData: true });
            }
            catch ({ message, statusCode }) {
                return new Boom(message, { statusCode });
            }
        }
    }
};
