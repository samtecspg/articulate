import Boom from 'boom';
import {
    PARAM_AGENT_ID,
    PARAM_DOMAIN_ID,
    PARAM_SAYING_ID,
    ROUTE_AGENT,
    ROUTE_DOMAIN,
    ROUTE_SAYING
} from '../../../util/constants';
import AgentValidator from '../../validators/agent.validator';
//const logger = require('../../../util/logger')({ name: `route:agent:create-webhook` });

module.exports = {
    method: ['delete'],
    path: `/${ROUTE_AGENT}/{${PARAM_AGENT_ID}}/${ROUTE_DOMAIN}/{${PARAM_DOMAIN_ID}}/${ROUTE_SAYING}/{${PARAM_SAYING_ID}}`,
    options: {
        tags: ['api'],
        validate: AgentValidator.removeSayingInDomain,
        handler: async (request, h) => {

            const { agentService } = await request.services();
            const {
                [PARAM_AGENT_ID]: agentId,
                [PARAM_DOMAIN_ID]: domainId,
                [PARAM_SAYING_ID]: sayingId
            } = request.params;
            try {
                await agentService.removeSayingInDomain({ id: agentId, domainId, sayingId });
                return h.continue;
            }
            catch ({ message, statusCode }) {
                return new Boom(message, { statusCode });
            }
        }
    }
};
