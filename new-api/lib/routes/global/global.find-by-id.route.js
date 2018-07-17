import Boom from 'boom';
import Joi from 'joi';
import {
    PARAMS_POSTFIX_ID,
    ROUTE_TO_MODEL
} from '../../../util/constants';

//const logger = require('../../../util/logger')({ name: `route:global:search-by-field` });

module.exports = ({ ROUTE }) => {

    return {
        method: 'get',
        path: `/${ROUTE}/{${ROUTE + PARAMS_POSTFIX_ID}}`,
        options: {
            tags: ['api'],
            validate: {
                params: (() => {

                    return {
                        [`${ROUTE + PARAMS_POSTFIX_ID}`]: Joi.string().required().description(`${ROUTE_TO_MODEL[ROUTE]} id`)
                    };
                })()
            },
            handler: async (request) => {

                const { globalService } = await request.services();
                const { [`${ROUTE + PARAMS_POSTFIX_ID}`]: id } = request.params;
                try {
                    return await globalService.findById({ id, model: ROUTE_TO_MODEL[ROUTE] });
                }
                catch ({ message, statusCode }) {

                    return new Boom(message, { statusCode });
                }
            }
        }
    };
};
