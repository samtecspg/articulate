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

let agentId = null;
let domainId = null;
let entityId = null;
let intentId = null;

const createAgent = (callback) => {

    const data = {
        agentName: 'string',
        webhookUrl: 'string',
        domainClassifierThreshold: 0,
        fallbackResponses: [
            'string'
        ],
        useWebhookFallback: false,
        webhookFallbackUrl: 'http://localhost:3000'
    };
    const options = {
        method: 'POST',
        url: '/agent',
        payload: data
    };

    server.inject(options, (res) => {

        if (res.statusCode){
            agentId = res.result._id;
            return callback(null);
        }

        return callback({
            message: 'Error creating agent'
        });
    });
};

const createDomain = (callback) => {

    const data = {
        agent: agentId,
        domainName: 'string',
        enabled: true,
        intentThreshold: 0
    };
    const options = {
        method: 'POST',
        url: '/domain',
        payload: data
    };

    server.inject(options, (res) => {

        if (res.statusCode){
            domainId = res.result._id;
            return callback(null);
        }

        return callback({
            message: 'Error creating domain'
        });
    });
};

const createEntity = (callback) => {

    const data = {
        entityName: 'string',
        agent: agentId,
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

        if (res.statusCode){
            entityId = res.result._id;
            return callback(null);
        }

        return callback({
            message: 'Error creating entity'
        });
    });
};

before((done) => {

    require('../../../index')((err, srv) => {

        if (err){
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
                done(err);
            }
            done();
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

    suite('/get', () => {

        test('should respond with 200 successful operation and return and array of objects', (done) => {

            server.inject('/intent', (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result).to.be.an.array();
                done();
            });
        });
    });

    suite('/post', () => {

        test('should respond with 200 successful operation and return an intent object', { timeout: 10000 }, (done) => {

            setTimeout(() => {

                const data = {
                    agent: agentId,
                    domain: domainId,
                    intentName: 'string',
                    examples: [
                        {
                            userSays: 'string',
                            entities: [
                                {
                                    value: 'string',
                                    entity: entityId,
                                    start: 0,
                                    end: 0
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
                    intentId = res.result._id;

                    done();
                });
            }, 4000);

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

            const possibleMesages = ['The element with values: {\n  "agent": "-1",\n  "_id": "' + domainId + '"\n} does not exists in index domain',
                'The element with values: {\n  "agent": "-1",\n  "_id": "' + entityId + '"\n} does not exists in index entity',
                'The document with id -1 doesn\'t exists in index agent'];

            const data = {
                agent: '-1',
                domain: domainId,
                intentName: 'string',
                examples: [
                    {
                        userSays: 'string',
                        entities: [
                            {
                                value: 'string',
                                entity: entityId,
                                start: 0,
                                end: 0
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
                expect(res.result.message).to.part.include(possibleMesages);
                done();
            });
        });

        test('should respond with 400 because domain doesn\'t exists', (done) => {

            const possibleMesages = ['The element with values: {\n  "agent": "' + agentId + '",\n  "_id": "-1"\n} does not exists in index domain', 'The document with id -1 doesn\'t exists in index domain'];

            const data = {
                agent: agentId,
                domain: '-1',
                intentName: 'string',
                examples: [
                    {
                        userSays: 'string',
                        entities: [
                            {
                                value: 'string',
                                entity: entityId,
                                start: 0,
                                end: 0
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
                expect(res.result.message).to.part.include(possibleMesages);
                done();
            });
        });

        test('should respond with 400 because entity doesn\'t exists', (done) => {

            const possibleMesages = ['The element with values: {\n  "agent": "' + agentId + '",\n  "_id": "-1"\n} does not exists in index entity',
                'The document with id -1 doesn\'t exists in index entity'];

            const data = {
                agent: agentId,
                domain: domainId,
                intentName: 'string',
                examples: [
                    {
                        userSays: 'string',
                        entities: [
                            {
                                value: 'string',
                                entity: '-1',
                                start: 0,
                                end: 0
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
                expect(res.result.message).to.part.include(possibleMesages);
                done();
            });
        });

    });

});

suite('/intent/{id}', () => {

    suite('/get', () => {

        test('should respond with 200 successful operation and return a single object', (done) => {

            const data = {
                _id: intentId,
                agent: agentId,
                domain: domainId,
                intentName: 'string',
                examples: [
                    {
                        userSays: 'string',
                        entities: [
                            {
                                value: 'string',
                                entity: entityId,
                                start: 0,
                                end: 0
                            }
                        ]
                    }
                ]
            };

            server.inject('/intent/' + data._id, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result._id).to.be.equal(data._id);
                done();
            });
        });

        test('should respond with 404 Not Found', (done) => {

            const data = {
                _id: '-1'
            };

            server.inject('/intent/' + data._id, (res) => {

                expect(res.statusCode).to.equal(404);
                expect(res.result.message).to.contain('Not Found');
                done();
            });
        });
    });

    suite('/put', () => {

        test('should respond with 200 successful operation', (done) => {

            const data = {
                _id: intentId,
                agent: agentId,
                domain: domainId,
                intentName: 'name',
                examples: [
                    {
                        userSays: 'string',
                        entities: [
                            {
                                value: 'string',
                                entity: entityId,
                                start: 0,
                                end: 0
                            }
                        ]
                    }
                ]
            };

            const updatedData = {
                agent: agentId,
                domain: domainId,
                intentName: 'name'
            };

            const options = {
                method: 'PUT',
                url: '/intent/' + data._id,
                payload: updatedData
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result).to.be.equal(data);
                done();
            });
        });

        test('should respond with 404 Not Found', (done) => {

            const data = {
                agent: agentId,
                domain: domainId
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
                _id: intentId,
                invalid: true
            };
            const options = {
                method: 'PUT',
                url: '/intent/' + data._id,
                payload: data
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(400);
                expect(res.result.error).to.contain('Bad Request');
                done();
            });
        });

        test('should respond with 400 because agent doesn\'t exists', (done) => {

            const possibleMesages = ['The element with values: {\n  "agent": "-1",\n  "_id": "' + domainId + '"\n} does not exists in index domain', 'The document with id -1 doesn\'t exists in index agent'];

            const updatedData = {
                agent: '-1',
                domain: domainId
            };

            const options = {
                method: 'PUT',
                url: '/intent/' + intentId,
                payload: updatedData
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(400);
                expect(res.result.message).to.part.include(possibleMesages);
                done();
            });
        });

        test('should respond with 400 because domain doesn\'t exists', (done) => {

            const possibleMesages = ['The element with values: {\n  "agent": "' + agentId + '",\n  "_id": "-1"\n} does not exists in index domain', 'The document with id -1 doesn\'t exists in index domain'];

            const updatedData = {
                agent: agentId,
                domain: '-1'
            };

            const options = {
                method: 'PUT',
                url: '/intent/' + intentId,
                payload: updatedData
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(400);
                expect(res.result.message).to.part.include(possibleMesages);
                done();
            });
        });

        test('should respond with 400 because entity doesn\'t exists', (done) => {

            const possibleMesages = ['The element with values: {\n  "agent": "' + agentId + '",\n  "_id": "-1"\n} does not exists in index entity', 'The document with id -1 doesn\'t exists in index entity'];

            const updatedData = {
                agent: agentId,
                domain: domainId,
                examples: [
                    {
                        userSays: 'string',
                        entities: [
                            {
                                value: 'string',
                                entity: '-1',
                                start: 0,
                                end: 0
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
                expect(res.result.message).to.part.include(possibleMesages);
                done();
            });
        });
    });

    suite('/delete', () => {

        test('should respond with 404 Not Found', (done) => {

            const data = {
                _id: '-1'
            };

            const options = {
                method: 'DELETE',
                url: '/intent/' + data._id
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(404);
                expect(res.result.message).to.contain('Not Found');
                done();
            });
        });

        test('should respond with 200 successful operation', (done) => {

            const data = {
                _id: intentId
            };
            const options = {
                method: 'DELETE',
                url: '/intent/' + data._id
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(200);
                done();
            });
        });
    });

});
