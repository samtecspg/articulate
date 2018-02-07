'use strict';
const Async = require('async');

const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();

const expect = Code.expect;
const suite = lab.suite;
const test = lab.test;
const before = lab.before;
const after = lab.after;

let server;

let agentName = null;
let agentId = null;
let domainName = null;
let intentId = null;

const createAgent = (callback) => {

    const data = {
        agentName: 'Test Agent',
        description: 'This is test agent',
        language: 'en',
        timezone: 'America/Kentucky/Louisville',
        webhookUrl: 'string',
        domainClassifierThreshold: 0.6,
        fallbackResponses: [
            'Sorry, can you rephrase that?',
            'I\'m still learning to speak with humans, can you rephrase that?'
        ],
        useWebhookFallback: false
    };
    const options = {
        method: 'POST',
        url: '/agent',
        payload: data
    };

    server.inject(options, (res) => {

        if (res.statusCode !== 200) {
            return callback({
                message: 'Error creating agent',
                error: res.result
            }, null);
        }
        agentName = res.result.agentName;
        agentId = res.result.id;
        return callback(null);
    });
};

const createDomain = (callback) => {

    const data = {
        agent: 'Test Agent',
        domainName: 'Test Domain',
        enabled: true,
        intentThreshold: 0.7
    };

    const options = {
        method: 'POST',
        url: '/domain',
        payload: data
    };

    server.inject(options, (res) => {

        if (res.statusCode !== 200) {
            return callback({
                message: 'Error creating domain',
                error: res.result
            }, null);
        }
        domainName = res.result.domainName;
        return callback(null);
    });
};

const createEntity = (callback) => {

    const data = {
        entityName: 'Test Entity',
        agent: 'Test Agent',
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

        if (res.statusCode !== 200) {
            return callback({
                message: 'Error creating entity',
                error: res.result
            }, null);
        }
        return callback(null);
    });
};

before({ timeout: 60000 }, (done) => {

    require('../../../index')((err, srv) => {

        if (err) {
            done(err);
        }
        server = srv;

        Async.series([
            (callback) => {

                createAgent(callback);
            },
            (callback) => {

                createDomain(callback);
            },
            (callback) => {

                createEntity(callback);
            }
        ], (err) => {

            if (err) {
                console.log(err);
                done(err);
            }
            else {
                done();
            }
        });
    });
});

after((done) => {

    server.inject({
        method: 'DELETE',
        url: '/agent/' + agentId
    }, (res) => {

        if (res.statusCode !== 200){
            done({
                message: 'Error deleting agent'
            });
        }
        done();
    });
});

suite('/intent', () => {

    suite('/post', () => {

        test('should respond with 200 successful operation and return an intent object', { timeout: 60000 }, (done) => {

            const data = {
                agent: agentName,
                domain: domainName,
                intentName: 'Test Intent',
                examples: [
                    {
                        userSays: 'Locate my car',
                        entities: [
                            {
                                start: 10,
                                end: 12,
                                value: 'car',
                                entity: 'Test Entity'
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
                                entity: 'Test Entity'
                            }
                        ]
                    }
                ]
            };

            const options = {
                method: 'POST',
                url: '/intent',
                payload: data
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result).to.include(data);
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
                intentName: 'Test Intent',
                examples: [
                    {
                        userSays: 'Locate my car',
                        entities: [
                            {
                                start: 10,
                                end: 12,
                                value: 'car',
                                entity: 'Test Entity'
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
                                entity: 'Test Entity'
                            }
                        ]
                    }
                ]
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
                intentName: 'Test Intent',
                examples: [
                    {
                        userSays: 'Locate my car',
                        entities: [
                            {
                                start: 10,
                                end: 12,
                                value: 'car',
                                entity: 'Test Entity'
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
                                entity: 'Test Entity'
                            }
                        ]
                    }
                ]
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
                intentName: 'Test Intent',
                examples: [
                    {
                        userSays: 'Locate my car',
                        entities: [
                            {
                                start: 10,
                                end: 12,
                                value: 'car',
                                entity: '-1'
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
                                entity: '-1'
                            }
                        ]
                    }
                ]
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
                agent: agentName,
                domain: domainName,
                intentName: 'Test Intent',
                examples: [
                    {
                        userSays: 'Locate my car',
                        entities: [
                            {
                                start: 10,
                                end: 12,
                                value: 'car',
                                entity: 'Test Entity'
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
                                entity: 'Test Entity'
                            }
                        ]
                    }
                ]
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
                intentName: 'Test Intent Updated',
                examples: [
                    {
                        userSays: 'Locate my car',
                        entities: [
                            {
                                start: 10,
                                end: 12,
                                value: 'car',
                                entity: 'Test Entity'
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
                                entity: 'Test Entity'
                            }
                        ]
                    }
                ]
            };

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
                                entity: 'Test Entity'
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
                                entity: 'Test Entity'
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
                intentName: 'Test Intent',
                examples: [
                    {
                        userSays: 'Locate my car',
                        entities: [
                            {
                                start: 10,
                                end: 12,
                                value: 'car',
                                entity: 'Test Entity'
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
                                entity: 'Test Entity'
                            }
                        ]
                    }
                ]
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
                                entity: '-1'
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
                                entity: '-1'
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
