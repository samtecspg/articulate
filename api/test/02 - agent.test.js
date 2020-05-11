import Code from 'code';
import Lab from 'lab';
import _ from 'lodash';
import * as Server from '../server';
import {
    ROUTE_AGENT,
    STATUS_READY,
    ROUTE_ACTION,
    ROUTE_POST_FORMAT,
    ROUTE_WEBHOOK,
    ROUTE_CATEGORY,
    ROUTE_SAYING,
    ROUTE_KEYWORD,
    ROUTE_SETTINGS,
    CONFIG_SETTINGS_DEFAULT_AGENT,
    CONFIG_SETTINGS_RASA_URL,
    STATUS_OUT_OF_DATE,
} from '../util/constants';
import importAgent from './data/importAgent.json';
import postAgent from './data/postAgent.json';
import postAction from './data/postAction.json';
import postCategory from './data/postCategory.json';
import postKeyword from './data/postKeyword.json';

// Test shortcuts
const { describe, it, before, after } = exports.lab = Lab.script();
const { expect } = Code;

let postedAgentId = null;
let postedAgentActionId = null;
let postedAgentCategoryId = null;
let postedCategorySayingId = null;
let postedAgentKeywordId = null;

const deleteRemainingPostedAndImportedAgents = async (server) => {
    await deleteRemainingAgent(server, postAgent.agentName);
    await deleteRemainingAgent(server, importAgent.agentName);
}

const deleteRemainingAgent = async (server, agentName) => {
    var response = await server.inject(`/${ROUTE_AGENT}/search/agentName/${agentName}`);
    var id = '';
    if (response.result.id) {
        var id = Number(response.result.id)
        response = await server.inject({
            url: `/${ROUTE_AGENT}/${id}`,
            method: 'DELETE'
        });
    }
}

const loadImportAgent = async (server) => {
    await server.inject({
        url: `/${ROUTE_AGENT}/import`,
        payload: { agent: importAgent },
        method: 'POST'
    });
    return await server.inject(`/${ROUTE_AGENT}/search/agentName/${importAgent.agentName}`);
}

var server = null;

describe('Agent', () => {

    before(async ({ context }) => {
        server = await Server.deployment();
        await deleteRemainingPostedAndImportedAgents(server);
        var importAgentResponse = await loadImportAgent(server);
        context.importedAgentId = importAgentResponse.result.id;
    });

    it('post /agent', async ({ context }) => {

        const response = await server.inject({
            url: `/${ROUTE_AGENT}`,
            payload: postAgent,
            method: 'POST'
        });
        postedAgentId = response.result.id;

        expect(response.statusCode).to.equal(200);
        expect(response.result.agentName).to.be.equal(postAgent.agentName);
        expect(response.result.status).to.be.equal(STATUS_READY);
    });
    it('get /agent', async ({ context }) => {

        const response = await server.inject(`/${ROUTE_AGENT}`);

        expect(response.statusCode).to.equal(200);
        expect(response.result.data).to.be.an.array();
        expect(response.result.data.length).to.be.greaterThan(0);
        expect(response.result.totalCount).to.be.greaterThan(0);
    });

    it('get /agent/agentId', async ({ context }) => {

        const { importedAgentId } = context;
        const response = await server.inject(`/${ROUTE_AGENT}/${importedAgentId}`);

        expect(response.statusCode).to.equal(200);
        expect(response.result.agentName).to.be.equal(importAgent.agentName);
    });


    it('delete /agent/agentId', async () => {

        const response = await server.inject({
            url: `/${ROUTE_AGENT}/${postedAgentId}`,
            method: 'DELETE'
        });

        expect(response.statusCode).to.equal(200);
    });

    it('put /agent/agentId', async ({ context }) => {

        const { importedAgentId } = context;

        const payload = {
            description: 'This agent was updated'
        };

        const response = await server.inject({
            url: `/${ROUTE_AGENT}/${importedAgentId}`,
            payload,
            method: 'PUT'
        });

        expect(response.statusCode).to.equal(200);
        expect(response.result).to.contain(payload);
    });

    it('post /agent/agentId/action', async ({ context }) => {

        const { importedAgentId } = context;
        const response = await server.inject({
            url: `/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_ACTION}`,
            payload: postAction,
            method: 'POST'
        });
        postedAgentActionId = response.result.id;

        expect(response.statusCode).to.equal(200);
        expect(response.result.actionName).to.be.equal(postAction.actionName);
    });

    it('get /agent/agentId/action', async ({ context }) => {

        const { importedAgentId } = context;
        const response = await server.inject(`/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_ACTION}`);

        expect(response.statusCode).to.equal(200);
        expect(response.result.data).to.be.an.array();
        expect(response.result.data.length).to.be.greaterThan(0);
        expect(response.result.totalCount).to.be.greaterThan(0);
    });

    it('get /agent/agentId/action/actionId', async ({ context }) => {

        const { importedAgentId } = context;
        const response = await server.inject(`/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_ACTION}/${postedAgentActionId}`);

        expect(response.statusCode).to.equal(200);
        expect(response.result.actionName).to.be.equal(postAction.actionName);
    });

    it('put /agent/agentId/action/actionId', async ({ context }) => {

        const { importedAgentId } = context;
        const server = await Server.deployment();

        const payload = {
            actionName: 'updatedActionName'
        };

        const response = await server.inject({
            url: `/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_ACTION}/${postedAgentActionId}`,
            payload,
            method: 'PUT'
        });

        expect(response.statusCode).to.equal(200);
        expect(response.result).to.contain(payload);
    });

    it('post /agent/agentId/action/actionId/postFormat', async ({ context }) => {

        const { importedAgentId } = context;

        const payload = {
            postFormatPayload: '{"textResponse" : "{{ textResponse }}", "docId" : "{{ docId }}"}'
        }

        const response = await server.inject({
            url: `/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_ACTION}/${postedAgentActionId}/${ROUTE_POST_FORMAT}`,
            payload,
            method: 'POST'
        });

        expect(response.statusCode).to.equal(200);
    });

    it('get /agent/agentId/action/actionId/postFormat', async ({ context }) => {

        const { importedAgentId } = context;
        const response = await server.inject(`/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_ACTION}/${postedAgentActionId}/${ROUTE_POST_FORMAT}`);

        expect(response.statusCode).to.equal(200);
        expect(response.result.postFormatPayload).to.be.an.string();
    });

    it('put /agent/agentId/action/actionId/postFormat', async ({ context }) => {

        const { importedAgentId } = context;

        const payload = {
            postFormatPayload: 'updated payload'
        }

        const response = await server.inject({
            url: `/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_ACTION}/${postedAgentActionId}/${ROUTE_POST_FORMAT}`,
            payload,
            method: 'PUT'
        });

        expect(response.statusCode).to.equal(200);
    });

    it('delete /agent/agentId/action/actionId/postFormat', async ({ context }) => {

        const { importedAgentId } = context;
        const response = await server.inject({
            url: `/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_ACTION}/${postedAgentActionId}/${ROUTE_POST_FORMAT}`,
            method: 'DELETE'
        });

        expect(response.statusCode).to.equal(200);
    });


    it('post /agent/agentId/action/actionId/webhook', async ({ context }) => {

        const { importedAgentId } = context;

        const payload = {
            webhookKey: "Key",
            webhookUrl: 'string',
            webhookVerb: 'GET',
            webhookPayloadType: 'None',
            webhookPayload: 'string',
            webhookHeaders: [
                {
                    'key': 'string',
                    'value': 'string'
                }
            ],
            webhookUser: 'string',
            webhookPassword: 'string'
        }

        const response = await server.inject({
            url: `/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_ACTION}/${postedAgentActionId}/${ROUTE_WEBHOOK}`,
            payload,
            method: 'POST'
        });

        expect(response.statusCode).to.equal(200);
    });

    it('get /agent/agentId/action/actionId/webhook', async ({ context }) => {

        const { importedAgentId } = context;
        const response = await server.inject(`/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_ACTION}/${postedAgentActionId}/${ROUTE_WEBHOOK}`);

        expect(response.statusCode).to.equal(200);
        expect(response.result.webhookUrl).to.be.an.string();
    });


    it('put /agent/agentId/action/actionId/webhook', async ({ context }) => {

        const { importedAgentId } = context;

        const payload = {
            webhookUrl: 'updated payload'
        }

        const response = await server.inject({
            url: `/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_ACTION}/${postedAgentActionId}/${ROUTE_WEBHOOK}`,
            payload,
            method: 'PUT'
        });

        expect(response.statusCode).to.equal(200);
    });

    it('delete /agent/agentId/action/actionId/webhook', async ({ context }) => {

        const { importedAgentId } = context;
        const response = await server.inject({
            url: `/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_ACTION}/${postedAgentActionId}/${ROUTE_WEBHOOK}`,
            method: 'DELETE'
        });

        expect(response.statusCode).to.equal(200);
    });

    it('delete /agent/agentId/action/actionId', async ({ context }) => {

        const { importedAgentId } = context;
        const response = await server.inject({
            url: `/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_ACTION}/${postedAgentActionId}`,
            method: 'DELETE'
        });

        expect(response.statusCode).to.equal(200);
    });

    it('post /agent/agentId/category', async ({ context }) => {

        const { importedAgentId } = context;
        const response = await server.inject({
            url: `/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_CATEGORY}`,
            payload: postCategory,
            method: 'POST'
        });
        postedAgentCategoryId = response.result.id;

        expect(response.statusCode).to.equal(200);
        expect(response.result.categoryName).to.be.equal(postCategory.categoryName);
    });

    it('get /agent/agentId/category', async ({ context }) => {

        const { importedAgentId } = context;
        const response = await server.inject(`/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_CATEGORY}`);

        expect(response.statusCode).to.equal(200);
        expect(response.result.data).to.be.an.array();
        expect(response.result.data.length).to.be.greaterThan(0);
        expect(response.result.totalCount).to.be.greaterThan(0);
    });


    it('get /agent/agentId/category/categoryId', async ({ context }) => {

        const { importedAgentId } = context;
        const response = await server.inject(`/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_CATEGORY}/${postedAgentCategoryId}`);

        expect(response.statusCode).to.equal(200);
        expect(response.result.categoryName).to.be.equal(postCategory.categoryName);
    });

    it('put /agent/agentId/category/categoryId', async ({ context }) => {

        const { importedAgentId } = context;

        const payload = {
            categoryName: 'updatedCategoryName'
        };

        const response = await server.inject({
            url: `/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_CATEGORY}/${postedAgentCategoryId}`,
            payload,
            method: 'PUT'
        });

        expect(response.statusCode).to.equal(200);
        expect(response.result).to.contain(payload);
    });

    it('post /agent/agentId/category/categoryId/saying', async ({ context }) => {

        const { importedAgentId } = context;

        const payload = {
            userSays: 'string',
            keywords: [],
            actions: []
        }

        const response = await server.inject({
            url: `/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_CATEGORY}/${postedAgentCategoryId}/${ROUTE_SAYING}`,
            payload,
            method: 'POST'
        });
        postedCategorySayingId = response.result.id;

        expect(response.statusCode).to.equal(200);
    });

    it('get /agent/agentId/category/categoryId/saying', async ({ context }) => {

        const { importedAgentId } = context;
        const response = await server.inject(`/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_CATEGORY}/${postedAgentCategoryId}/${ROUTE_SAYING}`);

        expect(response.statusCode).to.equal(200);
        expect(response.result.data).to.be.an.array();
        expect(response.result.data.length).to.be.greaterThan(0);
        expect(response.result.totalCount).to.be.greaterThan(0);
    });

    it('get /agent/agentId/category/categoryId/saying/sayingId', async ({ context }) => {

        const { importedAgentId } = context;
        const response = await server.inject(`/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_CATEGORY}/${postedAgentCategoryId}/${ROUTE_SAYING}/${postedCategorySayingId}`);

        expect(response.statusCode).to.equal(200);
        expect(response.result.userSays).to.be.equal('string');
    });

    it('put /agent/agentId/category/categoryId/saying/sayingId', async ({ context }) => {

        const { importedAgentId } = context;

        const payload = {
            userSays: 'Change of text',
            keywords: [],
            actions: []
        };

        const response = await server.inject({
            url: `/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_CATEGORY}/${postedAgentCategoryId}/${ROUTE_SAYING}/${postedCategorySayingId}`,
            payload,
            method: 'PUT'
        });

        expect(response.statusCode).to.equal(200);
        expect(response.result).to.contain(payload);
    });

    it('delete /agent/agentId/category/categoryId/saying/sayingId', async ({ context }) => {

        const { importedAgentId } = context;
        const response = await server.inject({
            url: `/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_CATEGORY}/${postedAgentCategoryId}/${ROUTE_SAYING}/${postedCategorySayingId}`,
            method: 'DELETE'
        });

        expect(response.statusCode).to.equal(200);
    });

    it('delete /agent/agentId/category/categoryId', async ({ context }) => {

        const { importedAgentId } = context;
        const response = await server.inject({
            url: `/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_CATEGORY}/${postedAgentCategoryId}`,
            method: 'DELETE'
        });

        expect(response.statusCode).to.equal(200);
    });

    it('get /agent/agentId/export', async ({ context }) => {

        const { importedAgentId } = context;
        const response = await server.inject(`/${ROUTE_AGENT}/${importedAgentId}/export`);

        expect(response.statusCode).to.equal(200);
        expect(response.result).to.be.an.object();
        expect(response.result.actionName).to.be.equal(importAgent.actionName);
    });


    it('get /agent/agentId/identifyKeywords', async ({ context }) => {

        const { importedAgentId } = context;
        const server = await Server.deployment();

        const example = {
            userSays: 'I\'d like to order a pizza with ham and pineapple',
            keywords: [
                {
                    value: "ham",
                    keyword: "toppings",
                    start: 31,
                    end: 34
                },
                {
                    value: "pineapple",
                    keyword: "toppings",
                    start: 39,
                    end: 48
                }
            ]
        };
        const response = await server.inject(`/${ROUTE_AGENT}/${importedAgentId}/identifyKeywords?text=${example.userSays}`);

        expect(response.statusCode).to.equal(200);
        expect(response.result).to.be.an.array();
        example.keywords.forEach((keyword, index) => {
            expect(response.result[index].value).to.be.equal(keyword.value);
            expect(response.result[index].start).to.be.equal(keyword.start);
            expect(response.result[index].end).to.be.equal(keyword.end);
        });
    });


    it('post /agent/agentId/keyword', async ({ context }) => {

        const { importedAgentId } = context;
        const response = await server.inject({
            url: `/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_KEYWORD}`,
            payload: postKeyword,
            method: 'POST'
        });
        postedAgentKeywordId = response.result.id;

        expect(response.statusCode).to.equal(200);
        expect(response.result.keywordName).to.be.equal(postKeyword.keywordName);
    });

    it('get /agent/agentId/keyword', async ({ context }) => {

        const { importedAgentId } = context;
        const response = await server.inject(`/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_KEYWORD}`);

        expect(response.statusCode).to.equal(200);
        expect(response.result.data).to.be.an.array();
        expect(response.result.data.length).to.be.greaterThan(0);
        expect(response.result.totalCount).to.be.greaterThan(0);
    });

    it('get /agent/agentId/keyword/keywordId', async ({ context }) => {

        const { importedAgentId } = context;
        const response = await server.inject(`/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_KEYWORD}/${postedAgentKeywordId}`);

        expect(response.statusCode).to.equal(200);
        expect(response.result.keywordName).to.be.equal(postKeyword.keywordName);
    });

    it('put /agent/agentId/keyword/keywordId', async ({ context }) => {

        const { importedAgentId } = context;

        const payload = {
            keywordName: 'updatedKeywordName'
        };

        const response = await server.inject({
            url: `/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_KEYWORD}/${postedAgentKeywordId}`,
            payload,
            method: 'PUT'
        });

        expect(response.statusCode).to.equal(200);
        expect(response.result).to.contain(payload);
    });

    it('delete /agent/agentId/keyword/keywordId', async ({ context }) => {

        const { importedAgentId } = context;
        const response = await server.inject({
            url: `/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_KEYWORD}/${postedAgentKeywordId}`,
            method: 'DELETE'
        });

        expect(response.statusCode).to.equal(200);
    });


    it('post /agent/agentId/postFormat', async ({ context }) => {

        const { importedAgentId } = context;

        const payload = {
            postFormatPayload: '{"textResponse" : "{{ textResponse }}", "docId" : "{{ docId }}"}'
        }

        const response = await server.inject({
            url: `/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_POST_FORMAT}`,
            payload,
            method: 'POST'
        });

        expect(response.statusCode).to.equal(200);
    });

    it('get /agent/agentId/postFormat', async ({ context }) => {

        const { importedAgentId } = context;
        const response = await server.inject(`/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_POST_FORMAT}`);

        expect(response.statusCode).to.equal(200);
        expect(response.result.postFormatPayload).to.be.an.string();
    });

    it('put /agent/agentId/postFormat', async ({ context }) => {

        const { importedAgentId } = context;

        const payload = {
            postFormatPayload: 'updated payload'
        }

        const response = await server.inject({
            url: `/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_POST_FORMAT}`,
            payload,
            method: 'PUT'
        });

        expect(response.statusCode).to.equal(200);
    });


    it('delete /agent/agentId/postFormat', async ({ context }) => {

        const { importedAgentId } = context;
        const response = await server.inject({
            url: `/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_POST_FORMAT}`,
            method: 'DELETE'
        });

        expect(response.statusCode).to.equal(200);
    });

    it('get /agent/agentId/saying', async ({ context }) => {

        const { importedAgentId } = context;
        const response = await server.inject(`/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_SAYING}`);

        expect(response.statusCode).to.equal(200);
        expect(response.result.data).to.be.an.array();
        expect(response.result.data.length).to.be.greaterThan(0);
        expect(response.result.totalCount).to.be.greaterThan(0);
    });

    it('get /agent/agentId/settings', async ({ context }) => {

        const { importedAgentId } = context;
        const response = await server.inject(`/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_SETTINGS}`);

        expect(response.statusCode).to.equal(200);
        expect(response.result).to.be.an.object();

        const agentSettings = Object.keys(response.result);
        CONFIG_SETTINGS_DEFAULT_AGENT.forEach((setting) => {
            expect(agentSettings.indexOf(setting)).to.be.not.equal(-1);
        });
    });

    it('put /agent/agentId/settings', async ({ context }) => {

        const { importedAgentId } = context;
        const currentAgentSettings = await server.inject(`/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_SETTINGS}`);
        const response = await server.inject({
            url: `/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_SETTINGS}`,
            payload: currentAgentSettings.result,
            method: 'PUT'
        });

        expect(response.statusCode).to.equal(200);
        expect(response.result).to.be.an.object();

        const agentSettings = Object.keys(response.result.settings);
        CONFIG_SETTINGS_DEFAULT_AGENT.forEach((setting) => {
            expect(agentSettings.indexOf(setting)).to.be.not.equal(-1);
        });
    });

    it('get /agent/agentId/settings/name', async ({ context }) => {

        const { importedAgentId } = context;
        const response = await server.inject(`/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_SETTINGS}/${CONFIG_SETTINGS_RASA_URL}`);

        expect(response.statusCode).to.equal(200);
        expect(response.result).to.be.an.string();
    });

    it('post /agent/agentId/webhook', async ({ context }) => {

        const { importedAgentId } = context;

        const payload = {
            webhookKey: 'string',
            webhookUrl: 'string',
            webhookVerb: 'GET',
            webhookPayloadType: 'None',
            webhookPayload: 'string',
            webhookHeaders: [
                {
                    'key': 'string',
                    'value': 'string'
                }
            ],
            webhookUser: 'string',
            webhookPassword: 'string'
        }

        const response = await server.inject({
            url: `/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_WEBHOOK}`,
            payload,
            method: 'POST'
        });

        expect(response.statusCode).to.equal(200);
    });


    it('get /agent/agentId/webhook', async ({ context }) => {

        const { importedAgentId } = context;
        const server = await Server.deployment();
        const response = await server.inject(`/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_WEBHOOK}`);

        expect(response.statusCode).to.equal(200);
        expect(response.result.webhookUrl).to.be.an.string();
    });

    it('put /agent/agentId/webhook', async ({ context }) => {

        const { importedAgentId } = context;

        const payload = {
            webhookUrl: 'updated payload'
        }

        const server = await Server.deployment();
        const response = await server.inject({
            url: `/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_WEBHOOK}`,
            payload,
            method: 'PUT'
        });

        expect(response.statusCode).to.equal(200);
    });

    it('delete /agent/agentId/webhook', async ({ context }) => {

        const { importedAgentId } = context;
        const server = await Server.deployment();
        const response = await server.inject({
            url: `/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_WEBHOOK}`,
            method: 'DELETE'
        });

        expect(response.statusCode).to.equal(200);
    });


    it('post /agent/import', async ({ context }) => {

        const server = await Server.deployment();

        const importAgentCopy = _.clone(importAgent);
        importAgentCopy.agentName = '57f0a070-bcff-11e8-bd42-f7ad09e07ef5-copy'; //For uniqueness
        await server.inject({
            url: `/${ROUTE_AGENT}/import`,
            payload: { agent: importAgentCopy },
            method: 'POST'
        });
        const response = await server.inject(`/${ROUTE_AGENT}/search/agentName/${importAgentCopy.agentName}`);

        expect(response.statusCode).to.equal(200);
        expect(response.result.agentName).to.be.equal(importAgentCopy.agentName);
        expect(response.result.status).to.be.equal(STATUS_OUT_OF_DATE);

        await server.inject({
            url: `/${ROUTE_AGENT}/${response.result.id}`,
            method: 'DELETE'
        });
    });

    it('get /agent/search/field/value', async () => {

        const server = await Server.deployment();
        const response = await server.inject(`/${ROUTE_AGENT}/search/agentName/${importAgent.agentName}`);

        expect(response.statusCode).to.equal(200);
        expect(response.result.agentName).to.be.equal(importAgent.agentName);
    });

    after(async ({ context }) => {

        const { importedAgentId } = context;
        const server = await Server.deployment();
        await server.inject({
            url: `/${ROUTE_AGENT}/${importedAgentId}`,
            method: 'DELETE'
        });
    });

});


