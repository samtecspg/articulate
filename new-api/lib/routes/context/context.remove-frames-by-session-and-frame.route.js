import Boom from 'boom';
import {
    PARAM_SESSION,
    PARAM_FRAME,
    ROUTE_CONTEXT,
    ROUTE_FRAME
} from '../../../util/constants';
import ContextValidator from '../../validators/context.validator';

module.exports = {
    method: 'delete',
    path: `/${ROUTE_CONTEXT}/{${PARAM_SESSION}}/${ROUTE_FRAME}/{${PARAM_FRAME}}`,
    options: {
        tags: ['api'],
        validate: ContextValidator.removeBySessionAndFrame,
        handler: async (request, h) => {

            const { contextService } = await request.services();
            const { [PARAM_SESSION]: sessionId, [PARAM_FRAME]: frameId } = request.params;
            try {
                await contextService.removeFramesBySessionIdAndFrameId({ sessionId, frameId });
                return h.continue;
            }
            catch ({ message, statusCode }) {

                return new Boom(message, { statusCode });
            }
        }
    }
};

