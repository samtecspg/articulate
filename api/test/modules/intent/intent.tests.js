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
let agentId = null;
let domainName = null;
let entityId = null;
let intentId = null;

before((done) => {

    require('../../../index')((err, srv) => {

        if (err) {
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
                        agentId = preCreatedAgent.id;
                        domainName = preCreatedAgent.domains[0].domainName;
                        entityId = preCreatedAgent.entities[0].id;
                        done();
                    }
                });
            }
        });
    });
});

suite('/intent', () => {

    suite('/post', () => {

        test('should respond with 200 successful operation and return an intent object', { timeout: 60000 }, (done) => {

            const data = {
                agent: agentName,
                domain: domainName,
                intentName: 'Test Intent 2',
                examples: [
                    {
                        userSays: 'Locate my car',
                        entities: [
                            {
                                start: 10,
                                end: 13,
                                value: 'car',
                                entity: 'Test Entity',
                                entityId
                            }
                        ]
                    },
                    {
                        userSays: 'Where is my car',
                        entities: [
                            {
                                start: 12,
                                end: 15,
                                value: 'car',
                                entity: 'Test Entity',
                                entityId
                            }
                        ]
                    }
                ],
                useWebhook: true,
                usePostFormat: false
            };

            const options = {
                method: 'POST',
                url: '/intent',
                payload: data
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result.intentName).to.equal(data.intentName);
                intentId = res.result.id;

                done();
            });
        });

        test('should respond with 400 Bad Request', (done) => {

            const data = { invalid: true };
            const options = {
                method: 'POST',
                url: '/intent',
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
                agent: '-1',
                domain: domainName,
                intentName: 'Test Intent 2',
                examples: [
                    {
                        userSays: 'Locate my car',
                        entities: [
                            {
                                start: 10,
                                end: 12,
                                value: 'car',
                                entity: 'Test Entity',
                                entityId
                            }
                        ]
                    },
                    {
                        userSays: 'Where is my car',
                        entities: [
                            {
                                start: 12,
                                end: 14,
                                value: 'car',
                                entity: 'Test Entity',
                                entityId
                            }
                        ]
                    }
                ],
                useWebhook: true,
                usePostFormat: false
            };

            const options = {
                method: 'POST',
                url: '/intent',
                payload: data
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(400);
                expect(res.result.message).to.be.equal('The agent -1 doesn\'t exist');
                done();
            });
        });

        test('should respond with 400 because domain doesn\'t exists', (done) => {

            const data = {
                agent: agentName,
                domain: '-1',
                intentName: 'Test Intent 2',
                examples: [
                    {
                        userSays: 'Locate my car',
                        entities: [
                            {
                                start: 10,
                                end: 12,
                                value: 'car',
                                entity: 'Test Entity',
                                entityId
                            }
                        ]
                    },
                    {
                        userSays: 'Where is my car',
                        entities: [
                            {
                                start: 12,
                                end: 14,
                                value: 'car',
                                entity: 'Test Entity',
                                entityId
                            }
                        ]
                    }
                ],
                useWebhook: true,
                usePostFormat: false
            };

            const options = {
                method: 'POST',
                url: '/intent',
                payload: data
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(400);
                expect(res.result.message).to.be.equal(`The domain -1 doesn't exist in the agent ${agentName}`);
                done();
            });
        });

        test('should respond with 400 because entity doesn\'t exists', (done) => {

            const data = {
                agent: agentName,
                domain: domainName,
                intentName: 'Test Intent 2',
                examples: [
                    {
                        userSays: 'Locate my car',
                        entities: [
                            {
                                start: 10,
                                end: 12,
                                value: 'car',
                                entity: '-1',
                                entityId
                            }
                        ]
                    },
                    {
                        userSays: 'Where is my car',
                        entities: [
                            {
                                start: 12,
                                end: 14,
                                value: 'car',
                                entity: '-1',
                                entityId
                            }
                        ]
                    }
                ],
                useWebhook: true,
                usePostFormat: false
            };

            const options = {
                method: 'POST',
                url: '/intent',
                payload: data
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(400);
                expect(res.result.message).to.be.equal(`The entity with the name -1 doesn't exist in the agent ${agentId}`);
                done();
            });
        });

    });

});

suite('/intent/{id}', () => {

    suite('/get', () => {

        test('should respond with 200 successful operation and return a single object', (done) => {

            const data = {
                intentName: 'Test Intent 2'
            };

            server.inject('/intent/' + intentId, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result.intentName).to.be.equal(data.intentName);
                done();
            });
        });

        test('should respond with 404 Not Found', (done) => {

            const data = {
                id: '-1'
            };

            server.inject('/intent/' + data.id, (res) => {

                expect(res.statusCode).to.equal(404);
                expect(res.result.message).to.contain('The specified intent doesn\'t exists');
                done();
            });
        });
    });

    suite('/put', () => {

        test('should respond with 200 successful operation', { timeout: 60000 }, (done) => {

            const data = {
                agent: agentName,
                domain: domainName,
                intentName: 'Test Intent 2 Updated',
                examples: [
                    {
                        userSays: 'Locate my car',
                        entities: [
                            {
                                start: 10,
                                end: 12,
                                value: 'car',
                                entity: 'Test Entity',
                                entityId
                            }
                        ]
                    },
                    {
                        userSays: 'Where is my car',
                        entities: [
                            {
                                start: 12,
                                end: 14,
                                value: 'car',
                                entity: 'Test Entity',
                                entityId
                            }
                        ]
                    }
                ],
                useWebhook: true
            };

            const updatedData = {
                intentName: 'Test Intent 2 Updated',
                examples: [
                    {
                        userSays: 'Locate my car',
                        entities: [
                            {
                                start: 10,
                                end: 12,
                                value: 'car',
                                entity: 'Test Entity',
                                entityId
                            }
                        ]
                    },
                    {
                        userSays: 'Where is my car',
                        entities: [
                            {
                                start: 12,
                                end: 14,
                                value: 'car',
                                entity: 'Test Entity',
                                entityId
                            }
                        ]
                    }
                ]
            };

            const options = {
                method: 'PUT',
                url: '/intent/' + intentId,
                payload: updatedData
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result.intentName).to.be.equal(data.intentName);
                expect(res.result.examples.length).to.be.equal(updatedData.examples.length);
                done();
            });
        });

        test('should respond with 404 Not Found', (done) => {

            const data = {
                intentName: 'Test Intent 2',
                examples: [
                    {
                        userSays: 'Locate my car',
                        entities: [
                            {
                                start: 10,
                                end: 12,
                                value: 'car',
                                entity: 'Test Entity',
                                entityId
                            }
                        ]
                    },
                    {
                        userSays: 'Where is my car',
                        entities: [
                            {
                                start: 12,
                                end: 14,
                                value: 'car',
                                entity: 'Test Entity',
                                entityId
                            }
                        ]
                    }
                ],
                useWebhook: true
            };

            const options = {
                method: 'PUT',
                url: '/intent/-1',
                payload: data
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(404);
                expect(res.result.error).to.contain('Not Found');
                done();
            });
        });

        test('should respond with 400 Bad Request', (done) => {

            const data = {
                id: intentId,
                invalid: true
            };
            const options = {
                method: 'PUT',
                url: '/intent/' + data.id,
                payload: data
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(400);
                expect(res.result.error).to.contain('Bad Request');
                done();
            });
        });

        test('should respond with 400 because entity doesn\'t exists', (done) => {

            const updatedData = {
                intentName: 'Test Intent Updated',
                examples: [
                    {
                        userSays: 'Locate my car',
                        entities: [
                            {
                                start: 10,
                                end: 12,
                                value: 'car',
                                entity: '-1',
                                entityId
                            }
                        ]
                    },
                    {
                        userSays: 'Where is my car',
                        entities: [
                            {
                                start: 12,
                                end: 14,
                                value: 'car',
                                entity: '-1',
                                entityId
                            }
                        ]
                    }
                ],
                useWebhook: true
            };

            const options = {
                method: 'PUT',
                url: '/intent/' + intentId,
                payload: updatedData
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(400);
                expect(res.result.message).to.be.equal(`The entity with the name -1 doesn't exist in the agent ${agentId}`);
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
                url: '/intent/' + data.id
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(404);
                expect(res.result.message).to.contain('The specified intent doesn\'t exists');
                done();
            });
        });

        test('should respond with 200 successful operation', { timeout: 60000 }, (done) => {

            const data = {
                id: intentId
            };
            const options = {
                method: 'DELETE',
                url: '/intent/' + data.id
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(200);
                done();
            });
        });
    });

});
