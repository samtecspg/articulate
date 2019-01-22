import Boom from 'boom';
import {
    PARAM_AGENT_ID,
    ROUTE_AGENT,
    ROUTE_SETTINGS
} from '../../../util/constants';
import AgentValidator from '../../validators/agent.validator';

//const logger = require('../../../util/logger')({ name: `route:agent:create` });

module.exports = {
    method: 'put',
    path: `/${ROUTE_AGENT}/{${PARAM_AGENT_ID}}/${ROUTE_SETTINGS}`,
    options: {
        tags: ['api'],
        validate: AgentValidator.updateAllSettings,
        handler: async (request) => {

            const { agentService } = await request.services();
            const { [PARAM_AGENT_ID]: id } = request.params;
            try {
                return await agentService.updateAllSettings({ id, settingsData: request.payload });
            }
            catch ({ message, statusCode }) {
                return new Boom(message, { statusCode });
            }
        }
    }
};
