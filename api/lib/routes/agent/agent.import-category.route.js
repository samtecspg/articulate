import Boom from 'boom';
import {
    ACL_ACTION_WRITE,
    P_HAPI_GBAC,
    PARAM_AGENT_ID,
    ROUTE_AGENT,
    ROUTE_CATEGORY,
    ROUTE_TO_MODEL
} from '../../../util/constants';
import AgentValidator from '../../validators/agent.validator';

module.exports = {
    method: 'post',
    path: `/${ROUTE_AGENT}/{${PARAM_AGENT_ID}}/${ROUTE_CATEGORY}/import`,
    options: {
        plugins: {
            [P_HAPI_GBAC]: [
                `${ROUTE_TO_MODEL[ROUTE_AGENT]}:${ACL_ACTION_WRITE}`
            ]
        },
        tags: ['api'],
        validate: AgentValidator.importCategory,
        handler: async (request) => {

            const { agentService } = await request.services();
            const { [PARAM_AGENT_ID]: id } = request.params;
            try {
                return await agentService.importCategory({ id, categoryData: request.payload });
            }
            catch ({ message, statusCode }) {
                return new Boom(message, { statusCode });
            }
        }
    }
};
