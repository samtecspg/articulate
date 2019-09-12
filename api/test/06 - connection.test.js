import Code from 'code';
import Lab from 'lab';
import _ from 'lodash';
import * as Server from '../server';
import {
    ROUTE_AGENT,
    ROUTE_CONNECTION
} from '../util/constants';
import importAgent from './data/importAgent.json';
import { create } from 'domain';

// Test shortcuts
const { describe, it, before, after } = exports.lab = Lab.script();
const { expect } = Code;

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
        payload: importAgent,
        method: 'POST'
    });
    return await server.inject(`/${ROUTE_AGENT}/search/agentName/${importAgent.agentName}`);
}

var server = null;
var createdConnectionId = "";

describe('Connection', () => {

    before(async ({ context }) => {
        server = await Server.deployment();
        await deleteRemainingAgent(server);
        var importAgentResponse = await loadImportAgent(server);
        context.importedAgentId = importAgentResponse.result.id;
    });

    it('post /connection', async ({ context }) => {

        var payload = {
            channel: "chat-widget",
            enabled: true,
            agent: context.importedAgentId,
            details: {
                title: "string",
                subtitle: "string",
                senderPlaceHolder: "string"
            }
        }
        const response = await server.inject({
            url: `/${ROUTE_CONNECTION}`,
            payload,
            method: 'POST'
        });

        expect(response.statusCode).to.equal(200);
        expect(response.result.channel).to.equal("chat-widget");
        expect(response.result.agent).to.equal(Number(context.importedAgentId));

        createdConnectionId = response.result.id;
    });

    it('get /connection', async ({ context }) => {

        const response = await server.inject({
            url: `/${ROUTE_CONNECTION}`,
            payload: {},
            method: 'GET'
        });

        expect(response.statusCode).to.equal(200);
        expect(response.result.data.length).to.be.greaterThan(0);

    });

    it('get /connection/connectionId', async ({ context }) => {

        const response = await server.inject({
            url: `/${ROUTE_CONNECTION}/${createdConnectionId}`,
            method: 'GET'
        });

        expect(response.statusCode).to.equal(200);
        expect(response.result.id).to.equal(createdConnectionId);
    });

    it('put /connection/connectionId', async ({ context }) => {

        var response = await server.inject({
            url: `/${ROUTE_CONNECTION}/${createdConnectionId}`,
            payload: { enabled: false },
            method: 'PUT'
        });

        expect(response.statusCode).to.equal(200);

        response = await server.inject({
            url: `/${ROUTE_CONNECTION}/${createdConnectionId}`,
            method: 'GET'
        });

        expect(response.statusCode).to.equal(200);
        expect(response.result.id).to.equal(createdConnectionId);
        expect(response.result.enabled).to.equal(false);
    });
    /* 
        it('post /connection/connectionId/external', async ({ context }) => {
    
            const response = await server.inject({
                url: `/${ROUTE_CONNECTION}/${createdConnectionId}/external`,
                payload: {},
                method: 'POST'
            });
    
            expect(response.statusCode).to.equal(200);
        });
        */

    it('get /connection/connectionId/external', async ({ context }) => {

        const response = await server.inject({
            url: `/${ROUTE_CONNECTION}/${createdConnectionId}/external`,
            method: 'GET'
        });

        expect(response.result).to.be.an.object();
        expect(response.statusCode).to.equal(200);
    });

    it('delete /connection', async ({ context }) => {

        const response = await server.inject({
            url: `/${ROUTE_CONNECTION}/${createdConnectionId}`,
            method: 'DELETE'
        });

        expect(response.statusCode).to.equal(200);
    });


    after(async ({ context }) => {
        await deleteRemainingAgent(server, importAgent.agentName);
    });

});

