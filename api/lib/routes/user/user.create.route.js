import Boom from 'boom';
import { ROUTE_USER_ACCOUNT } from '../../../util/constants';
import UserValidator from '../../validators/user.validator';

module.exports = {
    method: 'post',
    path: `/${ROUTE_USER_ACCOUNT}`,

    options: {
        tags: ['api'],
        validate: UserValidator.create,
        auth: {
            mode: 'optional'
        },
        handler: async (request) => {

            const { userService } = await request.services();
            try {
                const { identity, ...rest } = request.payload;
                const user = await userService.create({ data: rest, identity, filterSensitiveData: true });
                await request.cookieAuth.set({ id: user.id, name: user.name, email: user.email });
                return user;
            }
            catch ({ message, statusCode }) {
                return new Boom(message, { statusCode });
            }
        }
    }
};
