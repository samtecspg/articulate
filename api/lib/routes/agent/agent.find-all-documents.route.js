import Boom from 'boom';
import {
    ACL_ACTION_READ,
    P_HAPI_GBAC,
    PARAM_AGENT_ID,
    ROUTE_AGENT,
    ROUTE_DOCUMENT,
    ROUTE_TO_MODEL
} from '../../../util/constants';
import AgentValidator from '../../validators/agent.validator';

module.exports = {
    method: 'get',
    path: `/${ROUTE_AGENT}/{${PARAM_AGENT_ID}}/${ROUTE_DOCUMENT}`,
    options: {
        plugins: {
            [P_HAPI_GBAC]: [
                `${ROUTE_TO_MODEL[ROUTE_AGENT]}:${ACL_ACTION_READ}`
            ]
        },
        tags: ['api'],
        validate: AgentValidator.findAllDocuments,
        handler: async (request) => {

            const { agentService } = await request.services();
            const { [PARAM_AGENT_ID]: id } = request.params;
            const { skip, limit, direction, field, dateRange, filter } = request.query;
            try {
                return await agentService.findAllDocuments({ id, direction, skip, limit, field, dateRange, filter });
            }
            catch ({ message, statusCode }) {
                return new Boom(message, { statusCode });
            }
        }
    }
};
