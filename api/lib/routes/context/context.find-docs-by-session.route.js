import Boom from 'boom';
import {
    PARAM_SESSION,
    ROUTE_CONTEXT,
    ROUTE_DOCUMENT
} from '../../../util/constants';
import ContextValidator from '../../validators/context.validator';

module.exports = {
    method: 'get',
    path: `/${ROUTE_CONTEXT}/{${PARAM_SESSION}}/${ROUTE_DOCUMENT}`,
    options: {
        tags: ['api'],
        validate: ContextValidator.findDocsBySession,
        handler: async (request) => {

            const { contextService } = await request.services();
            const {
                [PARAM_SESSION]: sessionId
            } = request.params;
            try {
                return await contextService.findDocsBySession({ sessionId });
            }
            catch ({ message, statusCode }) {

                return new Boom(message, { statusCode });
            }
        }
    }
};

