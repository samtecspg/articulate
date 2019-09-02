import Boom from 'boom';
import {
    ROUTE_USER_ACCOUNT,
    PARAM_USER_ACCOUNT_ID
} from '../../../util/constants';
import UserValidator from '../../validators/user.validator';

module.exports = {
    method: 'delete',
    path: `/${ROUTE_USER_ACCOUNT}/{${PARAM_USER_ACCOUNT_ID}}`,
    options: {
        tags: ['api'],
        validate: UserValidator.removeById,
        handler: async (request, h) => {

            const { userService } = await request.services();
            const { [PARAM_USER_ACCOUNT_ID]: userId } = request.params;
            try {
                await userService.removeById({ id: userId });
                return h.continue;
            }
            catch ({ message, statusCode }) {

                return new Boom(message, { statusCode });
            }
        }
    }
};

