import Boom from 'boom';
import {
    CONFIG_SETTINGS_ALLOW_NEW_USERS_SIGN_UPS,
    ROUTE_USER_ACCOUNT
} from '../../../util/constants';
import { AUTH_ENABLED } from '../../../util/env';
import UserValidator from '../../validators/user.validator';

const auth = AUTH_ENABLED ? {
    mode: 'optional'
} : undefined;
module.exports = {
    method: 'post',
    path: `/${ROUTE_USER_ACCOUNT}`,

    options: {
        tags: ['api'],
        validate: UserValidator.create,
        auth,
        handler: async (request) => {

            const { userService, settingsService } = await request.services();
            try {
                const allowNewUsersSignUps = await settingsService.findByName({ name: CONFIG_SETTINGS_ALLOW_NEW_USERS_SIGN_UPS });
                if (allowNewUsersSignUps && allowNewUsersSignUps.value) {
                    const { identity, skipLogin, ...rest } = request.payload;
                    const user = await userService.create({ data: rest, identity, filterSensitiveData: true });
                    if (AUTH_ENABLED && !skipLogin) {
                        await request.cookieAuth.set({ id: user.id, name: user.name, email: user.email });
                    }
                    return user;
                }
                throw {
                    message: 'New users sign up is disabled',
                    statusCode: 400
                };
            }
            catch ({ message, statusCode }) {
                return new Boom(message, { statusCode });
            }
        }
    }
};
