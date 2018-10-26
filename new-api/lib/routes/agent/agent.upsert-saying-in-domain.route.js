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
    method: ['put','post'],
    path: `/${ROUTE_AGENT}/{${PARAM_AGENT_ID}}/${ROUTE_DOMAIN}/{${PARAM_DOMAIN_ID}}/${ROUTE_SAYING}/{${PARAM_SAYING_ID}?}`,
    options: {
        tags: ['api'],
        validate: AgentValidator.updateSayingInDomain,
        handler: async (request) => {

            const { agentService } = await request.services();
            const {
                [PARAM_AGENT_ID]: agentId,
                [PARAM_DOMAIN_ID]: domainId,
                [PARAM_SAYING_ID]: sayingId
            } = request.params;
            try {
                return await agentService.upsertSayingInDomain({ id: agentId, domainId, sayingId, sayingData: request.payload });
            }
            catch ({ message, statusCode }) {
                return new Boom(message, { statusCode });
            }
        }
    }
};
