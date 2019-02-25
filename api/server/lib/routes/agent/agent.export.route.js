import Boom from 'boom';
import {
    PARAM_AGENT_ID,
    ROUTE_AGENT
} from '../../../util/constants';
import AgentValidator from '../../validators/agent.validator';

//const logger = require('../../../server/util/logger')({ name: `route:agent:create` });

module.exports = {
    method: 'get',
    path: `/${ROUTE_AGENT}/{${PARAM_AGENT_ID}}/export`,
    options: {
        tags: ['api'],
        validate: AgentValidator.export,
        handler: async (request) => {

            const { agentService } = await request.services();
            const { [PARAM_AGENT_ID]: id } = request.params;
            try {
                return await agentService.export({ id });
            }
            catch ({ message, statusCode }) {
                return new Boom(message, { statusCode });
            }
        }
    }
};
