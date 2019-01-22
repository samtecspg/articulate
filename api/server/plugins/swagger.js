import HapiSwagger from 'hapi-swagger';
import Inert from 'inert';
import Vision from 'vision';
import Package from '../../package.json';

const name = 'swagger';
const logger = require('../../util/logger')({ name: `plugin:${name}` });

module.exports = {
    name,
    async register(server) {

        await server.register([
            Inert,
            Vision,
            {
                plugin: HapiSwagger,
                options: {
                    info: {
                        version: Package.version
                    }
                }
            }
        ]);
        logger.info('registered');
        logger.info(`TODO: add hapi-swaggered-ui`); // TODO
    }
};
