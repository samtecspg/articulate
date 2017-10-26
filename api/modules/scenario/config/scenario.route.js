'use strict';
const ScenarioController = require('../controllers');
const ScenarioValidator = require('./scenario.validator');

const ScenarioRoutes = [
    {
        method: 'GET',
        path: '/scenario',
        config: {
            description: 'Find all instances of the model from the data source',
            tags: ['api'],
            validate: ScenarioValidator.findAll,
            handler: ScenarioController.findAll
        }
    },
    {
        method: 'POST',
        path: '/scenario',
        config: {
            description: 'Create a new instance of the model and persist it into the data source',
            tags: ['api'],
            validate: ScenarioValidator.add,
            handler: ScenarioController.add
        }
    },
    {
        method: 'GET',
        path: '/scenario/{id}',
        config: {
            description: 'Find a model instance by id from the data source',
            tags: ['api'],
            validate: ScenarioValidator.findById,
            handler: ScenarioController.findById
        }
    },
    {
        method: 'PUT',
        path: '/scenario/{id}',
        config: {
            description: 'Update attributes for a model instance and persist it into the data source',
            tags: ['api'],
            validate: ScenarioValidator.updateById,
            handler: ScenarioController.updateById
        }
    },
    {
        method: 'DELETE',
        path: '/scenario/{id}',
        config: {
            description: 'Delete a model instance by id from the data source',
            tags: ['api'],
            validate: ScenarioValidator.deleteById,
            handler: ScenarioController.deleteById
        }
    }
];

module.exports = ScenarioRoutes;
