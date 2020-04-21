import Boom from 'boom';
import {
    ACL_ACTION_READ,
    P_HAPI_GBAC,
    PARAM_AGENT_ID,
    ROUTE_AGENT,
    ROUTE_SETTINGS,
    ROUTE_TO_MODEL
} from '../../../util/constants';
import AgentValidator from '../../validators/agent.validator';

//const logger = require('../../../util/logger')({ name: `route:agent:create` });

module.exports = {
    method: 'get',
    path: `/${ROUTE_AGENT}/{${PARAM_AGENT_ID}}/${ROUTE_SETTINGS}`,
    options: {
        plugins: {
            [P_HAPI_GBAC]: [
                `${ROUTE_TO_MODEL[ROUTE_AGENT]}:${ACL_ACTION_READ}`
            ]
        },
        tags: ['api'],
        validate: AgentValidator.findAllSettings,
        handler: async (request) => {

            const { agentService } = await request.services();
            const { [PARAM_AGENT_ID]: id } = request.params;
            try {
                return await agentService.findAllSettings({ id });
            }
            catch ({ message, statusCode }) {
                return new Boom(message, { statusCode });
            }
        }
    }
};
