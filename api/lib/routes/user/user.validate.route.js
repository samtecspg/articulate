import Boom from 'boom';
import {
    PARAM_EMAIL,
    PARAM_PASSWORD,
    ROUTE_USER_ACCOUNT
} from '../../../util/constants';
import UserValidator from '../../validators/user.validator';

module.exports = {
    method: 'POST',
    path: `/${ROUTE_USER_ACCOUNT}/validate`,
    options: {
        tags: ['api'],
        validate: UserValidator.validate,
        handler: async (request) => {

            const { userService } = await request.services();
            try {
                const {
                    [PARAM_EMAIL]: email,
                    [PARAM_PASSWORD]: password
                } = request.payload;
                return await userService.validate({ email, password });
            }
            catch ({ message, statusCode }) {
                return new Boom(message, { statusCode });
            }
        }
    }
};
