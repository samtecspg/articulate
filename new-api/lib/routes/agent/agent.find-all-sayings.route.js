import Boom from 'boom';
import {
    PARAM_AGENT_ID,
    PARAM_DIRECTION,
    PARAM_FIELD,
    PARAM_FILTER,
    PARAM_LIMIT,
    PARAM_SKIP,
    ROUTE_AGENT,
    ROUTE_SAYING
} from '../../../util/constants';
import AgentValidator from '../../validators/agent.validator';

module.exports = {
    method: 'get',
    path: `/${ROUTE_AGENT}/{${PARAM_AGENT_ID}}/${ROUTE_SAYING}`,
    options: {
        tags: ['api'],
        validate: AgentValidator.findAllSayings,
        handler: async (request) => {

            const { agentService } = await request.services();
            const { [PARAM_AGENT_ID]: id } = request.params;
            const {
                [PARAM_SKIP]: skip,
                [PARAM_LIMIT]: limit,
                [PARAM_DIRECTION]: direction,
                [PARAM_FIELD]: field,
                [PARAM_FILTER]: filter,
                loadCategoryId
            } = request.query;
            try {
                return await agentService.findAllSayings({ id, loadCategoryId, skip, limit, direction, field,filter });
            }
            catch ({ message, statusCode }) {
                return new Boom(message, { statusCode });
            }
        }
    }
};
