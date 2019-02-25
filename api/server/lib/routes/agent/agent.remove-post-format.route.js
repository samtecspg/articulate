import Boom from 'boom';
import {
    PARAM_AGENT_ID,
    ROUTE_AGENT,
    ROUTE_POST_FORMAT
} from '../../../util/constants';
import AgentValidator from '../../validators/agent.validator';
//const logger = require('../../../server/util/logger')({ name: `route:agent:create` });

module.exports = {
    method: 'delete',
    path: `/${ROUTE_AGENT}/{${PARAM_AGENT_ID}}/${ROUTE_POST_FORMAT}`,
    options: {
        tags: ['api'],
        validate: AgentValidator.removePostFormat,
        handler: async (request, h) => {

            const { agentService } = await request.services();
            const { [PARAM_AGENT_ID]: id } = request.params;
            try {
                await agentService.removePostFormat({ id });
                return h.continue;
            }
            catch ({ message, statusCode }) {
                return new Boom(message, { statusCode });
            }
        }
    }
};
