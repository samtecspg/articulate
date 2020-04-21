import Boom from 'boom';
import {
    ACL_ACTION_WRITE,
    MODEL_AGENT,
    P_HAPI_ABAC,
    P_HAPI_GBAC,
    PARAM_AGENT_ID,
    ROUTE_ACTION,
    ROUTE_AGENT,
    ROUTE_TO_MODEL
} from '../../../util/constants';
import AgentValidator from '../../validators/agent.validator';
//const logger = require('../../../util/logger')({ name: `route:agent:create-action` });

module.exports = {
    method: ['post'],
    path: `/${ROUTE_AGENT}/{${PARAM_AGENT_ID}}/${ROUTE_ACTION}`,
    options: {
        plugins: {
            [P_HAPI_GBAC]: [
                `${ROUTE_TO_MODEL[ROUTE_AGENT]}:${ACL_ACTION_WRITE}`
            ],
            [P_HAPI_ABAC]: [
                `${MODEL_AGENT}:${ACL_ACTION_WRITE}`
            ]
        },
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
