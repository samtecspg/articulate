const HauteCouture = require('haute-couture');
const Package = require('../../package.json');
const logger = require('../util/logger')({ name: `plugin:lib` });

exports.plugin = {
    pkg: Package,
    register: async (server, options) => {

        const amendments = {
            remove: ['models'],
            add: [
                {
                    place: 'init',
                    list: true,
                    method: 'services',
                    after: ['plugins', 'register']
                },
                {
                    place: 'websocket',
                    list: true,
                    method: 'services',
                    after: ['plugins', 'register']
                }]
        };
        // Custom plugin code can go here
        server.dependency(['schmervice', 'redis', 'nes']);
        await HauteCouture.using(null, amendments)(server, options);
        logger.info('registered');
    }
};
