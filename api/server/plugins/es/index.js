import elasticsearch from 'elasticsearch';
import Package from '../../../package.json';
import InitializeModels from './lib/initialize-models';

const name = 'es';
const logger = require('../../util/logger')({ name: `plugin:${name}` });

module.exports = {
    name,
    pkg: Package,
    async register(server, options) {

        const client = new elasticsearch.Client(options);
        try {
            await client.ping({
                requestTimeout: 1000
            });
            server.app[name] = {
                client,
                models: await InitializeModels({ client, path: `${__dirname}/models` })
            };
            logger.info('registered');
        }
        catch (e) {
            console.error('elasticsearch cluster is down!');
            throw e;
        }
    }
};
