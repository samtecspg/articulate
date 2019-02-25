import Boom from 'boom';
import {
    PARAM_AGENT_ID,
    PARAM_CATEGORY_ID,
    ROUTE_AGENT,
    ROUTE_CATEGORY,
    ROUTE_SAYING
} from '../../../util/constants';
import AgentValidator from '../../validators/agent.validator';
//const logger = require('../../../server/util/logger')({ name: `route:agent:create-webhook` });

module.exports = {
    method: ['post'],
    path: `/${ROUTE_AGENT}/{${PARAM_AGENT_ID}}/${ROUTE_CATEGORY}/{${PARAM_CATEGORY_ID}}/${ROUTE_SAYING}`,
    options: {
        tags: ['api'],
        validate: AgentValidator.createSayingInCategory,
        handler: async (request) => {

            const { agentService } = await request.services();
            const {
                [PARAM_AGENT_ID]: agentId,
                [PARAM_CATEGORY_ID]: categoryId
            } = request.params;
            try {
                return await agentService.upsertSayingInCategory({ id: agentId, categoryId, sayingId: null, sayingData: request.payload });
            }
            catch ({ message, statusCode }) {
                return new Boom(message, { statusCode });
            }
        }
    }
};
