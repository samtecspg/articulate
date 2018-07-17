import Boom from 'boom';
import {
    PARAM_NAME,
    ROUTE_SETTINGS
} from '../../../util/constants';
import SettingsValidator from '../../validators/settings.validator';

module.exports = {
    method: 'get',
    path: `/${ROUTE_SETTINGS}/{${PARAM_NAME}}`,
    options: {
        tags: ['api'],
        validate: SettingsValidator.findByName,
        handler: async (request) => {

            const { settingsService } = await request.services();
            const { [PARAM_NAME]: name } = request.params;
            try {
                return await settingsService.findByName({ name });
            }
            catch ({ message, statusCode }) {

                return new Boom(message, { statusCode });
            }
        }
    }
};

