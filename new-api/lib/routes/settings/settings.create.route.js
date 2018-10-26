import Boom from 'boom';
import { ROUTE_SETTINGS } from '../../../util/constants';
import SettingsValidator from '../../validators/settings.validator';

//const logger = require('../../../util/logger')({ name: `route:agent:create` });

module.exports = {
    method: 'post',
    path: `/${ROUTE_SETTINGS}`,
    options: {
        tags: ['api'],
        validate: SettingsValidator.create,
        handler: async (request) => {

            const { settingsService } = await request.services();
            try {
                return await settingsService.create({ data: request.payload });
            }
            catch ({ message, statusCode }) {
                return new Boom(message, { statusCode });
            }
        }
    }
};
