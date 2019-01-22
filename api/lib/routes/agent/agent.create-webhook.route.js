import Boom from 'boom';
import {
    PARAM_AGENT_ID,
    ROUTE_AGENT,
    ROUTE_WEBHOOK
} from '../../../util/constants';
import AgentValidator from '../../validators/agent.validator';
//const logger = require('../../../util/logger')({ name: `route:agent:create-webhook` });

module.exports = {
    method: 'post',
    path: `/${ROUTE_AGENT}/{${PARAM_AGENT_ID}}/${ROUTE_WEBHOOK}`,
    options: {
        tags: ['api'],
        validate: AgentValidator.addWebhook,
        handler: async (request) => {

            const { agentService } = await request.services();
            const { [PARAM_AGENT_ID]: id } = request.params;
            try {
                return await agentService.createWebhook({ id, webhookData: request.payload });
            }
            catch ({ message, statusCode }) {
                return new Boom(message, { statusCode });
            }
        }
    }
};
