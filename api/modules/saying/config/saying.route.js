'use strict';
const SayingController = require('../controllers');
const SayingValidator = require('./saying.validator');

const SayingRoutes = [
    {
        method: 'POST',
        path: '/saying',
        config: {
            description: 'Create a new instance of the model and persist it into the data source',
            tags: ['api'],
            validate: SayingValidator.add,
            handler: SayingController.add,
            timeout: {
                socket: 20 * 60 * 1000, //Max default training time 20 minutes
                server: false
            }
        }
    },
    {
        method: 'GET',
        path: '/saying/{id}',
        config: {
            description: 'Find a model instance by id from the data source',
            tags: ['api'],
            validate: SayingValidator.findById,
            handler: SayingController.findById
        }
    },
    {
        method: 'PUT',
        path: '/saying/{id}',
        config: {
            description: 'Update attributes for a model instance and persist it into the data source',
            tags: ['api'],
            validate: SayingValidator.updateById,
            handler: SayingController.updateById,
            timeout: {
                socket: 20 * 60 * 1000, //Max default training time 20 minutes
                server: false
            }
        }
    },
    {
        method: 'DELETE',
        path: '/saying/{id}',
        config: {
            description: 'Delete a model instance by id from the data source',
            tags: ['api'],
            validate: SayingValidator.deleteById,
            handler: SayingController.deleteById,
            timeout: {
                socket: 20 * 60 * 1000, //Max default training time 20 minutes
                server: false
            }
        }
    },
];

module.exports = SayingRoutes;
