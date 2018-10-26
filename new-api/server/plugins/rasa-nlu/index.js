import Axios from 'axios';
import Package from '../../../package.json';
import InitializeModels from './lib/initialize-models';

const name = 'rasa-nlu';
const logger = require('../../../util/logger')({ name: `plugin:${name}` });

module.exports = {
    name,
    pkg: Package,
    async register(server, options) {

        // Set config defaults when creating the instance
        const axios = Axios.create(options);
        //TODO: Add configuration override to calls to the endpoints
        server.app[name] = await InitializeModels({ http: axios, path: `${__dirname}/models` });
        logger.info('registered');
    }
};
