import Boom from 'boom';
import {
    PARAM_DIRECTION,
    PARAM_FIELD,
    PARAM_FILTER,
    PARAM_LIMIT,
    PARAM_SKIP,
    ROUTE_TO_MODEL
} from '../../../util/constants';
import GlobalValidator from '../../validators/global.validator';

module.exports = ({ ROUTE }) => {

    return {
        method: 'get',
        path: `/${ROUTE}`,
        options: {
            tags: ['api'],
            validate: GlobalValidator.findAll,
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
                    return await globalService.findAll({ skip, limit, direction, field, model: ROUTE_TO_MODEL[ROUTE], filter });
                }
                catch ({ message, statusCode }) {

                    return new Boom(message, { statusCode });
                }
            }
        }
    };
};
