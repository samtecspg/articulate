import HapiSwagger from 'hapi-swagger';
import HapiSwaggeredUI from 'hapi-swaggered-ui';
import Inert from 'inert';
import Vision from 'vision';

const name = 'swagger';
const logger = require('../../util/logger')({ name: `plugin:${name}` });

module.exports = {
    name,
    async register(server, options) {

        // We added in HapiSwaggerUI because HapiSwagger hadn't been updated and had an SSL bug.
        await server.register([
            Inert,
            Vision,
            {
                plugin: HapiSwagger,
                options
            },
            {
                plugin: HapiSwaggeredUI,
                options: {
                    title: options.info.title,
                    path: '/documentation',
                    swaggerEndpoint: '/swagger.json',
                    swaggerOptions: {
                        validatorUrl: null
                    }
                }
            }
        ]);
        logger.info('registered');
    }
};
