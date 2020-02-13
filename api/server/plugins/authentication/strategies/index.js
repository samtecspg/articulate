import Session from './session';
import Simple from './simple';

const logger = require('../../../../util/logger')({ name: `server:strategy` });



module.exports = ({ AUTH_ENABLED, AUTH_PROVIDERS }) => {
    if (!AUTH_ENABLED) {
        return [];
    }
    const location = (request) => {
        const scheme = request.headers['x-scheme'];
        const host = request.info.host;
        const uri = request.headers['x-request-uri'];
        const url = new URL(`${scheme}://${host}${uri}`);
        return `${url.origin}${url.pathname}`;
    };

    const strategies = [Simple, Session];
    AUTH_PROVIDERS.map((provider) => {
        let p;
        try {
            p = require(`./${provider}`);
            const key = p.options.clientId;
            const secret = p.options.clientSecret;
            p.options.location = location;
            if (key && secret) {
                return strategies.push(p);
            }
            throw new Error(`Provider [${provider}] is missing the Key or Secret values`);
        }
        catch (e) {
            logger.error(e);
        }
    });
    logger.info('Strategies loaded');
    return strategies;
};
