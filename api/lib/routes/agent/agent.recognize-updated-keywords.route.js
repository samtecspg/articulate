import Boom from 'boom';
import {
    PARAM_AGENT_ID,
    ROUTE_AGENT,
    RECOGNIZE_UPDATED_KEYWORDS
} from '../../../util/constants';
import AgentValidator from '../../validators/agent.validator';

module.exports = {
    method: 'put',
    path: `/${ROUTE_AGENT}/{${PARAM_AGENT_ID}}/${RECOGNIZE_UPDATED_KEYWORDS}`,
    options: {
        tags: ['api'],
        validate: AgentValidator.recognizeUpdatedKeywords,
        handler: async (request) => {

            const { agentService } = await request.services();
            const {
                [PARAM_AGENT_ID]: agentId
            } = request.params;
            const {
                payload
            } = request;
            try {
                return await agentService.recognizeUpdatedKeywords({ id: agentId, payload });
            }
            catch ({ message, statusCode }) {
                return new Boom(message, { statusCode });
            }
        }
    }
};
