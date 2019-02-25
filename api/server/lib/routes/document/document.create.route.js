import Boom from 'boom';
import { ROUTE_DOCUMENT } from '../../../util/constants';
import Validator from '../../validators/document.validator';

module.exports = {
    method: 'post',
    path: `/${ROUTE_DOCUMENT}`,
    options: {
        tags: ['api'],
        validate: Validator.create,
        handler: async (request) => {

            const { documentService } = await request.services();

            try {
                return await documentService.create({ data: request.payload });
            }
            catch ({ message, statusCode }) {

                return new Boom(message, { statusCode });
            }
        }
    }
};

