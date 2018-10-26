import Axios from 'axios';
import Package from '../../../package.json';
import InitializeModels from './lib/initialize-models';

const name = 'duckling';
const logger = require('../../../util/logger')({ name: `plugin:${name}` });

module.exports = {
    name,
    pkg: Package,
    async register(server, options) {

        // Set config defaults when creating the instance
        const axios = Axios.create(options);
        server.app[name] = await InitializeModels({ http: axios, path: `${__dirname}/models` });
        logger.info('registered');
    }
};
