import Boom from 'boom';
import {
    PARAM_ACTION_ID,
    PARAM_AGENT_ID,
    ROUTE_ACTION,
    ROUTE_AGENT,
    ROUTE_WEBHOOK
} from '../../../util/constants';
import AgentValidator from '../../validators/agent.validator';
//const logger = require('../../../util/logger')({ name: `route:agent:create-webhook` });

module.exports = {
    method: ['delete'],
    path: `/${ROUTE_AGENT}/{${PARAM_AGENT_ID}}/${ROUTE_ACTION}/{${PARAM_ACTION_ID}}/${ROUTE_WEBHOOK}`,
    options: {
        tags: ['api'],
        validate: AgentValidator.removeWebhookInAction,
        handler: async (request, h) => {

            const { agentService } = await request.services();
            const {
                [PARAM_AGENT_ID]: agentId,
                [PARAM_ACTION_ID]: actionId
            } = request.params;
            try {
                await agentService.removeWebhookInAction({ id: agentId, actionId });
                return h.continue;
            }
            catch ({ message, statusCode }) {
                return new Boom(message, { statusCode });
            }
        }
    }
};
