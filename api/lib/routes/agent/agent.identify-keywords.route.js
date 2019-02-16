import Boom from 'boom';
import {
    PARAM_AGENT_ID,
    ROUTE_AGENT,
    ROUTE_IDENTIFY_KEYWORDS
} from '../../../util/constants';
import AgentValidator from '../../validators/agent.validator';

//const logger = require('../../../util/logger')({ name: `route:agent:create` });

module.exports = {
    method: 'get',
    path: `/${ROUTE_AGENT}/{${PARAM_AGENT_ID}}/${ROUTE_IDENTIFY_KEYWORDS}`,
    options: {
        tags: ['api'],
        validate: AgentValidator.identifyKeywords,
        handler: async (request) => {

            const { agentService } = await request.services();
            const {
                [PARAM_AGENT_ID]: agentId
            } = request.params;
            const {
                text
            } = request.query;
            try {
                return await agentService.identifyKeywords({ id: agentId, text });
            }
            catch ({ message, statusCode }) {
                return new Boom(message, { statusCode });
            }
        }
    }
};
