import Boom from 'boom';
import {
    PARAM_ACTION_ID,
    PARAM_AGENT_ID,
    ROUTE_ACTION,
    ROUTE_AGENT,
    ROUTE_WEBHOOK
} from '../../../util/constants';
import AgentValidator from '../../validators/agent.validator';
//const logger = require('../../../server/util/logger')({ name: `route:agent:create-webhook` });

module.exports = {
    method: 'post',
    path: `/${ROUTE_AGENT}/{${PARAM_AGENT_ID}}/${ROUTE_ACTION}/{${PARAM_ACTION_ID}}/${ROUTE_WEBHOOK}`,
    options: {
        tags: ['api'],
        validate: AgentValidator.addWebhookInAction,
        handler: async (request) => {

            const { agentService } = await request.services();
            const {
                [PARAM_AGENT_ID]: agentId,
                [PARAM_ACTION_ID]: actionId
            } = request.params;
            try {
                return await agentService.upsertWebhookInAction({ id: agentId, actionId, data: request.payload });
            }
            catch ({ message, statusCode }) {
                return new Boom(message, { statusCode });
            }
        }
    }
};
