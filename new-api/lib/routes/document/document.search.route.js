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
        tags: ['api'],
        validate: Validator.search,
        handler: async (request) => {

            const { documentService } = await request.services();
            try {
                return await documentService.search({ query: request.payload });
            }
            catch ({ message, statusCode }) {

                return new Boom(message, { statusCode });
            }
        }
    }
};

