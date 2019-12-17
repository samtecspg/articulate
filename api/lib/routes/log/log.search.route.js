import Boom from 'boom';
import {
    PARAM_SEARCH,
    ROUTE_LOG
} from '../../../util/constants';
import Validator from '../../validators/log.validator';

module.exports = {
    method: 'post',
    path: `/${ROUTE_LOG}/${PARAM_SEARCH}`,
    options: {
        description: 'Search',
        tags: ['api'],
        notes: ['Search query over the Log index using full request definition in the Elasticsearch’s Query DSL'],

        validate: Validator.search,
        handler: async (request) => {

            const { logService } = await request.services();
            try {
                return await logService.search({ bodyParam: request.payload });
            }
            catch ({ message, statusCode }) {

                return new Boom(message, { statusCode });
            }
        }
    }
};

