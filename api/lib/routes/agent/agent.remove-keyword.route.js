import Boom from 'boom';
import {
    ACL_ACTION_WRITE,
    MODEL_AGENT,
    P_HAPI_ABAC,
    P_HAPI_GBAC,
    PARAM_AGENT_ID,
    PARAM_KEYWORD_ID,
    ROUTE_AGENT,
    ROUTE_KEYWORD,
    ROUTE_TO_MODEL
} from '../../../util/constants';
import AgentValidator from '../../validators/agent.validator';
//const logger = require('../../../util/logger')({ name: `route:agent:create-webhook` });

module.exports = {
    method: ['delete'],
    path: `/${ROUTE_AGENT}/{${PARAM_AGENT_ID}}/${ROUTE_KEYWORD}/{${PARAM_KEYWORD_ID}}`,
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
