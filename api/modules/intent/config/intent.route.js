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
            handler: IntentController.add,
            timeout: {
                socket: 20 * 60 * 1000, //Max default training time 20 minutes
                server: false
            }
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
            handler: IntentController.updateById,
            timeout: {
                socket: 20 * 60 * 1000, //Max default training time 20 minutes
                server: false
            }
        }
    },
    {
        method: 'DELETE',
        path: '/intent/{id}',
        config: {
            description: 'Delete a model instance by id from the data source',
            tags: ['api'],
            validate: IntentValidator.deleteById,
            handler: IntentController.deleteById,
            timeout: {
                socket: 20 * 60 * 1000, //Max default training time 20 minutes
                server: false
            }
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
            description: 'Delete a scenario instance by id from the data source',
            tags: ['api'],
            validate: IntentValidator.deleteScenario,
            handler: IntentController.deleteScenario
        }
    },
    {
        method: 'POST',
        path: '/intent/{id}/webhook',
        config: {
            description: 'Create a new instance of a webhook for the intent and persist it into the data source',
            tags: ['api'],
            validate: IntentValidator.addWebhook,
            handler: IntentController.addWebhook
        }
    },
    {
        method: 'GET',
        path: '/intent/{id}/webhook',
        config: {
            description: 'Find a webhook by intent id from the data source',
            tags: ['api'],
            validate: IntentValidator.findWebhook,
            handler: IntentController.findWebhook
        }
    },
    {
        method: 'PUT',
        path: '/intent/{id}/webhook',
        config: {
            description: 'Update attributes of the webhook of the intent and persist it into the data source',
            tags: ['api'],
            validate: IntentValidator.updateWebhook,
            handler: IntentController.updateWebhook
        }
    },
    {
        method: 'DELETE',
        path: '/intent/{id}/webhook',
        config: {
            description: 'Delete a webhook instance by id from the data source',
            tags: ['api'],
            validate: IntentValidator.deleteWebhook,
            handler: IntentController.deleteWebhook
        }
    },

    {
        method: 'POST',
        path: '/intent/{id}/postFormat',
        config: {
            description: 'Create a new instance of a post format for the intent and persist it into the data source',
            tags: ['api'],
            validate: IntentValidator.addPostFormat,
            handler: IntentController.addPostFormat
        }
    },
    {
        method: 'GET',
        path: '/intent/{id}/postFormat',
        config: {
            description: 'Find a post format by intent id from the data source',
            tags: ['api'],
            validate: IntentValidator.findPostFormat,
            handler: IntentController.findPostFormat
        }
    },
    {
        method: 'PUT',
        path: '/intent/{id}/postFormat',
        config: {
            description: 'Update attributes of the post format of the intent and persist it into the data source',
            tags: ['api'],
            validate: IntentValidator.updatePostFormat,
            handler: IntentController.updatePostFormat
        }
    },
    {
        method: 'DELETE',
        path: '/intent/{id}/postFormat',
        config: {
            description: 'Delete a webhook instance by id from the data source',
            tags: ['api'],
            validate: IntentValidator.deletePostFormat,
            handler: IntentController.deletePostFormat
        }
    }

];

module.exports = IntentRoutes;
