import Boom from 'boom';
import {
    PARAM_AGENT_ID,
    PARAM_SESSION,
    PARAM_TEXT,
    PARAM_TIMEZONE,
    ROUTE_AGENT,
    ROUTE_CONVERSE,
    PARAM_DEBUG
} from '../../../util/constants';
import AgentValidator from '../../validators/agent.validator';

//const logger = require('../../../util/logger')({ name: `route:agent:create` });

module.exports = {
    method: 'post',
    path: `/${ROUTE_AGENT}/{${PARAM_AGENT_ID}}/${ROUTE_CONVERSE}`,
    options: {
        tags: ['api'],
        validate: AgentValidator.converse,
        handler: async (request) => {

            const { agentService } = await request.services();
            const {
                [PARAM_AGENT_ID]: agentId
            } = request.params;

            const {
                [PARAM_TEXT]: text,
                [PARAM_TIMEZONE]: timezone,
                [PARAM_SESSION]: sessionId,
                ...rest
            } = request.payload;

            const {
                [PARAM_DEBUG]: debug
            } = request.query;

            try {
                return await agentService.converse({ id: agentId, text, timezone, sessionId, debug, additionalKeys: rest });
            }
            catch ({ message, statusCode }) {
                return new Boom(message, { statusCode });
            }
        }
    }
};
