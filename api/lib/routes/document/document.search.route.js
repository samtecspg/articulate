import Boom from 'boom';
import {
    PARAM_SEARCH,
    ROUTE_DOCUMENT
} from '../../../util/constants';
import Validator from '../../validators/document.validator';

module.exports = {
    method: 'post',
    path: `/${ROUTE_DOCUMENT}/${PARAM_SEARCH}`,
    options: {
        description: 'Search',
        tags: ['api'],
        notes: ['Search query over the Document index using full request definition in the Elasticsearch’s Query DSL'],

        validate: Validator.search,
        handler: async (request) => {

            const { documentService } = await request.services();
            try {
                return await documentService.search({ bodyParam: request.payload });
            }
            catch ({ message, statusCode }) {

                return new Boom(message, { statusCode });
            }
        }
    }
};

