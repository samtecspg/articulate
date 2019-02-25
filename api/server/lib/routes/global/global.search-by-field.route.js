import Boom from 'boom';
import {
    PARAM_FIELD,
    PARAM_SEARCH,
    PARAM_VALUE,
    ROUTE_TO_MODEL
} from '../../../util/constants';
import GlobalValidator from '../../validators/global.validator';

//const logger = require('../../../server/util/logger')({ name: `route:global:search-by-field` });

module.exports = ({ ROUTE }) => {

    return {
        method: 'get',
        path: `/${ROUTE}/${PARAM_SEARCH}/{${PARAM_FIELD}}/{${PARAM_VALUE}}`,
        options: {
            tags: ['api'],
            validate: GlobalValidator.searchByfield,

            handler: async (request) => {

                const { globalService } = await request.services();
                const {
                    [PARAM_FIELD]: field,
                    [PARAM_VALUE]: value
                } = request.params;
                try {
                    return await globalService.searchByField({ field, value, model: ROUTE_TO_MODEL[ROUTE] });
                }
                catch ({ message, statusCode }) {

                    return new Boom(message, { statusCode });
                }
            }
        }
    };
};
