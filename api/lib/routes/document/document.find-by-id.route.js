import Boom from 'boom';
import {
    PARAM_DOCUMENT_ID,
    ROUTE_DOCUMENT
} from '../../../util/constants';
import Validator from '../../validators/document.validator';

module.exports = {
    method: 'get',
    path: `/${ROUTE_DOCUMENT}/{${PARAM_DOCUMENT_ID}}`,
    options: {
        tags: ['api'],
        validate: Validator.findById,
        handler: async (request) => {

            const { documentService } = await request.services();
            const {
                [PARAM_DOCUMENT_ID]: id
            } = request.params;

            try {
                return await documentService.findById({ id });
            }
            catch ({ message, statusCode }) {

                return new Boom(message, { statusCode });
            }
        }
    }
};

