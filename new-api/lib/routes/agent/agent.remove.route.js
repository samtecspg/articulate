import Boom from 'boom';
import {
    PARAM_AGENT_ID,
    ROUTE_AGENT
} from '../../../util/constants';
import AgentValidator from '../../validators/agent.validator';

//const logger = require('../../../util/logger')({ name: `route:agent:removeById` });

module.exports = {
    method: 'delete',
    path: `/${ROUTE_AGENT}/{${PARAM_AGENT_ID}}`,
    options: {
        tags: ['api'],
        validate: AgentValidator.remove,
        handler: async (request, h) => {

            const { agentService } = await request.services();
            const { [PARAM_AGENT_ID]: id } = request.params;
            try {
                await agentService.remove({ id });
                return h.continue;
            }
            catch ({ message, statusCode }) {
                return new Boom(message, { statusCode });
            }
        }
    }
};
