import Boom from 'boom';
import ServerValidator from '../../validators/server.validator';

module.exports = {
    method: 'get',
    path: '/',
    options: {
        tags: ['api'],
        validate: ServerValidator.get,
        handler: async (request) => {

            const { serverService } = await request.services();
            try {
                return await serverService.get({ });
            }
            catch ({ message, statusCode }) {

                return new Boom(message, { statusCode });
            }
        }
    }
};