'use strict';
const ActionController = require('../controllers');
const ActionValidator = require('./action.validator');

const ActionRoutes = [
    {
        method: 'POST',
        path: '/action',
        config: {
            description: 'Create a new instance of the model and persist it into the data source',
            tags: ['api'],
            validate: ActionValidator.add,
            handler: ActionController.add
        }
    },
    {
        method: 'GET',
        path: '/action/{id}',
        config: {
            description: 'Find a model instance by id from the data source',
            tags: ['api'],
            validate: ActionValidator.findById,
            handler: ActionController.findById
        }
    },
    {
        method: 'PUT',
        path: '/action/{id}',
        config: {
            description: 'Update attributes for a model instance and persist it into the data source',
            tags: ['api'],
            validate: ActionValidator.updateById,
            handler: ActionController.updateById
        }
    },
    {
        method: 'DELETE',
        path: '/action/{id}',
        config: {
            description: 'Delete a model instance by id from the data source',
            tags: ['api'],
            validate: ActionValidator.deleteById,
            handler: ActionController.deleteById
        }
    },
    {
        method: 'POST',
        path: '/action/{id}/webhook',
        config: {
            description: 'Create a new instance of a webhook for the action and persist it into the data source',
            tags: ['api'],
            validate: ActionValidator.addWebhook,
            handler: ActionController.addWebhook
        }
    },
    {
        method: 'GET',
        path: '/action/{id}/webhook',
        config: {
            description: 'Find a webhook by action id from the data source',
            tags: ['api'],
            validate: ActionValidator.findWebhook,
            handler: ActionController.findWebhook
        }
    },
    {
        method: 'PUT',
        path: '/action/{id}/webhook',
        config: {
            description: 'Update attributes of the webhook of the action and persist it into the data source',
            tags: ['api'],
            validate: ActionValidator.updateWebhook,
            handler: ActionController.updateWebhook
        }
    },
    {
        method: 'DELETE',
        path: '/action/{id}/webhook',
        config: {
            description: 'Delete a webhook instance by id from the data source',
            tags: ['api'],
            validate: ActionValidator.deleteWebhook,
            handler: ActionController.deleteWebhook
        }
    },

    {
        method: 'POST',
        path: '/action/{id}/postFormat',
        config: {
            description: 'Create a new instance of a post format for the action and persist it into the data source',
            tags: ['api'],
            validate: ActionValidator.addPostFormat,
            handler: ActionController.addPostFormat
        }
    },
    {
        method: 'GET',
        path: '/action/{id}/postFormat',
        config: {
            description: 'Find a post format by action id from the data source',
            tags: ['api'],
            validate: ActionValidator.findPostFormat,
            handler: ActionController.findPostFormat
        }
    },
    {
        method: 'PUT',
        path: '/action/{id}/postFormat',
        config: {
            description: 'Update attributes of the post format of the action and persist it into the data source',
            tags: ['api'],
            validate: ActionValidator.updatePostFormat,
            handler: ActionController.updatePostFormat
        }
    },
    {
        method: 'DELETE',
        path: '/action/{id}/postFormat',
        config: {
            description: 'Delete a webhook instance by id from the data source',
            tags: ['api'],
            validate: ActionValidator.deletePostFormat,
            handler: ActionController.deletePostFormat
        }
    }

];

module.exports = ActionRoutes;
