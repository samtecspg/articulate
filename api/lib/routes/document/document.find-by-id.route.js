import Boom from 'boom';
import {
    PARAM_DOCUMENT_ID,
    ROUTE_DOCUMENT,
    ROUTE_INDEX,
    PARAM_INDEX_ID
} from '../../../util/constants';
import Validator from '../../validators/document.validator';

module.exports = {
    method: 'get',
    path: `/${ROUTE_DOCUMENT}/{${PARAM_DOCUMENT_ID}}/${ROUTE_INDEX}/{${PARAM_INDEX_ID}}`,
    options: {
        tags: ['api'],
        validate: Validator.findById,
        handler: async (request) => {

            const { documentService } = await request.services();
            const {
                [PARAM_DOCUMENT_ID]: id,
                [PARAM_INDEX_ID]: indexId
            } = request.params;

            try {
                return await documentService.findById({ id, indexId });
            }
            catch ({ message, statusCode }) {

                return new Boom(message, { statusCode });
            }
        }
    }
};

