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
        path: '/agent/name/{agentName}',
        config: {
            description: 'Find a model instance by name from the data source',
            tags: ['api'],
            validate: AgentValidator.findByName,
            handler: AgentController.findByName
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
        method: 'GET',
        path: '/agent/{id}/domain/{domainId}/intent/{intentId}/webhook',
        config: {
            description: 'Find the webhook related with an intent, for the given domain and agent',
            tags: ['api'],
            validate: AgentValidator.findIntentWebhookInDomainByIdByAgentId,
            handler: AgentController.findIntentWebhookInDomainByIdByAgentId
        }
    },
    {
        method: 'GET',
        path: '/agent/{id}/domain/{domainId}/intent/{intentId}/postFormat',
        config: {
            description: 'Find the post format related with an intent, for the given domain and agent',
            tags: ['api'],
            validate: AgentValidator.findIntentPostFormatInDomainByIdByAgentId,
            handler: AgentController.findIntentPostFormatInDomainByIdByAgentId
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
            handler: AgentController.updateById,
            timeout: {
                socket: 20 * 60 * 1000, //Max default training time 20 minutes
                server: false
            }
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
        method: 'POST',
        path: '/agent/{id}/parse',
        config: {
            description: 'Parse a text for each domain in the agent',
            tags: ['api'],
            validate: AgentValidator.parsePost,
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
        method: 'POST',
        path: '/agent/{id}/converse',
        config: {
            description: 'Converse with a trained agent',
            tags: ['api'],
            validate: AgentValidator.conversePost,
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
    },
    {
        method: 'POST',
        path: '/agent/import',
        config: {
            description: 'Create a new instance of the model and persist it into the data source based on a given dataset',
            tags: ['api'],
            validate: AgentValidator.import,
            handler: AgentController.import,
            timeout: {
                socket: 20 * 60 * 1000, //Max default training time 20 minutes
                server: false
            }
        }
    },
    {
        method: 'GET',
        path: '/agent/{id}/intent',
        config: {
            description: 'Find list of intents linked with a model instance specified by id',
            tags: ['api'],
            validate: AgentValidator.findIntentsByAgentId,
            handler: AgentController.findIntentsByAgentId
        }
    },
    {
        method: 'POST',
        path: '/agent/{id}/webhook',
        config: {
            description: 'Create a new instance of a webhook for the agent and persist it into the data source',
            tags: ['api'],
            validate: AgentValidator.addWebhook,
            handler: AgentController.addWebhook
        }
    },
    {
        method: 'POST',
        path: '/agent/{id}/postFormat',
        config: {
            description: 'Create a new instance of a post format for the agent and persist it into the data source',
            tags: ['api'],
            validate: AgentValidator.addPostFormat,
            handler: AgentController.addPostFormat
        }
    },
    {
        method: 'GET',
        path: '/agent/{id}/postFormat',
        config: {
            description: 'Find a post format by agent id from the data source',
            tags: ['api'],
            validate: AgentValidator.findPostFormat,
            handler: AgentController.findPostFormat
        }
    },
    {
        method: 'DELETE',
        path: '/agent/{id}/postFormat',
        config: {
            description: 'Delete a post format by agent id from the data source',
            tags: ['api'],
            validate: AgentValidator.deletePostFormat,
            handler: AgentController.deletePostFormat
        }
    },
    {
        method: 'PUT',
        path: '/agent/{id}/postFormat',
        config: {
            description: 'Update attributes of the post format of the agent and persist it into the data source',
            tags: ['api'],
            validate: AgentValidator.updatePostFormat,
            handler: AgentController.updatePostFormat
        }
    },
    {
        method: 'GET',
        path: '/agent/{id}/webhook',
        config: {
            description: 'Find a webhook by agent id from the data source',
            tags: ['api'],
            validate: AgentValidator.findWebhook,
            handler: AgentController.findWebhook
        }
    },
    {
        method: 'PUT',
        path: '/agent/{id}/webhook',
        config: {
            description: 'Update attributes of the webhook of the agent and persist it into the data source',
            tags: ['api'],
            validate: AgentValidator.updateWebhook,
            handler: AgentController.updateWebhook
        }
    },
    {
        method: 'DELETE',
        path: '/agent/{id}/webhook',
        config: {
            description: 'Delete a webhook instance by id from the data source',
            tags: ['api'],
            validate: AgentValidator.deleteWebhook,
            handler: AgentController.deleteWebhook
        }
    },
    {
        method: 'GET',
        path: '/agent/{id}/train',
        config: {
            description: 'Train the specified agent',
            tags: ['api'],
            validate: AgentValidator.train,
            handler: AgentController.train
        }
    },
    {
        method: 'PUT',
        path: '/agent/{id}/settings',
        config: {
            description: 'Modifies the agent settings',
            tags: ['api'],
            validate: AgentValidator.updateSettings,
            handler: AgentController.updateSettings
        }
    },
    {
        method: 'GET',
        path: '/agent/{id}/settings',
        config: {
            description: 'Return all the setings of the agent',
            tags: ['api'],
            validate: AgentValidator.findAllSettings,
            handler: AgentController.findAllSettings
        }
    },
    {
        method: 'GET',
        path: '/agent/{id}/settings/{name}',
        config: {
            description: 'Return the settings value for the specified name for the agent',
            tags: ['api'],
            validate: AgentValidator.findSettingsByName,
            handler: AgentController.findSettingsByName
        }
    }
];

module.exports = AgentRoutes;
