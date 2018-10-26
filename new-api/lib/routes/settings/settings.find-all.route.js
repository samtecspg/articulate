import Boom from 'boom';
import { ROUTE_SETTINGS } from '../../../util/constants';
//import AgentValidator from '../../validators/agent.validator';

//const logger = require('../../../util/logger')({ name: `route:agent:create` });

module.exports = {
    method: 'get',
    path: `/${ROUTE_SETTINGS}`,
    options: {
        tags: ['api'],
        handler: async (request) => {

            const { settingsService } = await request.services();
            try {
                return await settingsService.findAll();
            }
            catch ({ message, statusCode }) {

                return new Boom(message, { statusCode });
            }
        }
    }
};

