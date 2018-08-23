'use strict';

const Joi = require('joi');
const ActionSchema = require('../../../models/index').Action.schema;
const WebhookSchema = require('../../../models/index').Webhook.schema;
const SlotSchema = require('../../../models/index').Slot.schema;
const PostFormatSchema = require('../../../models/index').PostFormat.schema;

class ActionValidate {
    constructor() {

        this.add = {
            payload: (() => {

                return {
                    agent: ActionSchema.agent.required().error(new Error('The agent is required. Please specify an agent for the action.')),
                    domain: ActionSchema.domain.required().error(new Error('The domain is required. Please specify a domain for the action')),
                    actionName: ActionSchema.actionName.required().error(new Error('The action name is required')),
                    useWebhook: ActionSchema.useWebhook.required().error(new Error('Please specify if this action use a webhook for fullfilment.')),
                    usePostFormat: ActionSchema.usePostFormat.required().error(new Error('Please specify if this action use a post format for fullfilment.')),
                    responses: ActionSchema.responses.required().min(1).error(new Error('Please specify at least one response.')),
                    slots: Joi.array().items({
                        slotName: SlotSchema.slotName.required(),
                        uiColor: SlotSchema.uiColor.required(),
                        keyword: SlotSchema.keyword,
                        keywordId: SlotSchema.keywordId,
                        isList: SlotSchema.isList.required(),
                        isRequired: SlotSchema.isRequired.required(),
                        textPrompts: SlotSchema.textPrompts
                    })
                };
            })()
        };

        this.findById = {
            params: (() => {

                return {
                    id: ActionSchema.id.required().description('Id of the action')
                };
            })()
        };

        this.updateById = {
            params: (() => {

                return {
                    id: ActionSchema.id.required().description('Id of the action')
                };
            })(),
            payload: (() => {

                return {
                    actionName: ActionSchema.actionName,
                    useWebhook: ActionSchema.useWebhook,
                    usePostFormat: ActionSchema.usePostFormat,
                    responses: ActionSchema.responses,
                    slots: Joi.array().items({
                        slotName: SlotSchema.slotName.required(),
                        uiColor: SlotSchema.uiColor.required(),
                        keyword: SlotSchema.keyword,
                        keywordId: SlotSchema.keywordId,
                        isList: SlotSchema.isList.required(),
                        isRequired: SlotSchema.isRequired.required(),
                        textPrompts: SlotSchema.textPrompts
                    })
                };
            })()
        };

        this.deleteById = {
            params: (() => {

                return {
                    id: ActionSchema.id.required().description('Id of the action')
                };
            })()
        };

        this.addWebhook = {
            params: (() => {

                return {
                    id: ActionSchema.id.required().description('Id of the action')
                };
            })(),
            payload: (() => {

                return {
                    agent: ActionSchema.agent.required().error(new Error('The agent is required. Please specify an agent for the webhook.')),
                    domain: ActionSchema.domain.required().error(new Error('The domain is required. Please specify a domain for the webhook.')),
                    action: ActionSchema.actionName.required().error(new Error('The action is required. Please specify an action for the webhook.')),
                    webhookUrl: WebhookSchema.webhookUrl.required().error(new Error('The url is required. Please specify an url for the webhook.')),
                    webhookVerb: WebhookSchema.webhookVerb.required().valid('GET', 'PUT', 'POST', 'DELETE', 'PATCH').error(new Error('Please provide a valid verb for the webhook. Supported verbs are: GET, PUT, POST, DELETE, PATCH.')),
                    webhookPayloadType: WebhookSchema.webhookPayloadType.required().valid('None', 'JSON', 'XML', 'URL Encoded').error(new Error('Please provide a valid payload type for the webhook. Supported types are: None, JSON, XML, and URL Encoded.')),
                    webhookPayload: WebhookSchema.webhookPayload.allow('').optional()
                };
            })()
        };

        this.findWebhook = {
            params: (() => {

                return {
                    id: ActionSchema.id.required().description('Id of the action')
                };
            })()
        };

        this.updateWebhook = {
            params: (() => {

                return {
                    id: ActionSchema.id.required().description('Id of the action')
                };
            })(),
            payload: (() => {

                return {
                    webhookUrl: WebhookSchema.webhookUrl,
                    webhookVerb: WebhookSchema.webhookVerb.valid('GET', 'PUT', 'POST', 'DELETE', 'PATCH').error(new Error('Please provide a valid verb for the webhook. Supported verbs are: GET, PUT, POST, DELETE, PATCH.')),
                    webhookPayloadType: WebhookSchema.webhookPayloadType.valid('None', 'JSON', 'XML', 'URL Encoded').error(new Error('Please provide a valid payload type for the webhook. Supported types are: None, JSON, XML, and URL Encoded.')),
                    webhookPayload: WebhookSchema.webhookPayload.allow('').optional()
                };
            })()
        };

        this.deleteWebhook = {
            params: (() => {

                return {
                    id: ActionSchema.id.required().description('Id of the action')
                };
            })()
        };


        this.addPostFormat = {
            params: (() => {

                return {
                    id: PostFormatSchema.id.required().description('Id of the action')
                };
            })(),
            payload: (() => {

                return {
                    agent: ActionSchema.agent.required().error(new Error('The agent is required. Please specify an agent for the post format.')),
                    domain: ActionSchema.domain.required().error(new Error('The domain is required. Please specify a domain for the post format.')),
                    action: ActionSchema.actionName.required().error(new Error('The action is required. Please specify an action for the post format.')),
                    postFormatPayload: PostFormatSchema.postFormatPayload.allow('').required()
                };
            })()
        };

        this.findPostFormat = {
            params: (() => {

                return {
                    id: PostFormatSchema.id.required().description('Id of the action')
                };
            })()
        };

        this.updatePostFormat = {
            params: (() => {

                return {
                    id: PostFormatSchema.id.required().description('Id of the action')
                };
            })(),
            payload: (() => {

                return {
                    postFormatPayload: PostFormatSchema.postFormatPayload.allow('').optional()
                };
            })()
        };

        this.deletePostFormat = {
            params: (() => {

                return {
                    id: ActionSchema.id.required().description('Id of the action')
                };
            })()
        };
    }
}

const actionValidate = new ActionValidate();
module.exports = actionValidate;
