import Boom from 'boom';
import {
    ACL_ACTION_CONVERSE,
    ACL_ACTION_WRITE,
    MODEL_AGENT,
    P_HAPI_ABAC,
    P_HAPI_GBAC,
    PARAM_AGENT_ID,
    PARAM_DEBUG,
    ROUTE_AGENT,
    ROUTE_TEST_TRAIN,
    ROUTE_TO_MODEL
} from '../../../util/constants';
import AgentValidator from '../../validators/agent.validator';

//const logger = require('../../../util/logger')({ name: `route:agent:create` });

module.exports = {
    method: 'get',
    path: `/${ROUTE_AGENT}/{${PARAM_AGENT_ID}}/${ROUTE_TEST_TRAIN}`,
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
        validate: AgentValidator.testTrain,
        handler: async (request) => {

            const { agentService } = await request.services();
            const {
                [PARAM_AGENT_ID]: agentId
            } = request.params;

            const {
                [PARAM_DEBUG]: debug
            } = request.query;

            try {
                return await agentService.testTrain({ id: agentId, debug });
            }
            catch ({ message, statusCode }) {
                return new Boom(message, { statusCode });
            }
        }
    }
};
