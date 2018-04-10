'use strict';
const DomainController = require('../controllers');
const DomainValidator = require('./domain.validator');

const DomainRoutes = [
    {
        method: 'POST',
        path: '/domain',
        config: {
            description: 'Create a new instance of the model and persist it into the data source',
            tags: ['api'],
            validate: DomainValidator.add,
            handler: DomainController.add
        }
    },
    {
        method: 'GET',
        path: '/domain/{id}',
        config: {
            description: 'Find a model instance by id from the data source',
            tags: ['api'],
            validate: DomainValidator.findById,
            handler: DomainController.findById
        }
    },
    {
        method: 'PUT',
        path: '/domain/{id}',
        config: {
            description: 'Update attributes for a model instance and persist it into the data source',
            tags: ['api'],
            validate: DomainValidator.updateById,
            handler: DomainController.updateById,
            timeout: {
                socket: 20 * 60 * 1000, //Max default training time 20 minutes
                server: false
            }
        }
    },
    {
        method: 'DELETE',
        path: '/domain/{id}',
        config: {
            description: 'Delete a model instance by id from the data source',
            tags: ['api'],
            validate: DomainValidator.deleteById,
            handler: DomainController.deleteById
        }
    },
    {
        method: 'GET',
        path: '/domain/{id}/entity',
        config: {
            description: 'Find list of entities linked with a domain',
            tags: ['api'],
            validate: DomainValidator.findEntitiesByDomainId,
            handler: DomainController.findEntitiesByDomainId
        }
    },
    {
        method: 'GET',
        path: '/domain/{id}/intent',
        config: {
            description: 'Find list of intents linked with a domain',
            tags: ['api'],
            validate: DomainValidator.findIntentsByDomainId,
            handler: DomainController.findIntentsByDomainId
        }
    },
    {
        method: 'GET',
        path: '/domain/{id}/train',
        config: {
            description: 'Train the specified domain',
            tags: ['api'],
            validate: DomainValidator.train,
            handler: DomainController.train
        }
    }
];

module.exports = DomainRoutes;
