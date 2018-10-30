import Boom from 'boom';
import {
    PARAM_AGENT_ID,
    ROUTE_AGENT,
    ROUTE_TRAIN
} from '../../../util/constants';
import AgentValidator from '../../validators/agent.validator';

//const logger = require('../../../util/logger')({ name: `route:agent:create` });

module.exports = {
    method: 'post',
    path: `/${ROUTE_AGENT}/{${PARAM_AGENT_ID}}/{${ROUTE_TRAIN}}`,
    options: {
        tags: ['api'],
        validate: AgentValidator.train,
        handler: async (request) => {

            const { agentService } = await request.services();
            const {
                [PARAM_AGENT_ID]: agentId
            } = request.params;
            try {
                return await agentService.train({ id: agentId });
            }
            catch ({ message, statusCode }) {
                return new Boom(message, { statusCode });
            }
        }
    }
};
