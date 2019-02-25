import Boom from 'boom';
import {
    PARAM_AGENT_ID,
    PARAM_KEYWORD_ID,
    ROUTE_AGENT,
    ROUTE_KEYWORD
} from '../../../util/constants';
import AgentValidator from '../../validators/agent.validator';
//const logger = require('../../../server/util/logger')({ name: `route:agent:create-webhook` });

module.exports = {
    method: ['delete'],
    path: `/${ROUTE_AGENT}/{${PARAM_AGENT_ID}}/${ROUTE_KEYWORD}/{${PARAM_KEYWORD_ID}}`,
    options: {
        tags: ['api'],
        validate: AgentValidator.removeKeyword,
        handler: async (request, h) => {

            const { agentService } = await request.services();
            const {
                [PARAM_AGENT_ID]: agentId,
                [PARAM_KEYWORD_ID]: keywordId
            } = request.params;
            try {
                await agentService.removeKeyword({ id: agentId, keywordId });
                return h.continue;
            }
            catch ({ message, statusCode }) {
                return new Boom(message, { statusCode });
            }
        }
    }
};
