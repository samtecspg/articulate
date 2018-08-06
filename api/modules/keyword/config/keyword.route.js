'use strict';
const KeywordController = require('../controllers');
const KeywordValidator = require('./keyword.validator');

const keywordRoutes = [
    {
        method: 'POST',
        path: '/keyword',
        config: {
            description: 'Create a new instance of the model and persist it into the data source',
            tags: ['api'],
            validate: KeywordValidator.add,
            handler: KeywordController.add
        }
    },
    {
        method: 'GET',
        path: '/keyword/{id}',
        config: {
            description: 'Find a model instance by id from the data source',
            tags: ['api'],
            validate: KeywordValidator.findById,
            handler: KeywordController.findById
        }
    },
    {
        method: 'GET',
        path: '/keyword/{id}/saying',
        config: {
            description: 'Find a model instance by id from the data source',
            tags: ['api'],
            validate: KeywordValidator.findSayingsByKeywordId,
            handler: KeywordController.findSayingsByKeywordId
        }
    },
    {
        method: 'GET',
        path: '/keyword/{id}/action',
        config: {
            description: 'Find a model instance by id from the data source',
            tags: ['api'],
            validate: KeywordValidator.findActionsByKeywordId,
            handler: KeywordController.findActionsByKeywordId
        }
    },
    {
        method: 'PUT',
        path: '/keyword/{id}',
        config: {
            description: 'Update attributes for a model instance and persist it into the data source',
            tags: ['api'],
            validate: KeywordValidator.updateById,
            handler: KeywordController.updateById,
            timeout: {
                socket: 20 * 60 * 1000, //Max default training time 20 minutes
                server: false
            }
        }
    },
    {
        method: 'DELETE',
        path: '/keyword/{id}',
        config: {
            description: 'Delete a model instance by id from the data source',
            tags: ['api'],
            validate: KeywordValidator.deleteById,
            handler: KeywordController.deleteById
        }
    }
];

module.exports = keywordRoutes;
