import Boom from 'boom';
import {
    PARAM_AGENT_ID,
    ROUTE_ACTION,
    ROUTE_AGENT
} from '../../../util/constants';
import AgentValidator from '../../validators/agent.validator';
//const logger = require('../../../util/logger')({ name: `route:agent:create-action` });

module.exports = {
    method: ['post'],
    path: `/${ROUTE_AGENT}/{${PARAM_AGENT_ID}}/${ROUTE_ACTION}`,
    options: {
        tags: ['api'],
        validate: AgentValidator.createAction,
        handler: async (request) => {

            const { agentService } = await request.services();
            const {
                [PARAM_AGENT_ID]: id
            } = request.params;
            try {
                return await agentService.createAction({ id, actionId: null, actionData: request.payload });
            }
            catch ({ message, statusCode }) {
                return new Boom(message, { statusCode });
            }
        }
    }
};
