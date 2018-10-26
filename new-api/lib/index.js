const HauteCouture = require('haute-couture');
const Package = require('../package.json');
const logger = require('../util/logger')({ name: `plugin:lib` });

exports.plugin = {
    pkg: Package,
    register: async (server, options) => {

        // Custom plugin code can go here
        server.dependency(['schmervice', 'redis', 'nes']);
        await HauteCouture.using()(server, options);
        logger.info('registered');
    }
};
