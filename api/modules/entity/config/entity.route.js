'use strict';
const EntityController = require('../controllers');
const EntityValidator = require('./entity.validator');

const entityRoutes = [
    {
        method: 'POST',
        path: '/entity',
        config: {
            description: 'Create a new instance of the model and persist it into the data source',
            tags: ['api'],
            validate: EntityValidator.add,
            handler: EntityController.add
        }
    },
    {
        method: 'GET',
        path: '/entity/{id}',
        config: {
            description: 'Find a model instance by id from the data source',
            tags: ['api'],
            validate: EntityValidator.findById,
            handler: EntityController.findById
        }
    },
    {
        method: 'GET',
        path: '/entity/{id}/intent',
        config: {
            description: 'Find a model instance by id from the data source',
            tags: ['api'],
            validate: EntityValidator.findIntentsByEntityId,
            handler: EntityController.findIntentsByEntityId
        }
    },
    {
        method: 'PUT',
        path: '/entity/{id}',
        config: {
            description: 'Update attributes for a model instance and persist it into the data source',
            tags: ['api'],
            validate: EntityValidator.updateById,
            handler: EntityController.updateById,
            timeout: {
                socket: 20 * 60 * 1000, //Max default training time 20 minutes
                server: false
            }
        }
    },
    {
        method: 'DELETE',
        path: '/entity/{id}',
        config: {
            description: 'Delete a model instance by id from the data source',
            tags: ['api'],
            validate: EntityValidator.deleteById,
            handler: EntityController.deleteById
        }
    }
];

module.exports = entityRoutes;
