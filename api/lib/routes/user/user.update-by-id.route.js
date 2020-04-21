import Boom from 'boom';
import {
    PARAM_USER_ACCOUNT_ID,
    ROUTE_USER_ACCOUNT
} from '../../../util/constants';
import { AUTH_ENABLED } from '../../../util/env';
import UserModel from '../../models/user-account.model';
import UserValidator from '../../validators/user.validator';

const auth = AUTH_ENABLED ? {
    mode: 'optional'
} : undefined;
module.exports = {
    method: 'put',
    path: `/${ROUTE_USER_ACCOUNT}/{${PARAM_USER_ACCOUNT_ID}}`,
    options: {
        tags: ['api'],
        validate: UserValidator.updateBbyId,
        response: {
            modify: true,
            schema: UserModel.responseSchema,
            options: { stripUnknown: true }
        },
        auth,
        handler: async (request) => {

            const { userService } = await request.services();
            try {
                const {
                    [PARAM_USER_ACCOUNT_ID]: id
                } = request.params;
                const { identity, ...rest } = request.payload;
                const user = await userService.updateById({ id, data: rest, filterSensitiveData: true });
                if (AUTH_ENABLED) {
                    await request.cookieAuth.set({ id: user.id, name: user.name, email: user.email });
                }
                return user;
            }
            catch ({ message, statusCode }) {
                return new Boom(message, { statusCode });
            }
        }
    }
};
