import _ from 'lodash';
import Package from '../../../package.json';
import { P_AUTHENTICATION } from '../../../util/constants';
import initStrategies from './strategies';

const name = P_AUTHENTICATION;
const logger = require('../../../util/logger')({ name: `plugin:${name}` });

module.exports = {
    name,
    pkg: Package,
    async register(server, options) {
        const { AUTH_ENABLED, AUTH_PROVIDERS } = options;
        const strategies = initStrategies({ AUTH_ENABLED, AUTH_PROVIDERS });
        const parseProfile = ({ profile, provider }) => {
            const profileParser = require(`./strategies/${provider}`).profileParser;
            if (!profileParser) {
                return profile;
            }
            const profileValues = _.at(profile, profileParser);
            const parsedProfile = _.zipObject(['name', 'lastName', 'email'], profileValues);
            return parsedProfile;
        };
        await strategies.map(async (strategy) => {
            const { name, scheme, options } = strategy;
            logger.debug(`Strategy: ${name}`);
            await server.auth.strategy(name, scheme, options);
        });
        await server.auth.default(AUTH_ENABLED ? 'session' : undefined);
        server.app[name] = {
            parseProfile
        };
        logger.info('registered');
    }
};
