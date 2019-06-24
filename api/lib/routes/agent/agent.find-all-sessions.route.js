import Boom from 'boom';
import {
    PARAM_AGENT_ID,
    ROUTE_AGENT,
    ROUTE_SESSION
} from '../../../util/constants';
import AgentValidator from '../../validators/agent.validator';

module.exports = {
    method: 'get',
    path: `/${ROUTE_AGENT}/{${PARAM_AGENT_ID}}/${ROUTE_SESSION}`,
    options: {
        tags: ['api'],
        validate: AgentValidator.findAllSessions,
        handler: async (request) => {

            const { agentService } = await request.services();
            const { [PARAM_AGENT_ID]: id } = request.params;
            const { skip, limit, direction, field } = request.query;
            try {
                return await agentService.findAllSessions({ id, direction, skip, limit, field });
            }
            catch ({ message, statusCode }) {
                return new Boom(message, { statusCode });
            }
        }
    }
};
