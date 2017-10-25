'use strict';
const AgentSchema = require('../../../models/index').Agent.schema;
const EntitySchema = require('../../../models/index').Entity.schema;
const DomainSchema = require('../../../models/index').Domain.schema;
const IntentSchema = require('../../../models/index').Intent.schema;
const Joi = require('joi');

class AgentValidate {
    constructor() {

        this.findAll = {
            query: (() => {

                return {
                    size: Joi.number().description('Number of elements to return. Default 10')
                };
            })()
        };

        this.findById = {
            params: (() => {

                return {
                    id: AgentSchema._id.required().description('Id of the agent')
                };
            })()
        };

        this.findEntitiesByAgentId = {
            params: (() => {

                return {
                    id: AgentSchema._id.required().description('Id of the agent')
                };
            })(),
            query: (() => {

                return {
                    size: Joi.number().description('Number of elements to return. Default 10')
                };
            })()
        };

        this.findEntityByIdByAgentId = {
            params: (() => {

                return {
                    id: AgentSchema._id.required().description('Id of the agent'),
                    entityId: EntitySchema._id.required().description('Id of the entity')
                };
            })()
        };

        this.findDomainsByAgentId = {
            params: (() => {

                return {
                    id: AgentSchema._id.required().description('Id of the agent')
                };
            })(),
            query: (() => {

                return {
                    size: Joi.number().description('Number of elements to return. Default 10')
                };
            })()
        };

        this.findDomainByIdByAgentId = {
            params: (() => {

                return {
                    id: AgentSchema._id.required().description('Id of the agent'),
                    domainId: DomainSchema._id.required().description('Id of the domain')
                };
            })()
        };

        this.findIntentsInDomainByIdByAgentId = {
            params: (() => {

                return {
                    id: AgentSchema._id.required().description('Id of the agent'),
                    domainId: DomainSchema._id.required().description('Id of the domain')
                };
            })(),
            query: (() => {

                return {
                    size: Joi.number().description('Number of elements to return. Default 10')
                };
            })()
        };

        this.findIntentByIdInDomainByIdByAgentId = {
            params: (() => {

                return {
                    id: AgentSchema._id.required().description('Id of the agent'),
                    domainId: DomainSchema._id.required().description('Id of the domain'),
                    intentId: IntentSchema._id.required().description('Id of the intent')
                };
            })()
        };

        this.findIntentScenarioInDomainByIdByAgentId = {
            params: (() => {

                return {
                    id: AgentSchema._id.required().description('Id of the agent'),
                    domainId: DomainSchema._id.required().description('Id of the domain'),
                    intentId: IntentSchema._id.required().description('Id of the intent')
                };
            })(),
            query: (() => {

                return {
                    size: Joi.number().description('Number of elements to return. Default 10')
                };
            })()
        };

        this.add = {
            payload: (() => {

                return {
                    agentName: AgentSchema.agentName.required(),
                    webhookUrl: AgentSchema.webhookUrl.required(),
                    domainClassifierThreshold: AgentSchema.domainClassifierThreshold.required(),
                    fallbackResponses: AgentSchema.fallbackResponses.required(),
                    useWebhookFallback: AgentSchema.useWebhookFallback.required(),
                    webhookFallbackUrl: AgentSchema.webhookFallbackUrl
                };
            })()
        };

        this.updateById = {
            params: (() => {

                return {
                    id: AgentSchema._id.required().description('Id of the agent')
                };
            })(),
            payload: (() => {

                return {
                    agentName: AgentSchema.agentName,
                    webhookUrl: AgentSchema.webhookUrl,
                    domainClassifierThreshold: AgentSchema.domainClassifierThreshold,
                    fallbackResponses: AgentSchema.fallbackResponses,
                    useWebhookFallback: AgentSchema.useWebhookFallback,
                    webhookFallbackUrl: AgentSchema.webhookFallbackUrl
                };
            })()
        };

        this.deleteById = {
            params: (() => {

                return {
                    id: AgentSchema._id.required().description('Id of the agent')
                };
            })()
        };

        this.parse = {
            params: (() => {

                return {
                    id: AgentSchema._id.required().description('Id of the agent')
                };
            })(),
            query: (() => {

                return {
                    text: Joi.string().required().description('Text to parse'),
                    timezone: Joi.string().description('Timezone for duckling parse. Default America/Kentucky/Louisville')
                };
            })()
        };
        this.converse = {
            params: (() => {

                return {
                    id: AgentSchema._id.required().description('Id of the agent')
                };
            })(),
            query: (() => {

                return {
                    text: Joi.string().required().description('Text to parse'),
                    timezone: Joi.string().description('Timezone for duckling parse. Default America/Kentucky/Louisville')
                };
            })()
        };
    }
}

const agentValidate = new AgentValidate();
module.exports = agentValidate;
