'use strict';
const AgentController = require('../controllers');
const AgentValidator = require('./agent.validator');

const AgentRoutes = [
    {
        method: 'GET',
        path: '/agent',
        config: {
            description: 'Find all instances of the model from the data source',
            tags: ['api'],
            validate: AgentValidator.findAll,
            handler: AgentController.findAll
        }
    },
    {
        method: 'GET',
        path: '/agent/{id}',
        config: {
            description: 'Find a model instance by id from the data source',
            tags: ['api'],
            validate: AgentValidator.findById,
            handler: AgentController.findById
        }
    },
    {
        method: 'GET',
        path: '/agent/{id}/entity',
        config: {
            description: 'Find list of entities linked with a model instance specified by id',
            tags: ['api'],
            validate: AgentValidator.findEntitiesByAgentId,
            handler: AgentController.findEntitiesByAgentId
        }
    },
    {
        method: 'GET',
        path: '/agent/{id}/entity/{entityId}',
        config: {
            description: 'Find an entity by id that belongs to the specified model instance',
            tags: ['api'],
            validate: AgentValidator.findEntityByIdByAgentId,
            handler: AgentController.findEntityByIdByAgentId
        }
    },
    {
        method: 'GET',
        path: '/agent/{id}/domain',
        config: {
            description: 'Find list of domains linked with a model instance specified by id',
            tags: ['api'],
            validate: AgentValidator.findDomainsByAgentId,
            handler: AgentController.findDomainsByAgentId
        }
    },
    {
        method: 'GET',
        path: '/agent/{id}/domain/{domainId}',
        config: {
            description: 'Find a domain by id that belongs to the specified model instance',
            tags: ['api'],
            validate: AgentValidator.findDomainByIdByAgentId,
            handler: AgentController.findDomainByIdByAgentId
        }
    },
    {
        method: 'GET',
        path: '/agent/{id}/domain/{domainId}/intent',
        config: {
            description: 'Find list of intents for the given domain and agent',
            tags: ['api'],
            validate: AgentValidator.findIntentsInDomainByIdByAgentId,
            handler: AgentController.findIntentsInDomainByIdByAgentId
        }
    },
    {
        method: 'GET',
        path: '/agent/{id}/domain/{domainId}/intent/{intentId}',
        config: {
            description: 'Find an intent by id given a domain and an agent',
            tags: ['api'],
            validate: AgentValidator.findIntentByIdInDomainByIdByAgentId,
            handler: AgentController.findIntentByIdInDomainByIdByAgentId
        }
    },
    {
        method: 'GET',
        path: '/agent/{id}/domain/{domainId}/intent/{intentId}/scenario',
        config: {
            description: 'Find the scenario related with an intent, for the given domain and agent',
            tags: ['api'],
            validate: AgentValidator.findIntentScenarioInDomainByIdByAgentId,
            handler: AgentController.findIntentScenarioInDomainByIdByAgentId
        }
    },
    {
        method: 'POST',
        path: '/agent',
        config: {
            description: 'Create a new instance of the model and persist it into the data source',
            tags: ['api'],
            validate: AgentValidator.add,
            handler: AgentController.add
        }
    },
    {
        method: 'PUT',
        path: '/agent/{id}',
        config: {
            description: 'Update attributes for a model instance and persist it into the data source',
            tags: ['api'],
            validate: AgentValidator.updateById,
            handler: AgentController.updateById
        }
    },
    {
        method: 'DELETE',
        path: '/agent/{id}',
        config: {
            description: 'Delete a model instance by id from the data source',
            tags: ['api'],
            validate: AgentValidator.deleteById,
            handler: AgentController.deleteById
        }
    },
    {
        method: 'GET',
        path: '/agent/{id}/parse',
        config: {
            description: 'Parse a text for each domain in the agent',
            tags: ['api'],
            validate: AgentValidator.parse,
            handler: AgentController.parse
        }
    },
    {
        method: 'GET',
        path: '/agent/{id}/converse',
        config: {
            description: 'Converse with a trained agent',
            tags: ['api'],
            validate: AgentValidator.converse,
            handler: AgentController.converse
        }
    },
    {
        method: 'GET',
        path: '/agent/{id}/export',
        config: {
            description: 'Export agent data',
            tags: ['api'],
            validate: AgentValidator.export,
            handler: AgentController.export
        }
    }
];

module.exports = AgentRoutes;
