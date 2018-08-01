'use strict';
const DocController = require('../controllers');
const DocValidator = require('./doc.validator');
const PKG = require('../../../package');

const docRoutes = [
    {
        method: 'GET',
        path: '/doc/{id}',
        config: {
            description: 'Return all the setings of the system',
            tags: ['api'],
            plugins: {
                'flow-loader': {
                    name: `${PKG.name}/doc.find-by-id.graph`,
                    consumes: ['redis']
                }
            },
            validate: DocValidator.findById,
            handler: DocController.findById
        }
    }
];

module.exports = docRoutes;
