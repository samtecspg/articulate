'use strict';
const AgentController = require('../controllers');
const AgentValidator = require('./agent.validator');
const PKG = require('../../../package');
const AgentRoutes = [
    {
        method: 'GET',
        path: '/agent',
        config: {
            description: 'Find all instances of the model from the data source',
            tags: ['api'],
            plugins: {
                'flow-loader': {
                    name: `${PKG.name}/agent.find-all.graph`,
                    consumes: ['redis']
                }
            },
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
            plugins: {
                'flow-loader': {
                    name: `${PKG.name}/agent.find-by-id.graph`,
                    consumes: ['redis']
                }
            },
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
        path: '/agent/{id}/keyword',
        config: {
            description: 'Find list of keywords linked with a model instance specified by id',
            tags: ['api'],
            plugins: {
                'flow-loader': {
                    name: `${PKG.name}/agent.find-keywords-by-agent-id.graph`,
                    consumes: ['redis']
                }
            },
            validate: AgentValidator.findKeywordsByAgentId,
            handler: AgentController.findKeywordsByAgentId
        }
    },
    {
        method: 'GET',
        path: '/agent/{id}/keyword/{keywordId}',
        config: {
            description: 'Find an keyword by id that belongs to the specified model instance',
            tags: ['api'],
            validate: AgentValidator.findKeywordByIdByAgentId,
            handler: AgentController.findKeywordByIdByAgentId
        }
    },
    {
        method: 'GET',
        path: '/agent/{id}/domain',
        config: {
            description: 'Find list of domains linked with a model instance specified by id',
            tags: ['api'],
            plugins: {
                'flow-loader': {
                    name: `${PKG.name}/agent.find-domains-by-agent-id.graph`,
                    consumes: ['redis']
                }
            },
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
            plugins: {
                'flow-loader': {
                    name: `${PKG.name}/agent.find-domain-by-id-by-agent-id.graph`,
                    consumes: ['redis']
                }
            },
            validate: AgentValidator.findDomainByIdByAgentId,
            handler: AgentController.findDomainByIdByAgentId
        }
    },
    {
        method: 'GET',
        path: '/agent/{id}/action/{actionId}',
        config: {
            description: 'Find an action by id given a domain and an agent',
            tags: ['api'],
            validate: AgentValidator.findActionByIdByAgentId,
            handler: AgentController.findActionByIdByAgentId
        }
    },
    {
        method: 'GET',
        path: '/agent/{id}/domain/{domainId}/saying',
        config: {
            description: 'Find list of sayings for the given domain and agent',
            tags: ['api'],
            plugins: {
                'flow-loader': {
                    name: `${PKG.name}/agent.find-sayings-in-domain-by-id-by-agent-id.graph`,
                    consumes: ['redis']
                }
            },
            validate: AgentValidator.findSayingsInDomainByIdByAgentId,
            handler: AgentController.findSayingsInDomainByIdByAgentId
        }
    },
    {
        method: 'GET',
        path: '/agent/{id}/domain/{domainId}/saying/{sayingId}',
        config: {
            description: 'Find an saying by id given a domain and an agent',
            tags: ['api'],
            validate: AgentValidator.findSayingByIdInDomainByIdByAgentId,
            handler: AgentController.findSayingByIdInDomainByIdByAgentId
        }
    },
    {
        method: 'GET',
        path: '/agent/{id}/action/{actionId}/webhook',
        config: {
            description: 'Find the webhook related with an action, for the given domain and agent',
            plugins: {
                'flow-loader': {
                    name: `${PKG.name}/agent.find-action-webhook-in-domain-by-id-by-agent-id.graph`,
                    consumes: ['redis']
                }
            },
            tags: ['api'],
            validate: AgentValidator.findActionWebhookByAgentId,
            handler: AgentController.findActionWebhookByAgentId
        }
    },
    {
        method: 'GET',
        path: '/agent/{id}/action/{actionId}/postFormat',
        config: {
            description: 'Find the post format related with an action, for the given domain and agent',
            plugins: {
                'flow-loader': {
                    name: `${PKG.name}/agent.find-action-post-format-in-domain-by-id-by-agent-id.graph`,
                    consumes: ['redis']
                }
            },
            tags: ['api'],
            validate: AgentValidator.findActionPostFormatByAgentId,
            handler: AgentController.findActionPostFormatByAgentId
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
            plugins: {
                'flow-loader': {
                    name: `${PKG.name}/agent.parse.graph`,
                    consumes: []
                }
            },
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
            plugins: {
                'flow-loader': {
                    name: `${PKG.name}/agent.parse.graph`,
                    consumes: []
                }
            },
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
            plugins: {
                'flow-loader': {
                    name: `${PKG.name}/agent.converse.graph`,
                    consumes: []
                }
            },
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
            plugins: {
                'flow-loader': {
                    name: `${PKG.name}/agent.converse.graph`,
                    consumes: []
                }
            },
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
        path: '/agent/{id}/saying',
        config: {
            description: 'Find list of sayings linked with a model instance specified by id',
            tags: ['api'],
            validate: AgentValidator.findSayingsByAgentId,
            handler: AgentController.findSayingsByAgentId
        }
    },
    {
        method: 'GET',
        path: '/agent/{id}/action',
        config: {
            description: 'Find list of actions linked with a model instance specified by id',
            tags: ['api'],
            plugins: {
                'flow-loader': {
                    name: `${PKG.name}/agent.find-actions-by-agent-id.graph`,
                    consumes: ['redis']
                }
            },
            validate: AgentValidator.findActionsByAgentId,
            handler: AgentController.findActionsByAgentId
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
            plugins: {
                'flow-loader': {
                    name: `${PKG.name}/agent.find-webhook-by-agent-id.graph`,
                    consumes: ['redis']
                }
            },
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
            description: 'Return all the settings of the agent',
            tags: ['api'],
            plugins: {
                'flow-loader': {
                    name: `${PKG.name}/agent.find-all-settings.graph`,
                    consumes: ['redis']
                }
            },
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
            plugins: {
                'flow-loader': {
                    name: `${PKG.name}/agent.find-settings-by-name.graph`,
                    consumes: ['redis']
                }
            },
            validate: AgentValidator.findSettingsByName,
            handler: AgentController.findSettingsByName
        }
    }
];

module.exports = AgentRoutes;
