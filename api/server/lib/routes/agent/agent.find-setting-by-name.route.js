import Boom from 'boom';
import {
    PARAM_AGENT_ID,
    PARAM_NAME,
    ROUTE_AGENT,
    ROUTE_SETTINGS
} from '../../../util/constants';
import AgentValidator from '../../validators/agent.validator';

//const logger = require('../../../server/util/logger')({ name: `route:agent:create` });

module.exports = {
    method: 'get',
    path: `/${ROUTE_AGENT}/{${PARAM_AGENT_ID}}/${ROUTE_SETTINGS}/{${PARAM_NAME}}`,
    options: {
        tags: ['api'],
        validate: AgentValidator.findSettingByName,
        handler: async (request) => {

            const { agentService } = await request.services();
            const {
                [PARAM_AGENT_ID]: id,
                [PARAM_NAME]: name
            } = request.params;
            try {
                return await agentService.findSettingByName({ id, name });
            }
            catch ({ message, statusCode }) {
                return new Boom(message, { statusCode });
            }
        }
    }
};
