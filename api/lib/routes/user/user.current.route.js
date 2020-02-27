import Boom from 'boom';
import _ from 'lodash';
import {
    PARAM_CURRENT,
    ROUTE_USER_ACCOUNT
} from '../../../util/constants';
import { AUTH_ENABLED } from '../../../util/env';
import UserModel from '../../models/user-account.model';

module.exports = {
    method: 'get',
    path: `/${ROUTE_USER_ACCOUNT}/${PARAM_CURRENT}`,
    options: {
        tags: ['api'],
        response: {
            modify: true,
            schema: UserModel.responseSchema,
            options: { stripUnknown: true }
        },
        handler: async (request) => {

            const { userService } = await request.services();
            try {
                if (AUTH_ENABLED) {
                    return await userService.findById({ id: _.get(request, 'auth.credentials.id', null), filterSensitiveData: true, includeAccessPolicies: true });
                }
                console.log(`user.current.route::handler::noAuthUser`); // TODO: REMOVE!!!!
                let newVar = await userService.noAuthUser();
                return newVar;


            }
            catch ({ message, statusCode }) {
                return new Boom(message, { statusCode });
            }
        }
    }
};
