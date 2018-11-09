import Boom from 'boom';
import {
    PARAM_AGENT_ID,
    ROUTE_AGENT,
    ROUTE_PARSE
} from '../../../util/constants';
import AgentValidator from '../../validators/agent.validator';

//const logger = require('../../../util/logger')({ name: `route:agent:create` });

module.exports = {
    method: 'get',
    path: `/${ROUTE_AGENT}/{${PARAM_AGENT_ID}}/${ROUTE_PARSE}`,
    options: {
        tags: ['api'],
        validate: AgentValidator.parseGet,
        handler: async (request) => {

            const { agentService } = await request.services();
            const {
                [PARAM_AGENT_ID]: agentId
            } = request.params;
            const {
                text,
                timezone
            } = request.query;
            try {
                return await agentService.parse({ id: agentId, text, timezone, returnModel: true });
            }
            catch ({ message, statusCode }) {
                return new Boom(message, { statusCode });
            }
        }
    }
};
