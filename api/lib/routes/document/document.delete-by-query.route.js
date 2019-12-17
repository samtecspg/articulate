import Boom from 'boom';
import {
    ROUTE_DOCUMENT,
    PARAM_DELETE_BY_QUERY
} from '../../../util/constants';
import Validator from '../../validators/document.validator';

module.exports = {
    method: 'post',
    path: `/${ROUTE_DOCUMENT}/${PARAM_DELETE_BY_QUERY}`,
    options: {
        description: 'DeleteByQuery',
        tags: ['api'],
        notes: ['Deletes all the Document index matching query in Elasticsearch’s Query DSL'],

        validate: Validator.search,
        handler: async (request) => {

            const { documentService } = await request.services();
            try {
                return await documentService.deleteByQuery({ body: request.payload });
            }
            catch ({ message, statusCode }) {

                return new Boom(message, { statusCode });
            }
        }
    }
};

