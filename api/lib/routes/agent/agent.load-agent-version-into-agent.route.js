import Boom from 'boom';
import {
    ACL_ACTION_WRITE,
    P_HAPI_GBAC,
    ROUTE_AGENT,
    ROUTE_TO_MODEL,
    ROUTE_AGENT_VERSION,
    PARAM_AGENT_VERSION_ID,
    PARAM_AGENT_ID
} from '../../../util/constants';
import AgentValidator from '../../validators/agent.validator';

//const logger = require('../../../util/logger')({ name: `route:agent:create` });

module.exports = {
    method: 'put',
    path: `/${ROUTE_AGENT}/{${PARAM_AGENT_ID}}/${ROUTE_AGENT_VERSION}/{${PARAM_AGENT_VERSION_ID}}/load`,
    options: {
        plugins: {
            [P_HAPI_GBAC]: [
                `${ROUTE_TO_MODEL[ROUTE_AGENT_VERSION]}:${ACL_ACTION_WRITE}`
            ]
        },
        tags: ['api'],
        validate: AgentValidator.loadAgentVersionIntoAgent,
        handler: async (request, h) => {

            const { agentService } = await request.services();
            const credential = request.auth.credentials;
            const {
                [PARAM_AGENT_ID]: id,
                [PARAM_AGENT_VERSION_ID]: agentVersionId
            } = request.params;
            try {
                return await agentService.loadAgentVersionIntoAgent({ id, agentVersionId });
            }
            catch ({ message, statusCode }) {
                return new Boom(message, { statusCode });
            }
        }
    }
};
