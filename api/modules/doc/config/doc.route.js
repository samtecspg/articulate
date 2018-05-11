'use strict';
const DocController = require('../controllers');
const DocValidator = require('./doc.validator');

const docRoutes = [
    {
        method: 'GET',
        path: '/doc/{id}',
        config: {
            description: 'Return all the setings of the system',
            tags: ['api'],
            validate: DocValidator.findById,
            handler: DocController.findById
        }
    }
];

module.exports = docRoutes;
