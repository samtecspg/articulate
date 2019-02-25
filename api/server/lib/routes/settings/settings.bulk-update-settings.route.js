import Boom from 'boom';
import {
    PARAM_BULK,
    ROUTE_SETTINGS
} from '../../../util/constants';
import SettingsValidator from '../../validators/settings.validator';

//const logger = require('../../../server/util/logger')({ name: `route:agent:create` });

module.exports = {
    method: 'put',
    path: `/${ROUTE_SETTINGS}/${PARAM_BULK}`,
    options: {
        tags: ['api'],
        description: 'Bulk update settings',
        validate: SettingsValidator.updateAll,
        handler: async (request) => {

            const { settingsService } = await request.services();
            try {
                return await settingsService.bulkUpdate({ settingsData: request.payload });
            }
            catch ({ message, statusCode }) {
                return new Boom(message, { statusCode });
            }
        }
    }
};
