'use strict';
const ContextController = require('../controllers');
const ContextValidator = require('./context.validator');

const ContextRoutes = [
    {
        method: 'POST',
        path: '/context/{sessionId}',
        config: {
            description: 'Create a new instance of the model and persist it into the data source',
            tags: ['api'],
            validate: ContextValidator.addById,
            handler: ContextController.addById
        }
    },
    {
        method: 'GET',
        path: '/context/{sessionId}',
        config: {
            description: 'Find a model instance by id from the data source',
            tags: ['api'],
            validate: ContextValidator.findById,
            handler: ContextController.findById
        }
    },
    {
        method: 'PUT',
        path: '/context/{sessionId}/{id}',
        config: {
            description: 'Update attributes for a model instance and persist it into the data source',
            tags: ['api'],
            validate: ContextValidator.updateById,
            handler: ContextController.updateById
        }
    },
    {
        method: 'DELETE',
        path: '/context/{sessionId}',
        config: {
            description: 'Deletes a session',
            tags: ['api'],
            validate: ContextValidator.deleteById,
            handler: ContextController.deleteById
        }
    }
];

module.exports = ContextRoutes;
