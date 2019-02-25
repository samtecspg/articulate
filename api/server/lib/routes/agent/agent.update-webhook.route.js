import Boom from 'boom';
import {
    PARAM_AGENT_ID,
    ROUTE_AGENT,
    ROUTE_WEBHOOK
} from '../../../util/constants';
import AgentValidator from '../../validators/agent.validator';

//const logger = require('../../../server/util/logger')({ name: `route:agent:create` });

module.exports = {
    method: 'put',
    path: `/${ROUTE_AGENT}/{${PARAM_AGENT_ID}}/${ROUTE_WEBHOOK}`,
    options: {
        tags: ['api'],
        validate: AgentValidator.updateWebhook,
        handler: async (request) => {

            const { agentService } = await request.services();
            const { [PARAM_AGENT_ID]: id } = request.params;
            try {
                return await agentService.updateWebhook({ id, webhookData: request.payload });
            }
            catch ({ message, statusCode }) {
                return new Boom(message, { statusCode });
            }
        }
    }
};
