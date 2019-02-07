import HapiSwagger from 'hapi-swagger';
import Inert from 'inert';
import Vision from 'vision';

const name = 'swagger';
const logger = require('../../util/logger')({ name: `plugin:${name}` });

module.exports = {
    name,
    async register(server, options) {

        await server.register([
            Inert,
            Vision,
            {
                plugin: HapiSwagger,
                options
            }
        ]);
        logger.info('registered');
        logger.info(`TODO: add hapi-swaggered-ui`); // TODO
    }
};
