import Boom from 'boom';
import {
    PARAM_SESSION,
    ROUTE_CONTEXT,
    ROUTE_FRAME
} from '../../../util/constants';
import ContextValidator from '../../validators/context.validator';

module.exports = {
    method: 'post',
    path: `/${ROUTE_CONTEXT}/{${PARAM_SESSION}}/${ROUTE_FRAME}`,
    options: {
        tags: ['api'],
        validate: ContextValidator.createFrameBySession,
        handler: async (request) => {

            const { contextService } = await request.services();
            const {
                [PARAM_SESSION]: sessionId
            } = request.params;
            try {
                return await contextService.createFrame({ sessionId, frameData: request.payload });
            }
            catch ({ message, statusCode }) {

                return new Boom(message, { statusCode });
            }
        }
    }
};

