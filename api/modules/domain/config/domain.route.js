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
            handler: DomainController.updateById
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
    }
];

module.exports = DomainRoutes;
