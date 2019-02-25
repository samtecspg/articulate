import Handlebars from 'handlebars';
import Package from '../../../package.json';
import InitializeHelpers from './lib/initialize-helpers';

const name = 'handlebars';
const logger = require('../../util/logger')({ name: `plugin:${name}` });

module.exports = {
    name,
    pkg: Package,
    async register(server) {

        await InitializeHelpers({ Handlebars, path: `${__dirname}/helpers` });
        server.app[name] = Handlebars;
        logger.info('registered');
    }
};
