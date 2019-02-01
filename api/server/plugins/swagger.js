import HapiSwagger from 'hapi-swagger';
import Inert from 'inert';
import Vision from 'vision';
import Package from '../../package.json';

const name = 'swagger';
const logger = require('../../util/logger')({ name: `plugin:${name}` });

module.exports = {
    name,
    async register(server) {

        let swaggerOptions = {
            info: {
                title: 'Articulate API Documentation',
                version: Package.version,
                contact: {
                    name: 'Smart Platform Group'
                }
            }
        };

        process.env.SWAGGER_SCHEMES ? swaggerOptions.schemes = [process.env.SWAGGER_SCHEMES] : null;
        process.env.SWAGGER_HOST ? swaggerOptions.host = process.env.SWAGGER_HOST : null;
        process.env.SWAGGER_BASE_PATH ? swaggerOptions.basePath = process.env.SWAGGER_BASE_PATH : null;

        await server.register([
            Inert,
            Vision,
            {
                plugin: HapiSwagger,
                options: swaggerOptions
            }
        ]);
        logger.info('registered');
        logger.info(`TODO: add hapi-swaggered-ui`); // TODO
    }
};
