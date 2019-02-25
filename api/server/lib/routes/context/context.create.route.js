import Boom from 'boom';
import {
    PARAM_SESSION,
    ROUTE_CONTEXT
} from '../../../util/constants';
import ContextValidator from '../../validators/context.validator';

module.exports = {
    method: 'post',
    path: `/${ROUTE_CONTEXT}`,
    options: {
        tags: ['api'],
        validate: ContextValidator.create,
        handler: async (request) => {

            const { contextService } = await request.services();
            const { [PARAM_SESSION]: sessionId } = request.payload;
            try {
                return await contextService.create({ data: { sessionId } });
            }
            catch ({ message, statusCode }) {

                return new Boom(message, { statusCode });
            }
        }
    }
};

