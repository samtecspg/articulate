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

//const logger = require('../../../util/logger')({ name: `route:agent:create` });

module.exports = {
    method: 'put',
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
        validate: AgentValidator.updateKeyword,
        handler: async (request) => {

            const { agentService } = await request.services();
            const {
                [PARAM_AGENT_ID]: id,
                [PARAM_KEYWORD_ID]: keywordId
            } = request.params;
            try {
                return await agentService.updateKeyword({ id, keywordId, keywordData: request.payload });
            }
            catch ({ message, statusCode }) {
                return new Boom(message, { statusCode });
            }
        }
    }
};
