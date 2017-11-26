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
let entityName = null;
let intentName = null;
let intentId = null;

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
        entityName = res.result.entityName;
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
        intentName = res.result.intentName;
        intentId = res.result.id;
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

suite('scenario', () => {

    suite('/scenario', () => {

        suite('/post', () => {

            test('should respond with 200 successful operation and return an scenario object', (done) => {

                const data = {
                    agent: agentName,
                    domain: domainName,
                    intent: intentName,
                    scenarioName: 'Test Scenario',
                    slots: [{
                        slotName: 'searchedObject',
                        entity: entityName,
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

                    expect(res.statusCode).to.equal(200);
                    expect(res.result.scenarioName).to.include(data.scenarioName);
                    done();
                });

            });

            test('should respond with 400 Bad Request', (done) => {

                const data = {
                    invalid: true
                };
                const options = {
                    method: 'POST',
                    url: '/scenario',
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
                    intent: intentName,
                    scenarioName: 'Test Scenario',
                    slots: [{
                        slotName: 'searchedObject',
                        entity: entityName,
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
    
                    expect(res.statusCode).to.equal(400);
                    expect(res.result.message).to.be.equal('The agent -1 doesn\'t exist');
                    done();
                });
            });
    
            test('should respond with 400 because domain doesn\'t exists', (done) => {
    
                const data = {
                    agent: agentName,
                    domain: '-1',
                    intent: intentName,
                    scenarioName: 'Test Scenario',
                    slots: [{
                        slotName: 'searchedObject',
                        entity: entityName,
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
    
                    expect(res.statusCode).to.equal(400);
                    expect(res.result.message).to.be.equal(`The domain -1 doesn't exist in the agent ${agentName}`);
                    done();
                });
            });
    
            test('should respond with 400 because entity doesn\'t exists', (done) => {
    
                const data = {
                    agent: agentName,
                    domain: domainName,
                    intent: intentName,
                    scenarioName: 'Test Scenario',
                    slots: [{
                        slotName: 'searchedObject',
                        entity: '-1',
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
    
                    expect(res.statusCode).to.equal(400);
                    expect(res.result.message).to.be.equal(`The entity with the name -1 doesn't exist in the agent ${agentId}`);
                    done();
                });
            });
        });

    });

    suite('/scenario/{id}', () => {

        suite('/get', () => {

            test('should respond with 200 successful operation and return a single object', (done) => {

                const data = {
                    agent: agentName,
                    domain: domainName,
                    intent: intentName,
                    scenarioName: 'Test Scenario',
                    slots: [{
                        slotName: 'searchedObject',
                        entity: entityName,
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

                server.inject('/scenario/' + intentId, (res) => {

                    expect(res.statusCode).to.equal(200);
                    expect(res.result.scenarioName).to.be.equal(data.scenarioName);
                    done();
                });
            });

            test('should respond with 404 Not Found', (done) => {

                const data = {
                    id: '-1'
                };

                server.inject('/scenario/' + data.id, (res) => {

                    expect(res.statusCode).to.equal(404);
                    expect(res.result.message).to.contain('The specified scenario doesn\'t exists');
                    done();
                });
            });
        });

        suite('/put', () => {

            test('should respond with 200 successful operation', (done) => {

                const updatedData = {
                    scenarioName: 'Test Scenario Updated',
                    intentResponses: [
                        'Your {searchedObject} is located at...',
                    ],
                };

                const options = {
                    method: 'PUT',
                    url: '/scenario/' + intentId,
                    payload: updatedData
                };

                server.inject(options, (res) => {

                    expect(res.statusCode).to.equal(200);
                    expect(res.result.scenarioName).to.be.equal(updatedData.scenarioName);
                    expect(res.result.intentResponses.length).to.be.equal(updatedData.intentResponses.length);
                    done();
                });
            });

            test('should respond with 404 Not Found', (done) => {

                const updatedData = {
                    scenarioName: 'Test Scenario Updated',
                    intentResponses: [
                        'Your {searchedObject} is located at...',
                    ],
                };

                const options = {
                    method: 'PUT',
                    url: '/scenario/-1',
                    payload: updatedData
                };

                server.inject(options, (res) => {

                    expect(res.statusCode).to.equal(404);
                    expect(res.result.message).to.contain('The specified scenario doesn\'t exists');
                    done();
                });
            });

            test('should respond with 400 Bad Request', (done) => {

                const data = {
                    invalid: true
                };
                const options = {
                    method: 'PUT',
                    url: '/scenario/' + intentId,
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
                    url: '/scenario/' + data.id
                };

                server.inject(options, (res) => {

                    expect(res.statusCode).to.equal(404);
                    expect(res.result.message).to.contain('The specified scenario doesn\'t exists');
                    done();
                });
            });

            test('should respond with 200 successful operation', (done) => {

                const data = {
                    id: intentId
                };
                const options = {
                    method: 'DELETE',
                    url: '/scenario/' + data.id
                };

                server.inject(options, (res) => {

                    expect(res.statusCode).to.equal(200);
                    done();
                });
            });
        });

    });

});
