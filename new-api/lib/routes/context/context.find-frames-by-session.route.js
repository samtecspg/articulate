import Boom from 'boom';
import {
    PARAM_SESSION,
    ROUTE_CONTEXT,
    ROUTE_FRAME
} from '../../../util/constants';
import ContextValidator from '../../validators/context.validator';

module.exports = {
    method: 'get',
    path: `/${ROUTE_CONTEXT}/{${PARAM_SESSION}}/${ROUTE_FRAME}`,
    options: {
        tags: ['api'],
        validate: ContextValidator.findFramesBySession,
        handler: async (request) => {

            const { contextService } = await request.services();
            const {
                [PARAM_SESSION]: sessionId
            } = request.params;
            const {
                skip,
                limit,
                direction,
                field
            } = request.query;
            try {
                return await contextService.findFramesBySession({ sessionId, skip, limit, direction, field });
            }
            catch ({ message, statusCode }) {

                return new Boom(message, { statusCode });
            }
        }
    }
};

