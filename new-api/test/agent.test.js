import Code from 'code';
import Lab from 'lab';
import * as Server from '../server';
import {
    MODEL_WEBHOOK,
    ROUTE_AGENT
} from '../util/constants';

// Test shortcuts
const { describe, it } = exports.lab = Lab.script();
const { expect } = Code;

describe('Agent', () => {

    it('FindAll Route', async () => {

        const server = await Server.deployment();
        const response = await server.inject(`/${ROUTE_AGENT}`);

        expect(response.statusCode).to.equal(200);
        expect(response.result).to.have.length(1);
    });

    it('FindAll Service', async () => {

        const server = await Server.deployment();
        const { globalService } = await server.services();

        const response = await globalService.findAll({ model: MODEL_WEBHOOK });
        expect(response).to.have.length(3);
    });
    it('FindAll Model', async () => {

        const server = await Server.deployment();
        const { redis } = server.app;
        const AgentModel = await redis.factory(MODEL_WEBHOOK);

        const response = await AgentModel.findAll({});
        expect(response).to.have.length(3);
    });

    it('FindAll Domain Route', async () => {

        const server = await Server.deployment();
        const response = await server.inject(`/${ROUTE_AGENT}/57f0a070-bcff-11e8-bd42-f7ad09e07ef5/domain`);

        expect(response.statusCode).to.equal(200);
        expect(response.result).to.have.length(2);
    });
});
