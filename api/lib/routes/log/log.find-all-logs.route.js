import Boom from 'boom';
import {
    ROUTE_LOG
} from '../../../util/constants';
import LogValidator from '../../validators/log.validator';

module.exports = {
    method: 'get',
    path: `/${ROUTE_LOG}`,
    options: {
        tags: ['api'],
        validate: LogValidator.findAllLogs,
        handler: async (request) => {

            const { logService } = await request.services();
            const { skip, limit, direction, field, filter } = request.query;
            try {
                return await logService.findAllLogs({ direction, skip, limit, field, filter });
            }
            catch ({ message, statusCode }) {
                return new Boom(message, { statusCode });
            }
        }
    }
};
