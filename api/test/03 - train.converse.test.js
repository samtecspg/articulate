
import Code from 'code';
import Lab from 'lab';
import _ from 'lodash';
import * as Server from '../server';
import uuidv1 from 'uuid/v1';

import {
    ROUTE_AGENT,
    STATUS_READY,
    ROUTE_TRAIN,
    ROUTE_CONVERSE,
    ROUTE_CONTEXT
} from '../util/constants';
import importAgentConverse from './data/importAgentConverse.json';

// Test shortcuts
const { describe, it, before, after } = exports.lab = Lab.script();
const { expect } = Code;
const sessionId = uuidv1();

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

describe('Agent', () => {

    before(async ({ context }) => {

        console.log('Executing training-agent test, please wait... ');
        const server = await Server.deployment();

        await deleteRemainingAgent(server, importAgentConverse.agentName);

        await server.inject({
            url: `/${ROUTE_AGENT}/import`,
            payload: importAgentConverse,
            method: 'POST'
        });
        const response = await server.inject(`/${ROUTE_AGENT}/search/agentName/${importAgentConverse.agentName}`);
        context.importedAgentId = response.result.id;
    });

    it('post /agent/agentId/train', { timeout: 300000 }, async ({ context }) => {

        const { importedAgentId } = context;
        const server = await Server.deployment();
        const response = await server.inject({
            url: `/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_TRAIN}`,
            method: 'POST'
        });

        expect(response.statusCode).to.equal(200);
        expect(response.result.status).to.be.equal(STATUS_READY);
    });

    it('post /agent/agentId/converse - Checks action response with quick response of action', async ({ context }) => {

        const { importedAgentId } = context;
        const server = await Server.deployment();
        const payload = {
            sessionId,
            text: "Get a quick response from action",
            timezone: "UTC"
        };
        const response = await server.inject({
            url: `/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_CONVERSE}`,
            payload,
            method: 'POST'
        });

        expect(response.statusCode).to.equal(200);
        expect(response.result.textResponse).to.be.equal("This is an action");
        expect(response.result.responses[0].quickResponses[0]).to.be.equal("With a quick reply");
        expect(response.result.responses[0].quickResponses[1]).to.be.equal("With another quick reply");
        expect(response.result.responses).to.be.an.array();
        expect(response.result.responses.length).to.be.greaterThan(0);
        expect(response.result.responses[0].fulfilled).to.be.equal(true);
    });

    it('post /agent/agentId/converse - Checks action response with keyword inside saying', async ({ context }) => {

        const { importedAgentId } = context;
        const server = await Server.deployment();
        const payload = {
            sessionId,
            text: "This is normalKeyword1 action",
            timezone: "UTC"
        };
        const response = await server.inject({
            url: `/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_CONVERSE}`,
            payload,
            method: 'POST'
        });

        expect(response.statusCode).to.equal(200);
        expect(response.result.textResponse).to.be.equal("Normal Action Response");
        expect(response.result.responses).to.be.an.array();
        expect(response.result.responses.length).to.be.greaterThan(0);
        expect(response.result.responses[0].fulfilled).to.be.equal(true);
    });

    it('post /agent/agentId/converse - Checks default fallback action response', async ({ context }) => {

        const { importedAgentId } = context;
        const server = await Server.deployment();
        const payload = {
            sessionId,
            text: "Not learned saying",
            timezone: "UTC"
        };
        const response = await server.inject({
            url: `/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_CONVERSE}`,
            payload,
            method: 'POST'
        });

        expect(response.statusCode).to.equal(200);
        expect(response.result.textResponse).to.be.equal("Default Response");
        expect(response.result.responses).to.be.an.array();
        expect(response.result.responses.length).to.be.greaterThan(0);
        expect(response.result.responses[0].fulfilled).to.be.equal(true);
        expect(response.result.responses[0].isFallback).to.be.equal(true);
    });

    it('post /agent/agentId/converse - Checks for required empty slot asking a modifier for SET it include the slot in the answer (Handlebars)', async ({ context }) => {

        const { importedAgentId } = context;
        const server = await Server.deployment();
        var payload = {
            sessionId,
            text: "Request a modifier",
            timezone: "UTC"
        };
        var response = await server.inject({
            url: `/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_CONVERSE}`,
            payload,
            method: 'POST'
        });

        expect(response.statusCode).to.equal(200);
        expect(response.result.textResponse).to.be.equal("The slot is required");
        expect(response.result.responses).to.be.an.array();
        expect(response.result.responses.length).to.be.greaterThan(0);
        expect(response.result.responses[0].fulfilled).to.be.equal(false);

        payload = {
            sessionId,
            text: "use modifierKeyword1",
            timezone: "UTC"
        };
        var response = await server.inject({
            url: `/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_CONVERSE}`,
            payload,
            method: 'POST'
        });

        expect(response.statusCode).to.equal(200);
        expect(response.result.textResponse).to.be.equal("The slots: modifierKeyword1");
        expect(response.result.responses).to.be.an.array();
        expect(response.result.responses.length).to.be.greaterThan(0);
        expect(response.result.responses[0].fulfilled).to.be.equal(true);
    });

    it('post /agent/agentId/converse -  From previous a modifierKeyword1 is set, this one ADD another (turning it into a list)', async ({ context }) => {

        const server = await Server.deployment();
        const { importedAgentId } = context;

        var payload = {
            sessionId,
            text: "add modifierKeyword2",
            timezone: "UTC"
        };
        var response = await server.inject({
            url: `/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_CONVERSE}`,
            payload,
            method: 'POST'
        });

        expect(response.statusCode).to.equal(200);
        expect(response.result.textResponse).to.be.equal("The slots: modifierKeyword1,modifierKeyword2");
        expect(response.result.responses).to.be.an.array();
        expect(response.result.responses.length).to.be.greaterThan(0);
        expect(response.result.responses[0].fulfilled).to.be.equal(true);
    });

    it('post /agent/agentId/converse - From previous the slots are full, this one UNSET them and fill again to fullfill the action', async ({ context }) => {

        const server = await Server.deployment();
        const { importedAgentId } = context;

        var payload = {
            sessionId,
            text: "unset modifierKeyword2",
            timezone: "UTC"
        };
        var response = await server.inject({
            url: `/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_CONVERSE}`,
            payload,
            method: 'POST'
        });

        expect(response.statusCode).to.equal(200);
        expect(response.result.textResponse).to.be.equal("The slot is required");
        expect(response.result.responses).to.be.an.array();
        expect(response.result.responses.length).to.be.greaterThan(0);
        expect(response.result.responses[0].fulfilled).to.be.equal(false);

        payload = {
            sessionId,
            text: "use modifierKeyword1",
            timezone: "UTC"
        };
        var response = await server.inject({
            url: `/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_CONVERSE}`,
            payload,
            method: 'POST'
        });
    });


    it('post /agent/agentId/converse - From previous a modifierKeyword1 is set, this one REMOVE it and set it again to fullfill the action', async ({ context }) => {

        const server = await Server.deployment();
        const { importedAgentId } = context;

        var payload = {
            sessionId,
            text: "remove modifierKeyword1",
            timezone: "UTC"
        };
        var response = await server.inject({
            url: `/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_CONVERSE}`,
            payload,
            method: 'POST'
        });

        expect(response.statusCode).to.equal(200);
        expect(response.result.textResponse).to.be.equal("The slot is required");
        expect(response.result.responses).to.be.an.array();
        expect(response.result.responses.length).to.be.greaterThan(0);
        expect(response.result.responses[0].fulfilled).to.be.equal(false);

        payload = {
            sessionId,
            text: "use modifierKeyword1",
            timezone: "UTC"
        };
        var response = await server.inject({
            url: `/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_CONVERSE}`,
            payload,
            method: 'POST'
        });
    });

    it('post /agent/agentId/converse - Check the remember slot functionality using the context API and a life of 4', async ({ context }) => {
        const { importedAgentId } = context;
        const server = await Server.deployment();
        var payload = {
            sessionId,
            text: "Remember NormalKeyword2",
            timezone: "UTC"
        };
        var response = await server.inject({
            url: `/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_CONVERSE}`,
            payload,
            method: 'POST'
        });

        expect(response.statusCode).to.equal(200);
        expect(response.result.textResponse).to.be.equal("Remember slot response");
        expect(response.result.responses).to.be.an.array();
        expect(response.result.responses.length).to.be.greaterThan(0);

        for (var i = 4; i >= 0; i--) {
            response = await server.inject({
                url: `/${ROUTE_CONTEXT}/${sessionId}`,
                method: 'GET'
            });
            expect(response.statusCode).to.equal(200);
            if (i > 0) {
                expect(response.result.savedSlots.slotToRemember.remainingLife).to.equal(i);
            } else {
                expect(response.result.savedSlots.slotToRemember).to.be.undefined();
            }

            payload = {
                sessionId,
                text: "1",
                timezone: "UTC"
            };
            response = await server.inject({
                url: `/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_CONVERSE}`,
                payload,
                method: 'POST'
            });
        }
    });

    it('post /agent/agentId/converse - Check for list slots and use a chained action, also, use handlebar helper', async ({ context }) => {

        const { importedAgentId } = context;
        const server = await Server.deployment();
        var payload = {
            sessionId,
            text: "This is listKeyword1, listKeyword2 and listKeyword3",
            timezone: "UTC"
        };
        var response = await server.inject({
            url: `/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_CONVERSE}`,
            payload,
            method: 'POST'
        });

        expect(response.statusCode).to.equal(200);
        expect(response.result.textResponse).to.be.equal("The list: listkeyword1, listkeyword2, and listkeyword3 Chained action response");
        expect(response.result.responses).to.be.an.array();
        expect(response.result.responses.length).to.be.greaterThan(0);
        expect(response.result.responses[0].fulfilled).to.be.equal(true);
    });

    it('post /agent/agentId/converse - Ask for regex required slot using modifier (9 digits regex)', async ({ context }) => {

        const { importedAgentId } = context;
        const server = await Server.deployment();
        var payload = {
            sessionId,
            text: "This is a regexSlot",
            timezone: "UTC"
        };
        var response = await server.inject({
            url: `/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_CONVERSE}`,
            payload,
            method: 'POST'
        });

        expect(response.statusCode).to.equal(200);
        expect(response.result.textResponse).to.be.equal("Enter regex match");
        expect(response.result.responses).to.be.an.array();
        expect(response.result.responses.length).to.be.greaterThan(0);
        expect(response.result.responses[0].fulfilled).to.be.equal(false);

        var payload = {
            sessionId,
            text: "987654321",
            timezone: "UTC"
        };
        var response = await server.inject({
            url: `/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_CONVERSE}`,
            payload,
            method: 'POST'
        });

        expect(response.statusCode).to.equal(200);
        expect(response.result.textResponse).to.be.equal("The answer 987654321");
        expect(response.result.responses).to.be.an.array();
        expect(response.result.responses.length).to.be.greaterThan(0);
        expect(response.result.responses[0].fulfilled).to.be.equal(true);
    });

    it('post /agent/agentId/converse - Ask for a webhook response from pokeapi', async ({ context }) => {

        const { importedAgentId } = context;
        const server = await Server.deployment();
        var payload = {
            sessionId,
            text: "Get a webhook response",
            timezone: "UTC"
        };
        var response = await server.inject({
            url: `/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_CONVERSE}`,
            payload,
            method: 'POST'
        });

        expect(response.statusCode).to.equal(200);
        expect(response.result.textResponse).to.be.equal("This is the answer pikachu");
        expect(response.result.responses).to.be.an.array();
        expect(response.result.responses.length).to.be.greaterThan(0);
        expect(response.result.responses[0].fulfilled).to.be.equal(true);

    });

    it('post /agent/agentId/converse - Ask for a free text slot with a modifier', async ({ context }) => {

        const { importedAgentId } = context;
        const server = await Server.deployment();
        var payload = {
            sessionId,
            text: "This is a freeTextSlot",
            timezone: "UTC"
        };
        var response = await server.inject({
            url: `/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_CONVERSE}`,
            payload,
            method: 'POST'
        });

        expect(response.statusCode).to.equal(200);
        expect(response.result.textResponse).to.be.equal("Enter free text slot");
        expect(response.result.responses).to.be.an.array();
        expect(response.result.responses.length).to.be.greaterThan(0);
        expect(response.result.responses[0].fulfilled).to.be.equal(false);

        var payload = {
            sessionId,
            text: "random free text slot",
            timezone: "UTC"
        };
        var response = await server.inject({
            url: `/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_CONVERSE}`,
            payload,
            method: 'POST'
        });

        expect(response.statusCode).to.equal(200);
        expect(response.result.textResponse).to.be.equal("The answer random free text slot");
        expect(response.result.responses).to.be.an.array();
        expect(response.result.responses.length).to.be.greaterThan(0);
        expect(response.result.responses[0].fulfilled).to.be.equal(true);

    });

    it('post /agent/agentId/converse - Ask for keyword to fulfill pending action and expect only one response', async ({ context }) => {

        const { importedAgentId } = context;
        const server = await Server.deployment();
        var payload = {
            sessionId,
            text: "I want a keywordVsActions action",
            timezone: "UTC"
        };
        var response = await server.inject({
            url: `/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_CONVERSE}`,
            payload,
            method: 'POST'
        });

        expect(response.statusCode).to.equal(200);
        expect(response.result.textResponse).to.be.equal("Enter keywordVsActionSlot");
        expect(response.result.responses).to.be.an.array();
        expect(response.result.responses.length).to.be.greaterThan(0);
        expect(response.result.responses[0].fulfilled).to.be.equal(false);

        var payload = {
            sessionId,
            text: "value1",
            timezone: "UTC"
        };
        var response = await server.inject({
            url: `/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_CONVERSE}`,
            payload,
            method: 'POST'
        });

        expect(response.statusCode).to.equal(200);
        expect(response.result.textResponse).to.be.equal("This keywordVsAction response should only appear once");
        expect(response.result.responses).to.be.an.array();
        expect(response.result.responses.length).to.be.equal(1);
        expect(response.result.responses[0].fulfilled).to.be.equal(true);

    });

    it('post /agent/agentId/converse - Ask for required slot and actions with automatic suggestions', async ({ context }) => {

        const { importedAgentId } = context;
        const server = await Server.deployment();
        var payload = {
            sessionId,
            text: "Is there a automatic quick reply?",
            timezone: "UTC"
        };
        var response = await server.inject({
            url: `/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_CONVERSE}`,
            payload,
            method: 'POST'
        });

        expect(response.statusCode).to.equal(200);
        expect(response.result.textResponse).to.be.equal("Enter slot for automatic quick replies");
        expect(response.result.responses).to.be.an.array();
        expect(response.result.responses.length).to.be.greaterThan(0);
        expect(response.result.responses[0].fulfilled).to.be.equal(false);
        expect(response.result.responses[0].quickResponses[0]).to.be.equal("valueForAutomaticQuickReplies");

        var payload = {
            sessionId,
            text: "valueForAutomaticQuickReplies",
            timezone: "UTC"
        };
        var response = await server.inject({
            url: `/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_CONVERSE}`,
            payload,
            method: 'POST'
        });

        expect(response.statusCode).to.equal(200);
        expect(response.result.textResponse).to.be.equal("Enter slot for automatic quick replies 2");
        expect(response.result.responses).to.be.an.array();
        expect(response.result.responses.length).to.be.greaterThan(0);
        expect(response.result.responses[0].fulfilled).to.be.equal(false);
        expect(response.result.responses[0].quickResponses[0]).to.be.equal("valueForAutomaticQuickReplies2");

        var payload = {
            sessionId,
            text: "is there a valueforautomaticquickreplies and valueforautomaticquickreplies2",
            timezone: "UTC"
        };
        var response = await server.inject({
            url: `/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_CONVERSE}`,
            payload,
            method: 'POST'
        });

        expect(response.statusCode).to.equal(200);
        expect(response.result.textResponse).to.be.equal("This is the response with automatic quick replies");
        expect(response.result.responses).to.be.an.array();
        expect(response.result.responses.length).to.be.greaterThan(0);
        expect(response.result.responses[0].fulfilled).to.be.equal(true);
        expect(response.result.responses[0].quickResponses[0].length).to.be.greaterThan(0);
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