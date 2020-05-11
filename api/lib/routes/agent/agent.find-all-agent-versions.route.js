import Boom from 'boom';
import {
    ACL_ACTION_READ,
    P_HAPI_GBAC,
    PARAM_AGENT_ID,
    ROUTE_AGENT,
    ROUTE_TO_MODEL,
    ROUTE_AGENT_VERSION
} from '../../../util/constants';
import AgentValidator from '../../validators/agent.validator';

module.exports = {
    method: 'get',
    path: `/${ROUTE_AGENT}/{${PARAM_AGENT_ID}}/${ROUTE_AGENT_VERSION}`,
    options: {
        plugins: {
            [P_HAPI_GBAC]: [
                `${ROUTE_TO_MODEL[ROUTE_AGENT]}:${ACL_ACTION_READ}`
            ]
        },
        tags: ['api'],
        validate: AgentValidator.findAllAgentVersions,
        handler: async (request) => {

            const { agentService } = await request.services();
            const { [PARAM_AGENT_ID]: id } = request.params;
            const { skip, limit, direction, field, filter } = request.query;
            try {
                return await agentService.findAllAgentVersions({ id, direction, skip, limit, field, filter });
            }
            catch ({ message, statusCode }) {
                return new Boom(message, { statusCode });
            }
        }
    }
};
