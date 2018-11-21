import Boom from 'boom';
import {
    PARAM_SESSION,
    ROUTE_CONTEXT,
    ROUTE_FRAME
} from '../../../util/constants';
import ContextValidator from '../../validators/context.validator';

module.exports = {
    method: 'delete',
    path: `/${ROUTE_CONTEXT}/{${PARAM_SESSION}}/${ROUTE_FRAME}`,
    options: {
        tags: ['api'],
        validate: ContextValidator.removeBySession,
        handler: async (request, h) => {

            const { contextService } = await request.services();
            const { [PARAM_SESSION]: sessionId } = request.params;
            try {
                await contextService.removeFramesBySessionId({ sessionId });
                return h.continue;
            }
            catch ({ message, statusCode }) {

                return new Boom(message, { statusCode });
            }
        }
    }
};

