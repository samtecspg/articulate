import Boom from 'boom';
import {
    PARAM_DOCUMENT_ID,
    ROUTE_DOCUMENT,
    PARAM_INDEX_ID,
    ROUTE_INDEX
} from '../../../util/constants';
import Validator from '../../validators/document.validator';

module.exports = {
    method: 'put',
    path: `/${ROUTE_DOCUMENT}/{${PARAM_DOCUMENT_ID}}/${ROUTE_INDEX}/{${PARAM_INDEX_ID}}`,
    options: {
        tags: ['api'],
        validate: Validator.update,
        handler: async (request) => {

            const { documentService } = await request.services();
            const {
                [PARAM_DOCUMENT_ID]: id,
                [PARAM_INDEX_ID]: indexId
            } = request.params;
            try {
                return await documentService.update({ id, indexId, data: request.payload });
            }
            catch ({ message, statusCode }) {

                return new Boom(message, { statusCode });
            }
        }
    }
};

