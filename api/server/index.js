import Glue from 'glue';
import Manifest from './manifest';

const logger = require('../util/logger')({ name: `server` });

exports.deployment = async (start) => {

    const manifest = Manifest.get('/', process.env);
    const server = await Glue.compose(manifest, { relativeTo: __dirname });

    await server.initialize();

    if (!start) {
        return server;
    }

    await server.start();

    logger.info(`Server started at ${server.info.uri}`);
    if (process.env.DEBUG_ROUTES) {
        console.log(server.plugins.blipp.text());
    }
    return server;
};

if (!module.parent) {

    exports.deployment(true);

    process.on('unhandledRejection', (err) => {

        throw err;
    });
}
