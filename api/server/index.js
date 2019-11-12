import Glue from 'glue';
import Manifest from './manifest';

const logger = require('../util/logger')({ name: `server` });

import {
    AUTH_ENABLED
} from '../util/env';

exports.deployment = async (start) => {

    const manifest = Manifest.get('/', process.env);
    const server = await Glue.compose(manifest, { relativeTo: __dirname });

    await server.initialize();

    if (AUTH_ENABLED){
        if (process.env.SESSION_SECRET.length < 32){
            throw new Error('SESSION_SECRET too short, please enter at least 32 characters for your SESSION_SECRET environment variable')
        }
    }

    if (!start) {
        return server;
    }

    await server.start();

    console.log(`Server started at ${server.info.uri}`);
    console.log(`Documentation at ${server.info.uri}/documentation`);
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
