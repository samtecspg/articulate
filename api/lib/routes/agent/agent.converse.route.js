import Boom from 'boom';
import {
    ACL_ACTION_CONVERSE,
    ACL_ACTION_WRITE,
    MODEL_AGENT,
    P_HAPI_ABAC,
    P_HAPI_GBAC,
    PARAM_AGENT_ID,
    PARAM_DEBUG,
    PARAM_SESSION,
    PARAM_TEXT,
    PARAM_TIMEZONE,
    ROUTE_AGENT,
    ROUTE_CONVERSE,
    ROUTE_TO_MODEL
} from '../../../util/constants';
import AgentValidator from '../../validators/agent.validator';

//const logger = require('../../../util/logger')({ name: `route:agent:create` });

module.exports = {
    method: 'post',
    path: `/${ROUTE_AGENT}/{${PARAM_AGENT_ID}}/${ROUTE_CONVERSE}`,
    options: {
        plugins: {
            [P_HAPI_GBAC]: [
                `${ROUTE_TO_MODEL[ROUTE_AGENT]}:${ACL_ACTION_WRITE}`
            ],
            [P_HAPI_ABAC]: [
                `${MODEL_AGENT}:${ACL_ACTION_CONVERSE}`
            ]
        },
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
