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

const agents = [];
const domains = [];
let entityId = null;

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
            agents.push(res.result._id);
            return callback(null);
        }

        return callback({
            message: 'Error creating agent'
        });
    });
};

const createDomain = (agent, callback) => {

    const data = {
        agent,
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
            domains.push(res.result._id);
            return callback(null);
        }

        return callback({
            message: 'Error creating domain'
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

                createAgent(callback);
            },
            (callback) => {

                createDomain(agents[0], callback);
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
        url: '/agent/' + agents[0]
    }, (res) => {

        if (res.statusCode !== 200){
            done({
                message: 'Error deleting agent'
            });
        }
        server.inject({
            method: 'DELETE',
            url: '/agent/' + agents[1]
        }, (res2) => {

            if (res2.statusCode !== 200){
                done({
                    message: 'Error deleting agent'
                });
            }
            done();
        });
    });
});

suite('/entity', () => {

    suite('/get', () => {

        test('should respond with 200 successful operation and return and array of objects', (done) => {

            server.inject('/entity', (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result).to.be.an.array();
                done();
            });
        });
    });

    suite('/post', () => {

        test('should respond with 200 successful operation and return an entity object', { timeout: 10000 }, (done) => {

            setTimeout(() => {

                const data = {
                    entityName: 'string',
                    agent: agents[0],
                    usedBy: domains,
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

                    expect(res.statusCode).to.equal(200);
                    expect(res.result).to.include(data);
                    entityId = res.result._id;

                    done();
                });
            }, 4000);

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

            const possibleMesages = ['The element with values: {\n  "agent": "-1",\n  "_id": "' + domains[0] + '"\n} does not exists in index domain', 'The document with id -1 doesn\'t exists in index agent'];

            const data = {
                entityName: 'string',
                agent: '-1',
                usedBy: domains,
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
                expect(res.result.message).to.part.include(possibleMesages);
                done();
            });
        });

        test('should respond with 400 because domain doesn\'t exists', (done) => {

            const possibleMesages = ['The element with values: {\n  "agent": "' + agents[0] + '",\n  "_id": "-1"\n} does not exists in index domain', 'The document with id -1 doesn\'t exists in index domain'];

            const data = {
                entityName: 'string',
                agent: agents[0],
                usedBy: [
                    '-1'
                ],
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
                expect(res.result.message).to.part.include(possibleMesages);
                done();
            });
        });

        test('should respond with 400 because domain is not in the specified agent', (done) => {

            const data = {
                entityName: 'string',
                agent: agents[1],
                usedBy: domains,
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
                expect(res.result.message).to.equal('The element with values: {\n  "agent": "' + agents[1] + '",\n  "_id": "' + domains[0] + '"\n} does not exists in index domain');
                done();
            });
        });

    });

});

suite('/entity/{id}', () => {

    suite('/get', () => {

        test('should respond with 200 successful operation and return a single object', (done) => {

            const data = {
                _id: entityId,
                entityName: 'string',
                agent: agents[0],
                usedBy: domains,
                examples: [
                    {
                        value: 'string',
                        synonyms: [
                            'string'
                        ]
                    }
                ]
            };

            server.inject('/entity/' + data._id, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result._id).to.be.contain(data._id);
                done();
            });
        });

        test('should respond with 404 Not Found', (done) => {

            const data = {
                _id: '-1'
            };

            server.inject('/entity/' + data._id, (res) => {

                expect(res.statusCode).to.equal(404);
                expect(res.result.message).to.contain('Not Found');
                done();
            });
        });
    });

    suite('/put', () => {

        test('should respond with 200 successful operation', (done) => {

            const data = {
                _id: entityId,
                entityName: 'name',
                agent: agents[0],
                usedBy: domains,
                examples: [
                    {
                        value: 'string',
                        synonyms: [
                            'string'
                        ]
                    }
                ]
            };

            const updatedData = {
                agent: agents[0],
                entityName: 'name'
            };

            const options = {
                method: 'PUT',
                url: '/entity/' + data._id,
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
                agent: agents[0]
            };

            const options = {
                method: 'PUT',
                url: '/entity/-1',
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
                _id: entityId,
                invalid: true
            };
            const options = {
                method: 'PUT',
                url: '/entity/' + data._id,
                payload: data
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(400);
                expect(res.result.error).to.contain('Bad Request');
                done();
            });
        });

        test('should respond with 400 because agent doesn\'t exists', (done) => {

            const updatedData = {
                agent: '-1'
            };

            const options = {
                method: 'PUT',
                url: '/entity/' + entityId,
                payload: updatedData
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(400);
                expect(res.result.message).to.equal('The document with id -1 doesn\'t exists in index agent');
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
                url: '/entity/' + data._id
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(404);
                expect(res.result.message).to.contain('Not Found');
                done();
            });
        });

        test('should respond with 200 successful operation', (done) => {

            const data = {
                _id: entityId
            };
            const options = {
                method: 'DELETE',
                url: '/entity/' + data._id
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(200);
                done();
            });
        });
    });

});
