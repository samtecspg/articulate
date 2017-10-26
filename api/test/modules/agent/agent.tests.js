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
let preCreatedAgentId = null;
let domain = null;
let entity = null;
let intent = null;
let scenario = null;

const createAgent = (callback) => {

    const data = {
        agentName: 'string',
        webhookUrl: 'string',
        domainClassifierThreshold: 0,
        fallbackResponses: [
            'string'
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
                message: 'Error creating agent'
            }, null);
        }

        preCreatedAgentId = res.result._id;
        return callback(null);

    });
};

const createDomain = (callback) => {

    const data = {
        agent: preCreatedAgentId,
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

        if (res.statusCode !== 200) {
            return callback({
                message: 'Error creating domain'
            }, null);
        }

        domain = res.result;
        return callback(null);
    });
};

const createEntity = (callback) => {

    const data = {
        entityName: 'string',
        agent: preCreatedAgentId,
        examples: [{
            value: 'string',
            synonyms: [
                'string'
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
                message: 'Error creating entity'
            }, null);
        }

        entity = res.result;
        return callback(null);
    });
};

const createIntent = (callback) => {

    const data = {
        agent: preCreatedAgentId,
        domain: domain._id,
        intentName: 'string',
        examples: [{
            userSays: 'string',
            entities: [{
                value: 'string',
                entity: entity._id,
                start: 0,
                end: 0
            }]
        }]
    };
    const options = {
        method: 'POST',
        url: '/intent',
        payload: data
    };

    server.inject(options, (res) => {

        if (res.statusCode !== 200) {
            return callback({
                message: 'Error creating intent'
            }, null);
        }

        intent = res.result;
        return callback(null);
    });
};

const createScenario = (callback) => {

    const data = {
        agent: preCreatedAgentId,
        domain: domain._id,
        intent: intent._id,
        scenarioName: 'string',
        slots: [{
            slotName: 'string',
            entity: entity._id,
            isList: true,
            isRequired: true,
            textPrompts: [
                'string'
            ],
            useWebhook: true
        }],
        intentResponses: [
            'string'
        ],
        useWebhook: true
    };
    const options = {
        method: 'POST',
        url: '/scenario',
        payload: data
    };

    server.inject(options, (res) => {

        if (res.statusCode !== 200) {
            return callback({
                message: 'Error creating scenario'
            }, null);
        }
        scenario = res.result;
        return callback(null);
    });
};

before( { timeout: 15000 } ,(done) => {

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
            },
            (callback) => {

                setTimeout(() => {

                    createIntent(callback);
                }, 4000);
            },
            (callback) => {

                setTimeout(() => {

                    createScenario(callback);
                }, 4000);
            }
        ], (err) => {

            if (err) {
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
        url: '/agent/' + preCreatedAgentId
    }, (res) => {

        if (res.statusCode !== 200){
            done({
                message: 'Error deleting agent'
            });
        }
        done();
    });
});

suite('/agent', () => {

    suite('/get', () => {

        test('should respond with 200 successful operation and return and array of objects', (done) => {

            server.inject('/agent', (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result).to.be.an.array();
                done();
            });
        });
    });

    suite('/post', () => {

        test('should respond with 200 successful operation and return an agent object', (done) => {

            const data = {
                agentName: 'string',
                webhookUrl: 'string',
                domainClassifierThreshold: 0,
                fallbackResponses: [
                    'string'
                ],
                useWebhookFallback: false
            };
            const options = {
                method: 'POST',
                url: '/agent',
                payload: data
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result).to.include(data);
                agentId = res.result._id;

                done();
            });
        });

        test('should respond with 400 Bad Request', (done) => {

            const data = {
                invalid: true
            };
            const options = {
                method: 'POST',
                url: '/agent',
                payload: data
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(400);
                expect(res.result.error).to.equal('Bad Request');
                done();
            });
        });

    });

});

suite('/agent/{id}', () => {

    suite('/get', () => {

        test('should respond with 200 successful operation and return a single object', (done) => {

            const data = {
                _id: agentId,
                agentName: 'string',
                webhookUrl: 'string',
                domainClassifierThreshold: 0,
                fallbackResponses: [
                    'string'
                ]
            };

            server.inject('/agent/' + data._id, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result._id).to.be.equal(data._id);
                done();
            });
        });

        test('should respond with 404 Not Found', (done) => {

            const data = {
                _id: '-1'
            };

            server.inject('/agent/' + data._id, (res) => {

                expect(res.statusCode).to.equal(404);
                expect(res.result.message).to.contain('Not Found');
                done();
            });
        });
    });

    suite('/put', () => {

        test('should respond with 200 successful operation', (done) => {

            const data = {
                _id: agentId,
                agentName: 'string',
                webhookUrl: 'string',
                domainClassifierThreshold: 0.5,
                fallbackResponses: [
                    'updated'
                ],
                useWebhookFallback: false
            };

            const updatedData = {
                domainClassifierThreshold: 0.5,
                fallbackResponses: [
                    'updated'
                ]
            };

            const options = {
                method: 'PUT',
                url: '/agent/' + data._id,
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
                agentName: 'string',
                webhookUrl: 'string',
                domainClassifierThreshold: 0.5,
                fallbackResponses: [
                    'updated'
                ]
            };

            const options = {
                method: 'PUT',
                url: '/agent/-1',
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
                _id: agentId,
                invalid: true
            };
            const options = {
                method: 'PUT',
                url: '/agent/' + data._id,
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
                _id: '-1'
            };

            const options = {
                method: 'DELETE',
                url: '/agent/' + data._id
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(404);
                expect(res.result.message).to.contain('Not Found');
                done();
            });
        });

        test('should respond with 200 successful operation', (done) => {

            const data = {
                _id: agentId
            };
            const options = {
                method: 'DELETE',
                url: '/agent/' + data._id
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(200);
                done();
            });
        });
    });

});

suite('/agent/{id}/domain', () => {

    suite('/get', () => {

        test('should respond with 200 successful operation and return and array of domains', (done) => {

            server.inject('/agent/' + preCreatedAgentId + '/domain', (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result).to.equal([domain]);
                done();
            });
        });
    });

});

suite('/agent/{id}/domain/{domainId}', () => {

    suite('/get', () => {

        test('should respond with 200 successful operation and return a single domain item', (done) => {

            server.inject('/agent/' + preCreatedAgentId + '/domain/' + domain._id, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result).to.equal(domain);
                done();
            });
        });
    });

});

suite('/agent/{id}/domain/{domainId}/intent', () => {

    suite('/get', () => {

        test('should respond with 200 successful operation and return and array of intents', (done) => {

            server.inject('/agent/' + preCreatedAgentId + '/domain/' + domain._id + '/intent', (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result).to.equal([intent]);
                done();
            });
        });
    });

});

suite('/agent/{id}/domain/{domainId}/intent/{intentId}', () => {

    suite('/get', () => {

        test('should respond with 200 successful operation and return and array of objects', (done) => {

            server.inject('/agent/' + preCreatedAgentId + '/domain/' + domain._id + '/intent/' + intent._id, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result).to.equal(intent);
                done();
            });
        });
    });

});

suite('/agent/{id}/domain/{domainId}/intent/{intentId}/scenario', () => {

    suite('/get', () => {

        test('should respond with 200 successful operation and return and array of objects', { timeout: 10000 }, (done) => {

            setTimeout( () => {

                server.inject('/agent/' + preCreatedAgentId + '/domain/' + domain._id + '/intent/' + intent._id + '/scenario', (res) => {

                    expect(res.statusCode).to.equal(200);
                    expect(res.result).to.equal([scenario]);
                    done();
                });
            }, 4000);
        });
    });

});

suite('/agent/{id}/entity', () => {

    suite('/get', () => {

        test('should respond with 200 successful operation and return and array of entities', (done) => {

            server.inject('/agent/' + preCreatedAgentId + '/entity', (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result[0]).to.contain(entity);
                done();
            });
        });
    });

});

suite('/agent/{id}/entity/{entityId}', () => {

    suite('/get', () => {

        test('should respond with 200 successful operation and return a single entity item', (done) => {

            server.inject('/agent/' + preCreatedAgentId + '/entity/' + entity._id, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result).to.contain(entity);
                done();
            });
        });
    });

});
