import Code from 'code';
import Lab from 'lab';
import _ from 'lodash';
import * as Server from '../server';
import {
    ROUTE_AGENT,
    STATUS_READY,
    ROUTE_TRAIN,
} from '../util/constants';
import importAgent from './data/importAgent.json';

// Test shortcuts
const { describe, it, before, after } = exports.lab = Lab.script();
const { expect } = Code;

describe('Agent', () => {

    before(async ({ context }) => {

        const server = await Server.deployment();
        await server.inject({ 
            url: `/${ROUTE_AGENT}/import`,
            payload: importAgent,
            method: 'POST'
        });
        const response = await server.inject(`/${ROUTE_AGENT}/search/agentName/${importAgent.agentName}`);
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

    after(async ({ context }) => {

        const { importedAgentId } = context;
        const server = await Server.deployment();
        await server.inject({ 
            url: `/${ROUTE_AGENT}/${importedAgentId}`,
            method: 'DELETE'
        });
    });

});
