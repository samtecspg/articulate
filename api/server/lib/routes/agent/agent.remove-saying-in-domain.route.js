import Boom from 'boom';
import {
    PARAM_AGENT_ID,
    PARAM_CATEGORY_ID,
    PARAM_SAYING_ID,
    ROUTE_AGENT,
    ROUTE_CATEGORY,
    ROUTE_SAYING
} from '../../../util/constants';
import AgentValidator from '../../validators/agent.validator';
//const logger = require('../../../server/util/logger')({ name: `route:agent:create-webhook` });

module.exports = {
    method: ['delete'],
    path: `/${ROUTE_AGENT}/{${PARAM_AGENT_ID}}/${ROUTE_CATEGORY}/{${PARAM_CATEGORY_ID}}/${ROUTE_SAYING}/{${PARAM_SAYING_ID}}`,
    options: {
        tags: ['api'],
        validate: AgentValidator.removeSayingInCategory,
        handler: async (request, h) => {

            const { agentService } = await request.services();
            const {
                [PARAM_AGENT_ID]: agentId,
                [PARAM_CATEGORY_ID]: categoryId,
                [PARAM_SAYING_ID]: sayingId
            } = request.params;
            try {
                await agentService.removeSayingInCategory({ id: agentId, categoryId, sayingId });
                return h.continue;
            }
            catch ({ message, statusCode }) {
                return new Boom(message, { statusCode });
            }
        }
    }
};
