import Boom from 'boom';
import {
    PARAM_DOCUMENT_ID,
    ROUTE_DOCUMENT
} from '../../../util/constants';
import Validator from '../../validators/document.validator';

module.exports = {
    method: 'put',
    path: `/${ROUTE_DOCUMENT}/{${PARAM_DOCUMENT_ID}}`,
    options: {
        tags: ['api'],
        validate: Validator.update,
        handler: async (request) => {

            const { documentService } = await request.services();
            const {
                [PARAM_DOCUMENT_ID]: id
            } = request.params;
            try {
                return await documentService.update({ id, data: request.payload });
            }
            catch ({ message, statusCode }) {

                return new Boom(message, { statusCode });
            }
        }
    }
};

