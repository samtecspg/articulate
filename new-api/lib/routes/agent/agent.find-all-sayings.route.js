import Boom from 'boom';
import {
    PARAM_AGENT_ID,
    ROUTE_AGENT,
    ROUTE_SAYING
} from '../../../util/constants';
import AgentValidator from '../../validators/agent.validator';

module.exports = {
    method: 'get',
    path: `/${ROUTE_AGENT}/{${PARAM_AGENT_ID}}/${ROUTE_SAYING}`,
    options: {
        tags: ['api'],
        validate: AgentValidator.findAllSayings,
        handler: async (request) => {

            const { agentService } = await request.services();
            const { [PARAM_AGENT_ID]: id } = request.params;
            const { skip, limit, direction, field, loadDomainId } = request.query;
            try {
                return await agentService.findAllSayings({ id, loadDomainId, skip, limit, direction, field });
            }
            catch ({ message, statusCode }) {
                return new Boom(message, { statusCode });
            }
        }
    }
};
