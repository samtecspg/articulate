import Boom from 'boom';
import {
    PARAM_ACTION_ID,
    PARAM_AGENT_ID,
    ROUTE_ACTION,
    ROUTE_AGENT,
    ROUTE_POST_FORMAT
} from '../../../util/constants';
import AgentValidator from '../../validators/agent.validator';
//const logger = require('../../../util/logger')({ name: `route:agent:create-webhook` });

module.exports = {
    method: ['put', 'post'],
    path: `/${ROUTE_AGENT}/{${PARAM_AGENT_ID}}/${ROUTE_ACTION}/{${PARAM_ACTION_ID}}/${ROUTE_POST_FORMAT}`,
    options: {
        tags: ['api'],
        validate: AgentValidator.addPostFormatInAction,
        handler: async (request) => {

            const { agentService } = await request.services();
            const {
                [PARAM_AGENT_ID]: agentId,
                [PARAM_ACTION_ID]: actionId
            } = request.params;
            try {
                return await agentService.upsertPostFormatInAction({ id: agentId, actionId, postFormatData: request.payload });
            }
            catch ({ message, statusCode }) {
                return new Boom(message, { statusCode });
            }
        }
    }
};
