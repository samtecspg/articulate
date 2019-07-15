import Package from '../../../package.json';
import initStrategies from './strategies';

const name = 'authentication';
const logger = require('../../../util/logger')({ name: `plugin:${name}` });

module.exports = {
    name,
    pkg: Package,
    async register(server, options) {
        const { AUTH_ENABLED, AUTH_PROVIDERS } = options;
        const strategies = initStrategies({ AUTH_ENABLED, AUTH_PROVIDERS });
        await strategies.map(async (strategy) => {
            const { name, scheme, options } = strategy;
            logger.debug(`Strategy: ${name}`);
            await server.auth.strategy(name, scheme, options);
        });
        await server.auth.default(AUTH_ENABLED ? 'session' : undefined);
        logger.info('registered');
    }
};
