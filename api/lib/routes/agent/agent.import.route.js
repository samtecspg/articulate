import Boom from 'boom';
import {
    ACL_ACTION_WRITE,
    P_HAPI_GBAC,
    ROUTE_AGENT,
    ROUTE_TO_MODEL
} from '../../../util/constants';
import AgentValidator from '../../validators/agent.validator';

//const logger = require('../../../util/logger')({ name: `route:agent:create` });

module.exports = {
    method: 'post',
    path: `/${ROUTE_AGENT}/import`,
    options: {
        plugins: {
            [P_HAPI_GBAC]: [
                `${ROUTE_TO_MODEL[ROUTE_AGENT]}:${ACL_ACTION_WRITE}`
            ]
        },
        tags: ['api'],
        validate: AgentValidator.import,
        handler: async (request, h) => {

            const { agentService } = await request.services();
            const credential = request.auth.credentials;
            try {
                return await agentService.import({ payload: { ...request.payload, ...{ userCredentials: credential } } });
                //return h.continue;
            }
            catch ({ message, statusCode }) {
                return new Boom(message, { statusCode });
            }
        }
    }
};
