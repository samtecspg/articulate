import Boom from 'boom';
import {
    PARAM_DOCUMENT_ID,
    ROUTE_DOCUMENT,
    ROUTE_INDEX,
    PARAM_INDEX_ID
} from '../../../util/constants';
import Validator from '../../validators/document.validator';

module.exports = {
    method: 'delete',
    path: `/${ROUTE_DOCUMENT}/{${PARAM_DOCUMENT_ID}}/${ROUTE_INDEX}/{${PARAM_INDEX_ID}}`,
    options: {
        tags: ['api'],
        validate: Validator.remove,
        handler: async (request, h) => {

            const { documentService } = await request.services();
            const {
                [PARAM_DOCUMENT_ID]: id,
                [PARAM_INDEX_ID]: indexId
            } = request.params;

            try {
                await documentService.remove({ id, indexId });
                return h.continue;
            }
            catch ({ message, statusCode }) {

                return new Boom(message, { statusCode });
            }
        }
    }
};

