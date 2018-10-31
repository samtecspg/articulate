import Boom from 'boom';
import {
    PARAM_AGENT_ID,
    PARAM_DOMAIN_ID,
    ROUTE_AGENT,
    ROUTE_DOMAIN,
    ROUTE_TRAIN
} from '../../../util/constants';
import AgentValidator from '../../validators/agent.validator';

//const logger = require('../../../util/logger')({ name: `route:agent:create` });

module.exports = {
    method: 'post',
    path: `/${ROUTE_AGENT}/{${PARAM_AGENT_ID}}/${ROUTE_DOMAIN}/{${PARAM_DOMAIN_ID}}/${ROUTE_TRAIN}`,
    options: {
        tags: ['api'],
        validate: AgentValidator.trainDomain,
        handler: async (request) => {

            const { agentService } = await request.services();
            const {
                [PARAM_AGENT_ID]: agentId,
                [PARAM_DOMAIN_ID]: domainId
            } = request.params;
            try {
                return await agentService.trainDomain({ id: agentId, domainId });
            }
            catch ({ message, statusCode }) {
                return new Boom(message, { statusCode });
            }
        }
    }
};
