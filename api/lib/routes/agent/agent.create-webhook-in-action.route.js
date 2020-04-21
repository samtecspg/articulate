import Boom from 'boom';
import {
    ACL_ACTION_WRITE,
    MODEL_AGENT,
    P_HAPI_ABAC,
    P_HAPI_GBAC,
    PARAM_ACTION_ID,
    PARAM_AGENT_ID,
    ROUTE_ACTION,
    ROUTE_AGENT,
    ROUTE_TO_MODEL,
    ROUTE_WEBHOOK
} from '../../../util/constants';
import AgentValidator from '../../validators/agent.validator';
//const logger = require('../../../util/logger')({ name: `route:agent:create-webhook` });

module.exports = {
    method: 'post',
    path: `/${ROUTE_AGENT}/{${PARAM_AGENT_ID}}/${ROUTE_ACTION}/{${PARAM_ACTION_ID}}/${ROUTE_WEBHOOK}`,
    options: {
        plugins: {
            [P_HAPI_GBAC]: [
                `${ROUTE_TO_MODEL[ROUTE_AGENT]}:${ACL_ACTION_WRITE}`
            ],
            [P_HAPI_ABAC]: [
                `${MODEL_AGENT}:${ACL_ACTION_WRITE}`
            ]
        },
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
