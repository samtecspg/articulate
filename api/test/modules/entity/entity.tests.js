'use strict';

const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const PrecreatedAgentName = require('../../api/preCreatedAgent').agentName;

const expect = Code.expect;
const suite = lab.suite;
const test = lab.test;
const before = lab.before;

let server;

let preCreatedAgent = null;
let agentName = null;
let entityId = null;
let preCreatedEntity = null;

before((done) => {

    require('../../../index')((err, srv) => {

        if (err){
            done(err);
        }
        server = srv;

        server.inject(`/agent/name/${PrecreatedAgentName}`, (resName) => {

            if (resName.result && resName.result.statusCode && resName.result.statusCode !== 200){
                done(new Error(`An error ocurred getting the name of the test agent. Error message: ${resName.result.message}`));
            }
            else {
                server.inject(`/agent/${resName.result.id}/export?withReferences=True`, (resAgent) => {

                    if (resAgent.result && resAgent.result.statusCode && resAgent.result.statusCode !== 200){
                        done(new Error(`An error ocurred getting the data of the test agent. Error message: ${resAgent.result.message}`));
                    }
                    else {
                        preCreatedAgent = resAgent.result;
                        agentName = preCreatedAgent.agentName;
                        preCreatedEntity = preCreatedAgent.entities[0];
                        done();
                    }
                });
            }
        });
    });
});

suite('/entity', () => {

    suite('/post', () => {

        test('should respond with 200 successful operation and return an entity object', (done) => {

            const data = {
                entityName: 'Test Entity 2',
                agent: agentName,
                uiColor: '#009688',
                examples: [{
                    value: 'car',
                    synonyms: [
                        'car',
                        'vehicle',
                        'automobile'
                    ]
                }]
            };

            const options = {
                method: 'POST',
                url: '/entity',
                payload: data
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result.entityName).to.include(data.entityName);
                entityId = res.result.id;

                done();
            });

        });

        test('should respond with 400 Bad Request', (done) => {

            const data = { invalid: true };
            const options = {
                method: 'POST',
                url: '/entity',
                payload: data
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(400);
                expect(res.result.error).to.equal('Bad Request');
                done();
            });
        });

        test('should respond with 400 because agent doesn\'t exists', (done) => {

            const data = {
                entityName: 'string',
                agent: '-1',
                examples: [
                    {
                        value: 'string',
                        synonyms: [
                            'string'
                        ]
                    }
                ]
            };

            const options = {
                method: 'POST',
                url: '/entity',
                payload: data
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(400);
                expect(res.result.message).to.equal('The agent -1 doesn\'t exist');
                done();
            });
        });
    });

});

suite('/entity/{id}', () => {

    suite('/get', () => {

        test('should respond with 200 successful operation and return a single object', (done) => {

            const data = {
                entityName: 'Test Entity 2'
            };

            server.inject(`/entity/${entityId}`, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result.entityName).to.be.contain(data.entityName);
                done();
            });
        });

        test('should respond with 404 Not Found', (done) => {

            const data = {
                id: '-1'
            };

            server.inject('/entity/' + data.id, (res) => {

                expect(res.statusCode).to.equal(404);
                expect(res.result.message).to.contain('The specified entity doesn\'t exists');
                done();
            });
        });
    });

    suite('/put', () => {

        test('should respond with 200 successful operation', (done) => {

            const data = {
                entityName: 'Test Entity Updated',
                agent: agentName,
                uiColor: '#00BCD4',
                examples: [{
                    value: 'car',
                    synonyms: [
                        'car',
                        'vehicle',
                        'automobile'
                    ]
                }]
            };

            const updatedData = {
                entityName: 'Test Entity Updated',
                uiColor: '#00BCD4',
                examples: [{
                    value: 'car',
                    synonyms: [
                        'car',
                        'vehicle'
                    ]
                }]
            };

            const options = {
                method: 'PUT',
                url: `/entity/${entityId}`,
                payload: updatedData
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result.entityName).to.be.equal(data.entityName);
                done();
            });
        });

        test('should respond with 404 Not Found', (done) => {

            const data = {
                examples: []
            };

            const options = {
                method: 'PUT',
                url: '/entity/-1',
                payload: data
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(404);
                expect(res.result.message).to.contain('The specified entity doesn\'t exists');
                done();
            });
        });

        test('should respond with 400 Bad Request', (done) => {

            const data = {
                id: entityId,
                invalid: true
            };
            const options = {
                method: 'PUT',
                url: '/entity/' + data.id,
                payload: data
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(400);
                expect(res.result.error).to.contain('Bad Request');
                done();
            });
        });
    });

    suite('/delete', () => {

        test('should respond with 404 Not Found', (done) => {

            const data = {
                id: '-1'
            };

            const options = {
                method: 'DELETE',
                url: '/entity/' + data.id
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(404);
                expect(res.result.message).to.contain('The specified entity doesn\'t exists');
                done();
            });
        });

        test('should respond with 200 successful operation', (done) => {

            const data = {
                id: entityId
            };
            const options = {
                method: 'DELETE',
                url: `/entity/${data.id}`
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(200);
                done();
            });
        });
    });

});

suite('/entity/{id}/intent', () => {

    suite('/get', () => {

        test('should respond with 200 successful operation and return an array of intents', (done) => {

            server.inject(`/entity/${preCreatedEntity.id}/intent`, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result).to.be.an.array();
                expect(res.result.length).to.be.greaterThan(0);
                done();
            });
        });

        test('should respond with 404 Not Found', (done) => {

            server.inject('/entity/-1/intent', (res) => {

                expect(res.statusCode).to.equal(404);
                expect(res.result.message).to.contain('The specified entity doesn\'t exists');
                done();
            });
        });
    });

});
