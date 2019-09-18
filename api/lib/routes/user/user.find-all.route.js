import Boom from 'boom';
import Joi from 'joi';
import {
    ACL_ACTION_READ,
    MODEL_USER_ACCOUNT,
    P_HAPI_GBAC,
    PARAM_DIRECTION,
    PARAM_FIELD,
    PARAM_FILTER,
    PARAM_LIMIT,
    PARAM_SKIP,
    ROUTE_USER_ACCOUNT
} from '../../../util/constants';
import UserModel from '../../models/user-account.model';
import GlobalValidator from '../../validators/global.validator';

//const logger = require('../../../util/logger')({ name: `user-find-all` });
module.exports = {
    method: 'get',
    path: `/${ROUTE_USER_ACCOUNT}`,
    options: {
        plugins: {
            [P_HAPI_GBAC]: [
                `${MODEL_USER_ACCOUNT}:${ACL_ACTION_READ}`
            ]
        },
        tags: ['api'],
        validate: GlobalValidator.findAll,
        response: {
            modify: true,
            schema: Joi.object().keys({
                data: Joi.array().items(UserModel.responseSchema),
                totalCount: Joi.number()
            }),
            options: { stripUnknown: true }
        },
        handler: async (request) => {

            const { globalService } = await request.services();
            const {
                [PARAM_SKIP]: skip,
                [PARAM_LIMIT]: limit,
                [PARAM_DIRECTION]: direction,
                [PARAM_FIELD]: field,
                [PARAM_FILTER]: filter
            } = request.query;
            try {
                const result = await globalService.findAll({ skip, limit, direction, field, model: MODEL_USER_ACCOUNT, filter });
                result.data = result.data.map((user) => {
                    // eslint-disable-next-line no-unused-vars
                    const { salt, password, ...rest } = user;
                    return rest;
                });
                return result;
            }
            catch ({ message, statusCode }) {

                return new Boom(message, { statusCode });
            }
        }
    }
};
