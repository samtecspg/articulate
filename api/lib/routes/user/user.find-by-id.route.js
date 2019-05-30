import Boom from 'boom';
import {
    PARAM_USER_ACCOUNT_ID,
    ROUTE_USER_ACCOUNT
} from '../../../util/constants';
import UserValidator from '../../validators/user.validator';

module.exports = {
    method: 'get',
    path: `/${ROUTE_USER_ACCOUNT}/{${PARAM_USER_ACCOUNT_ID}}`,
    options: {
        tags: ['api'],
        validate: UserValidator.findById,
        handler: async (request) => {

            const { userService } = await request.services();
            try {
                const {
                    [PARAM_USER_ACCOUNT_ID]: id
                } = request.params;
                return await userService.findById({ id, filterSensitiveData: true });
            }
            catch ({ message, statusCode }) {
                return new Boom(message, { statusCode });
            }
        }
    }
};
