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
        agentName: 'Test Agent',
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
        preCreatedAgentId = res.result.id;
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
        domain = res.result;
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
        entity = res.result;
        return callback(null);
    });
};

const createIntent = (callback) => {

    const data = {
        agent: 'Test Agent',
        domain: 'Test Domain',
        intentName: 'Test Intent',
        examples: [
            'Locate my {Test Entity}',
            'Where is my {Test Entity}',
            'I\'m loking for my {Test Entity}',
            'Search the {Test Entity}'
        ]
    };
    const options = {
        method: 'POST',
        url: '/intent',
        payload: data
    };

    server.inject(options, (res) => {

        if (res.statusCode !== 200) {
            return callback({
                message: 'Error creating intent',
                error: res.result
            }, null);
        }
        intent = res.result;
        return callback(null);
    });
};

const createScenario = (callback) => {

    const data = {
        agent: 'Test Agent',
        domain: 'Test Domain',
        intent: 'Test Intent',
        scenarioName: 'Test Scenario',
        slots: [{
            slotName: 'searchedObject',
            entity: 'Test Entity',
            isList: false,
            isRequired: true,
            textPrompts: [
                'What are you looking for?',
                'Are you trying to find something?',
            ],
            useWebhook: true,
            useOriginal: false
        }],
        intentResponses: [
            'Your {searchedObject} is located at...',
            'I was unable to find the {searchedObject}',
            'The {searchedObject} is near 7th street at the downtown.'
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
                message: 'Error creating scenario',
                error: res.result
            }, null);
        }
        scenario = res.result;
        return callback(null);
    });
};

before((done) => {

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

                createIntent(callback);
            },
            (callback) => {

                createScenario(callback);
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

        test('should respond with 200 successful operation and return an array of objects', (done) => {

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
                agentName: 'Test Agent 2',
                webhookUrl: 'http://localhost:8000',
                domainClassifierThreshold: 0.9,
                fallbackResponses: [
                    'Can you repeat that?'
                ],
                useWebhookFallback: true
            };
            const options = {
                method: 'POST',
                url: '/agent',
                payload: data
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result).to.include(data);
                agentId = res.result.id;
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
                id: agentId
            };

            server.inject('/agent/' + data.id, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result.id).to.be.equal(data.id.toString());
                done();
            });
        });

        test('should respond with 404 Not Found', (done) => {

            const data = {
                id: '-1'
            };

            server.inject('/agent/' + data.id, (res) => {

                expect(res.statusCode).to.equal(404);
                expect(res.result.message).to.contain('The specified agent doesn\'t exists');
                done();
            });
        });
    });

    suite('/put', () => {

        test('should respond with 200 successful operation', (done) => {

            const data = {
                id: agentId.toString(),
                agentName: 'Test Agent Updated',
                webhookUrl: 'http://localhost:8000',
                domainClassifierThreshold: 0.5,
                fallbackResponses: [
                    'updated'
                ],
                useWebhookFallback: 'true'
            };

            const updatedData = {
                agentName: 'Test Agent Updated',
                domainClassifierThreshold: 0.5,
                fallbackResponses: [
                    'updated'
                ]
            };

            const options = {
                method: 'PUT',
                url: '/agent/' + agentId,
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
                id: agentId,
                invalid: true
            };
            const options = {
                method: 'PUT',
                url: '/agent/' + data.id,
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
                url: '/agent/' + data.id
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(404);
                expect(res.result.message).to.contain('The specified agent doesn\'t exists');
                done();
            });
        });

        test('should respond with 200 successful operation', (done) => {

            const data = {
                id: agentId
            };
            const options = {
                method: 'DELETE',
                url: '/agent/' + data.id
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

        test('should respond with 200 successful operation and return an array of domains', (done) => {

            server.inject('/agent/' + preCreatedAgentId + '/domain', (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result[0].domainName).to.equal(domain.domainName);
                done();
            });
        });
    });

});

suite('/agent/{id}/domain/{domainId}', () => {

    suite('/get', () => {

        test('should respond with 200 successful operation and return a single domain item', (done) => {

            server.inject('/agent/' + preCreatedAgentId + '/domain/' + domain.id, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result.domainName).to.equal(domain.domainName);
                done();
            });
        });
    });

});

suite('/agent/{id}/domain/{domainId}/intent', () => {

    suite('/get', () => {

        test('should respond with 200 successful operation and return an array of intents', (done) => {

            server.inject('/agent/' + preCreatedAgentId + '/domain/' + domain.id + '/intent', (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result[0].intentName).to.equal(intent.intentName);
                done();
            });
        });
    });

});

suite('/agent/{id}/domain/{domainId}/intent/{intentId}', () => {

    suite('/get', () => {

        test('should respond with 200 successful operation and return an array of objects', (done) => {

            server.inject('/agent/' + preCreatedAgentId + '/domain/' + domain.id + '/intent/' + intent.id, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result.intentName).to.equal(intent.intentName);
                done();
            });
        });
    });

});

suite('/agent/{id}/domain/{domainId}/intent/{intentId}/scenario', () => {

    suite('/get', () => {

        test('should respond with 200 successful operation and return a single object', (done) => {

            server.inject('/agent/' + preCreatedAgentId + '/domain/' + domain.id + '/intent/' + intent.id + '/scenario', (res) => {

                    expect(res.statusCode).to.equal(200);
                    expect(res.result.scenarioName).to.equal(scenario.scenarioName);
                    done();
                });
        });
    });

});

suite('/agent/{id}/entity', () => {

    suite('/get', () => {

        test('should respond with 200 successful operation and return an array of entities', (done) => {

            server.inject('/agent/' + preCreatedAgentId + '/entity', (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result[0].entityName).to.contain(entity.entityName);
                done();
            });
        });
    });

});

suite('/agent/{id}/entity/{entityId}', () => {

    suite('/get', () => {

        test('should respond with 200 successful operation and return a single entity item', (done) => {

            server.inject('/agent/' + preCreatedAgentId + '/entity/' + entity.id, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result.entityName).to.contain(entity.entityName);
                done();
            });
        });
    });

});
