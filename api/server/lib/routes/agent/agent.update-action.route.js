import Boom from 'boom';
import {
    PARAM_ACTION_ID,
    PARAM_AGENT_ID,
    ROUTE_ACTION,
    ROUTE_AGENT
} from '../../../util/constants';
import AgentValidator from '../../validators/agent.validator';
//const logger = require('../../../server/util/logger')({ name: `route:agent:create-action` });

module.exports = {
    method: ['put'],
    path: `/${ROUTE_AGENT}/{${PARAM_AGENT_ID}}/${ROUTE_ACTION}/{${PARAM_ACTION_ID}}`,
    options: {
        tags: ['api'],
        validate: AgentValidator.updateAction,
        handler: async (request) => {

            const { agentService } = await request.services();
            const {
                [PARAM_AGENT_ID]: id,
                [PARAM_ACTION_ID]: actionId
            } = request.params;
            try {
                return await agentService.updateAction({ id, actionId, actionData: request.payload });
            }
            catch ({ message, statusCode }) {
                return new Boom(message, { statusCode });
            }
        }
    }
};
