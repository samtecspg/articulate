import Boom from 'boom';
import { PARAM_NAME, ROUTE_SETTINGS } from '../../../util/constants';
import SettingsValidator from '../../validators/settings.validator';
import {
  AUTH_ENABLED
} from '../../../util/env';

//const logger = require('../../../util/logger')({ name: `route:agent:create` });

module.exports = {
  method: 'put',
  path: `/${ROUTE_SETTINGS}/{${PARAM_NAME}}`,
  options: {
    tags: ['api'],
    ... (AUTH_ENABLED && {
      auth: {
        strategy: 'session',
        mode: 'optional'
      }
    }),
    validate: SettingsValidator.updateByName,
    handler: async request => {
      const { settingsService } = await request.services();
      const { [PARAM_NAME]: name } = request.params;
      try {
        return await settingsService.updateByName({
          name,
          value: request.payload
        });
      } catch ({ message, statusCode }) {
        return new Boom(message, { statusCode });
      }
    }
  }
};
