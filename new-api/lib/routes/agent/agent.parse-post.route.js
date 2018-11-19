import Boom from 'boom';
import {
    PARAM_AGENT_ID,
    ROUTE_AGENT,
    ROUTE_PARSE
} from '../../../util/constants';
import AgentValidator from '../../validators/agent.validator';

//const logger = require('../../../util/logger')({ name: `route:agent:create` });

module.exports = {
    method: 'post',
    path: `/${ROUTE_AGENT}/{${PARAM_AGENT_ID}}/${ROUTE_PARSE}`,
    options: {
        tags: ['api'],
        validate: AgentValidator.parsePost,
        handler: async (request) => {

            const { agentService } = await request.services();
            const {
                [PARAM_AGENT_ID]: agentId
            } = request.params;
            const {
                text,
                timezone
            } = request.payload;
            try {
                const documentModel = await agentService.parse({ id: agentId, text, timezone, returnModel: true });
                return await documentModel.allProperties();
            }
            catch ({ message, statusCode }) {
                return new Boom(message, { statusCode });
            }
        }
    }
};
