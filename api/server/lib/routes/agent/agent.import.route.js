import Boom from 'boom';
import { ROUTE_AGENT } from '../../../util/constants';
import AgentValidator from '../../validators/agent.validator';

//const logger = require('../../../server/util/logger')({ name: `route:agent:create` });

module.exports = {
    method: 'post',
    path: `/${ROUTE_AGENT}/import`,
    options: {
        tags: ['api'],
        validate: AgentValidator.import,
        handler: async (request, h) => {

            const { agentService } = await request.services();
            try {
                return await agentService.import({ payload: request.payload });
                //return h.continue;
            }
            catch ({ message, statusCode }) {
                return new Boom(message, { statusCode });
            }
        }
    }
};
