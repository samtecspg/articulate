
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

    it('post /agent/agentId/converse - checks action response with keyword inside saying', async ({ context }) => {

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

    it('post /agent/agentId/converse - checks default fallback action response', async ({ context }) => {

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

    it('post /agent/agentId/converse - checks for required empty slot asking and modifier for filling it include the slot in the answer (Handlebars)', async ({ context }) => {

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
            text: "modifierKeyword1",
            timezone: "UTC"
        };
        var response = await server.inject({
            url: `/${ROUTE_AGENT}/${importedAgentId}/${ROUTE_CONVERSE}`,
            payload,
            method: 'POST'
        });

        console.log(response.result);

        expect(response.statusCode).to.equal(200);
        expect(response.result.textResponse).to.be.equal("The slots: modifierKeyword1");
        expect(response.result.responses).to.be.an.array();
        expect(response.result.responses.length).to.be.greaterThan(0);
        expect(response.result.responses[0].fulfilled).to.be.equal(true);
    });

    after(async ({ context }) => {

        const { importedAgentId } = context;
        const server = await Server.deployment();
        await server.inject({
            url: `/${ROUTE_AGENT}/${importedAgentId}`,
            method: 'DELETE'
        });
    });

    it('post /agent/agentId/converse - checks the remember slot functionality using the context API and a life of 4', async ({ context }) => {
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
});