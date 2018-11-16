import Boom from 'boom';
import {
    PARAM_LOAD_FRAMES,
    PARAM_SESSION,
    ROUTE_CONTEXT
} from '../../../util/constants';
import ContextValidator from '../../validators/context.validator';

module.exports = {
    method: 'get',
    path: `/${ROUTE_CONTEXT}/{${PARAM_SESSION}}`,
    options: {
        tags: ['api'],
        validate: ContextValidator.findBySession,
        handler: async (request) => {

            const { contextService } = await request.services();
            const {
                [PARAM_SESSION]: sessionId
            } = request.params;
            const {
                [PARAM_LOAD_FRAMES]: loadFrames
            } = request.query;
            try {
                return await contextService.findBySession({ sessionId, loadFrames });
            }
            catch ({ message, statusCode }) {

                return new Boom(message, { statusCode });
            }
        }
    }
};

