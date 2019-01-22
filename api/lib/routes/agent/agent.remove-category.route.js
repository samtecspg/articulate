import Boom from 'boom';
import {
    PARAM_AGENT_ID,
    PARAM_CATEGORY_ID,
    ROUTE_AGENT,
    ROUTE_CATEGORY
} from '../../../util/constants';
import AgentValidator from '../../validators/agent.validator';
//const logger = require('../../../util/logger')({ name: `route:agent:create-webhook` });

module.exports = {
    method: ['delete'],
    path: `/${ROUTE_AGENT}/{${PARAM_AGENT_ID}}/${ROUTE_CATEGORY}/{${PARAM_CATEGORY_ID}}`,
    options: {
        tags: ['api'],
        validate: AgentValidator.removeCategory,
        handler: async (request, h) => {

            const { agentService } = await request.services();
            const {
                [PARAM_AGENT_ID]: agentId,
                [PARAM_CATEGORY_ID]: categoryId
            } = request.params;
            try {
                await agentService.removeCategory({ id: agentId, categoryId });
                return h.continue;
            }
            catch ({ message, statusCode }) {
                return new Boom(message, { statusCode });
            }
        }
    }
};
