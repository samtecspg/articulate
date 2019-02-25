import Boom from 'boom';
import {
    PARAM_AGENT_ID,
    PARAM_KEYWORD_ID,
    ROUTE_AGENT,
    ROUTE_KEYWORD
} from '../../../util/constants';
import AgentValidator from '../../validators/agent.validator';

//const logger = require('../../../server/util/logger')({ name: `route:agent:create` });

module.exports = {
    method: 'put',
    path: `/${ROUTE_AGENT}/{${PARAM_AGENT_ID}}/${ROUTE_KEYWORD}/{${PARAM_KEYWORD_ID}}`,
    options: {
        tags: ['api'],
        validate: AgentValidator.updateKeyword,
        handler: async (request) => {

            const { agentService } = await request.services();
            const {
                [PARAM_AGENT_ID]: id,
                [PARAM_KEYWORD_ID]: keywordId
            } = request.params;
            try {
                return await agentService.updateKeyword({ id, keywordId, keywordData: request.payload });
            }
            catch ({ message, statusCode }) {
                return new Boom(message, { statusCode });
            }
        }
    }
};
