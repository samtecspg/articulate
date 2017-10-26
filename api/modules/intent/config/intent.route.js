'use strict';
const IntentController = require('../controllers');
const IntentValidator = require('./intent.validator');

const IntentRoutes = [
    {
        method: 'GET',
        path: '/intent',
        config: {
            description: 'Find all instances of the model from the data source',
            tags: ['api'],
            validate: IntentValidator.findAll,
            handler: IntentController.findAll
        }
    },
    {
        method: 'POST',
        path: '/intent',
        config: {
            description: 'Create a new instance of the model and persist it into the data source',
            tags: ['api'],
            validate: IntentValidator.add,
            handler: IntentController.add
        }
    },
    {
        method: 'GET',
        path: '/intent/{id}',
        config: {
            description: 'Find a model instance by id from the data source',
            tags: ['api'],
            validate: IntentValidator.findById,
            handler: IntentController.findById
        }
    },
    {
        method: 'PUT',
        path: '/intent/{id}',
        config: {
            description: 'Update attributes for a model instance and persist it into the data source',
            tags: ['api'],
            validate: IntentValidator.updateById,
            handler: IntentController.updateById
        }
    },
    {
        method: 'DELETE',
        path: '/intent/{id}',
        config: {
            description: 'Delete a model instance by id from the data source',
            tags: ['api'],
            validate: IntentValidator.deleteById,
            handler: IntentController.deleteById
        }
    }
];

module.exports = IntentRoutes;
