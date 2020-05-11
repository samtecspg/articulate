import Boom from 'boom';
import {
    ACL_ACTION_WRITE,
    ACL_ACTION_CONVERSE,
    MODEL_AGENT,
    P_HAPI_ABAC,
    P_HAPI_GBAC,
    PARAM_AGENT_ID,
    PARAM_KEYWORD_ID,
    ROUTE_AGENT,
    ROUTE_AGENT_VERSION,
    ROUTE_TO_MODEL,
    PARAM_AGENT_VERSION_ID,
    MODEL_AGENT_VERSION
} from '../../../util/constants';
import AgentValidator from '../../validators/agent.validator';

//const logger = require('../../../util/logger')({ name: `route:agent:create` });

module.exports = {
    method: 'put',
    path: `/${ROUTE_AGENT}/{${PARAM_AGENT_ID}}/${ROUTE_AGENT_VERSION}/{${PARAM_AGENT_VERSION_ID}}`,
    options: {
        plugins: {
            [P_HAPI_GBAC]: [
                `${ROUTE_TO_MODEL[ROUTE_AGENT]}:${ACL_ACTION_WRITE}`,
                `${ROUTE_TO_MODEL[ROUTE_AGENT]}:${ACL_ACTION_CONVERSE}`
            ],
            [P_HAPI_ABAC]: [
                `${MODEL_AGENT}:${ACL_ACTION_WRITE}`,
                `${MODEL_AGENT}:${ACL_ACTION_CONVERSE}`
            ]
        },
        tags: ['api'],
        validate: AgentValidator.updateAgentVersion,
        handler: async (request) => {

            const { agentService } = await request.services();
            const {
                [PARAM_AGENT_ID]: id,
                [PARAM_AGENT_VERSION_ID]: agentVersionId
            } = request.params;
            try {
                return await agentService.updateAgentVersion({ id, agentVersionId, agentVersionData: request.payload });
            }
            catch ({ message, statusCode }) {
                return new Boom(message, { statusCode });
            }
        }
    }
};
