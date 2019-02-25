import Boom from 'boom';
import { ROUTE_AGENT } from '../../../util/constants';
import AgentValidator from '../../validators/agent.validator';

//const logger = require('../../../server/util/logger')({ name: `route:agent:create` });

module.exports = {
    method: 'post',
    path: `/${ROUTE_AGENT}`,
    options: {
        tags: ['api'],
        validate: AgentValidator.create,
        handler: async (request) => {

            const { agentService } = await request.services();
            try {
                return await agentService.create({ data: request.payload });
            }
            catch ({ message, statusCode }) {
                return new Boom(message, { statusCode });
            }
        }
    }
};
