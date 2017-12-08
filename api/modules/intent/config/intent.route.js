'use strict';
const IntentController = require('../controllers');
const IntentValidator = require('./intent.validator');

const IntentRoutes = [
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
    },
    {
        method: 'POST',
        path: '/intent/{id}/scenario',
        config: {
            description: 'Create a new instance of a scenario for the intent and persist it into the data source',
            tags: ['api'],
            validate: IntentValidator.addScenario,
            handler: IntentController.addScenario
        }
    },
    {
        method: 'GET',
        path: '/intent/{id}/scenario',
        config: {
            description: 'Find a scenario by intent id from the data source',
            tags: ['api'],
            validate: IntentValidator.findScenario,
            handler: IntentController.findScenario
        }
    },
    {
        method: 'PUT',
        path: '/intent/{id}/scenario',
        config: {
            description: 'Update attributes of the scenario of the intent and persist it into the data source',
            tags: ['api'],
            validate: IntentValidator.updateScenario,
            handler: IntentController.updateScenario
        }
    },
    {
        method: 'DELETE',
        path: '/intent/{id}/scenario',
        config: {
            description: 'Delete an scenario instance by id from the data source',
            tags: ['api'],
            validate: IntentValidator.deleteScenario,
            handler: IntentController.deleteScenario
        }
    }
];

module.exports = IntentRoutes;
