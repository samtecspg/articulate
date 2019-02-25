import Nohm from 'nohm';
import Redis from 'redis';
import Package from '../../../package.json';

const name = 'redis-messaging';
const logger = require('../../util/logger')({ name: `plugin:${name}` });

module.exports = {
    name,
    pkg: Package,
    async register(server, options) {

        const { host, port, retry, retryTimeout } = options;

        const retryStrategy = (settings) => {

            logger.info(`redis::retryStrategy::${JSON.stringify(settings)}`);
            if (settings.error && settings.error.code === 'ECONNREFUSED') {
                logger.info(`Connection failed. Attempt ${settings.attempt} of ${retry}`);
                if (settings.attempt === retry) {
                    logger.error('Failure during Redis connection ');
                    logger.error(settings.error);
                    return process.exit(1);
                }

                return retryTimeout;

            }
            return retryTimeout;
        };
        await new Promise((resolve, reject) => {

            const client = Redis.createClient(port, host, { retry_strategy: retryStrategy });
            // Wait for connection
            client.once('ready', async () => {

                logger.info('ready');
                await Nohm.setPubSubClient(client);
                server.app[name] = Nohm;
                resolve();
            });

            // Listen to errors
            client.on('error', (err) => {

                logger.error(err);
                reject(err);
            });
        });
        logger.info('registered');
    }
};
