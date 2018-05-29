'use strict';
const _ = require('lodash');

const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const PrecreatedAgentName = require('../../api/preCreatedAgent').agentName;
const AgentToImport = require('./agentToImport');

const expect = Code.expect;
const suite = lab.suite;
const test = lab.test;
const before = lab.before;
const after = lab.after;

let server;

let preCreatedAgent = null;
let agentId = null;
let preCreatedAgentId = null;
let importedAgentId = null;
let domain = null;
let entity = null;
let intent = null;
let scenario = null;
let agentWebhook = null;
let intentWebhook = null;
let exportedTestAgent = null;


before({ timeout: 120000 }, (done) => {

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

                        preCreatedAgentId = preCreatedAgent.id;
                        agentWebhook = preCreatedAgent.webhook;
                        domain = preCreatedAgent.domains[0];
                        entity = preCreatedAgent.entities[0];
                        intent = _.filter(preCreatedAgent.domains[0].intents, (tempIntent) => {

                            return tempIntent.intentName === 'Test Intent';
                        })[0];
                        scenario = intent.scenario;
                        intentWebhook = intent.webhook;
                        done();
                    }
                });
            }
        });
    });
});

after((done) => {

    server.inject({
        method: 'DELETE',
        url: '/agent/' + importedAgentId
    }, (resImported) => {

        if (resImported.statusCode !== 200){
            done({
                message: 'Error deleting agent of the import endpoint test'
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

        test('should respond with 200 successful operation and return an agent object', { timeout: 60000 }, (done) => {

            const data = {
                agentName: '71999911-cb70-442c-8864-bc1d4e6a306e 2',
                description: 'This is test agent',
                language: 'en',
                timezone: 'UTC',
                domainClassifierThreshold: 0.9,
                fallbackResponses: [
                    'Can you repeat that?'
                ],
                useWebhook: false
            };
            const options = {
                method: 'POST',
                url: '/agent',
                payload: data
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result.agentName).to.equal(data.agentName);
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

    suite('/put', () => {

        test('should respond with 200 successful operation', (done) => {

            const data = {
                id: agentId,
                agentName: '71999911-cb70-442c-8864-bc1d4e6a306e Updated',
                description: 'This is test agent',
                language: 'en',
                extraTrainingData: false,
                timezone: 'UTC',
                domainClassifierThreshold: 0.5,
                fallbackResponses: [
                    'updated'
                ],
                useWebhook: true
            };

            const updatedData = {
                agentName: '71999911-cb70-442c-8864-bc1d4e6a306e Updated',
                description: 'This is test agent',
                language: 'en',
                timezone: 'UTC',
                domainClassifierThreshold: 0.5,
                fallbackResponses: [
                    'updated'
                ],
                useWebhook: true
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

    suite('/get', () => {

        test('should respond with 200 successful operation and return a single object', (done) => {

            server.inject(`/agent/${preCreatedAgentId}`, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result.id).to.be.equal(preCreatedAgentId);
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

});

suite('/agent/{id}/converse', () => {

    suite('/get', () => {

        test('should respond with 200 successful operation and return a text response', { timeout: 60000 }, (done) => {

            server.inject('/agent/' + preCreatedAgentId + '/converse?sessionId=articulateAPI&text=Locate%20my%20car', (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result.textResponse).to.equal('Your car is located at...');
                done();
            });
        });
    });

    suite('/post', () => {

        test('should respond with 200 successful operation and return a text response', { timeout: 60000 }, (done) => {

            const data = {
                sessionId: 'POST',
                text: 'Locate my car',
                timezone: 'UTC'
            };
            const options = {
                method: 'POST',
                url: `/agent/${preCreatedAgentId}/converse`,
                payload: data
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result.textResponse).to.equal('Your car is located at...');
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
                expect(res.result.length).to.equal(2);
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

suite('/agent/{id}/domain/{domainId}/intent/{intentId}/webhook', () => {

    suite('/get', () => {

        test('should respond with 200 successful operation and return a single object', (done) => {

            server.inject('/agent/' + preCreatedAgentId + '/domain/' + domain.id + '/intent/' + intent.id + '/webhook', (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result.webhookUrl).to.equal(intentWebhook.webhookUrl);
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

suite('/agent/{id}/export', () => {

    suite('/get', () => {

        test('should respond with 200 successful operation and return the agent will all its data', (done) => {

            server.inject('/agent/' + preCreatedAgentId + '/export?withReferences=true', (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result.id).to.equal(preCreatedAgentId);
                expect(res.result.webhook.webhookUrl).to.equal(agentWebhook.webhookUrl);
                expect(res.result.domains[0].id).to.equal(domain.id);
                expect(res.result.entities[0].id).to.equal(entity.id);
                expect(res.result.domains[0].intents.length).to.equal(2);
                done();
            });
        });
    });

    suite('/get', () => {

        test('should respond with 200 successful operation and return the agent will all its data', (done) => {

            server.inject(`/agent/${preCreatedAgentId}/export?withReferences=false`, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result.webhook.webhookUrl).to.equal(agentWebhook.webhookUrl);
                expect(res.result.domains[0].domainName).to.equal(domain.domainName);
                expect(res.result.entities[0].entityName).to.equal(entity.entityName);
                expect(res.result.domains[0].intents.length).to.equal(2);
                exportedTestAgent = res.result;
                done();
            });
        });
    });

});

suite('/agent/{id}/intent', () => {

    suite('/get', () => {

        test('should respond with 200 successful operation and return an array of intents', (done) => {

            server.inject(`/agent/${preCreatedAgentId}/intent`, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result[0].intentName).to.contain(intent.intentName);
                done();
            });
        });
    });

});

suite('/agent/{id}/parse', () => {

    suite('/get', () => {

        test('should respond with 200 successful operation and return a text response', { timeout: 60000 }, (done) => {

            server.inject(`/agent/${preCreatedAgentId}/parse?text=Locate%20my%20car&timezone=UTC`, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result.result.document).to.equal('Locate my car');
                expect(res.result.result.results.length).to.be.greaterThan(0);
                expect(res.result.result.results[0].domain).to.equal(domain.domainName);
                expect(res.result.result.results[0].entities.length).to.be.greaterThan(0);
                expect(res.result.result.results[0].entities[0].entity).to.equal(entity.entityName);
                expect(res.result.result.results[0].intent.confidence).to.be.a.number();
                expect(res.result.result.results[0].intent.name).to.equal(intent.intentName);
                done();
            });
        });
    });

    suite('/post', () => {

        test('should respond with 200 successful operation and return a text response', { timeout: 60000 }, (done) => {

            const data = {
                text: 'Locate my car',
                timezone: 'UTC'
            };
            const options = {
                method: 'POST',
                url: `/agent/${preCreatedAgentId}/parse`,
                payload: data
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result.result.document).to.equal('Locate my car');
                expect(res.result.result.results.length).to.be.greaterThan(0);
                expect(res.result.result.results[0].domain).to.equal(domain.domainName);
                expect(res.result.result.results[0].entities.length).to.be.greaterThan(0);
                expect(res.result.result.results[0].entities[0].entity).to.equal(entity.entityName);
                expect(res.result.result.results[0].intent.confidence).to.be.a.number();
                expect(res.result.result.results[0].intent.name).to.equal(intent.intentName);
                done();
            });
        });
    });

});

suite('/agent/{id}/webhook', () => {

    suite('/get', () => {

        test('should respond with 200 successful operation and return a webhook element', (done) => {

            server.inject(`/agent/${preCreatedAgentId}/webhook`, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result.webhookUrl).to.equal(agentWebhook.webhookUrl);
                done();
            });
        });
    });

    suite('/put', () => {

        test('should respond with 200 successful operation and return a webhook element', (done) => {

            const data = {
                webhookUrl: 'http://localhost:7500'
            };
            const options = {
                method: 'PUT',
                url: `/agent/${preCreatedAgentId}/webhook`,
                payload: data
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result.webhookUrl).to.equal(data.webhookUrl);
                done();
            });
        });
    });

    suite('/delete', () => {

        test('should respond with 200 successful operation', (done) => {

            const options = {
                method: 'DELETE',
                url: `/agent/${preCreatedAgentId}/webhook`
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(200);
                done();
            });
        });
    });

    suite('/post', () => {

        test('should respond with 200 successful operation and return an agent object', { timeout: 60000 }, (done) => {

            const data = {
                agent: '71999911-cb70-442c-8864-bc1d4e6a306e',
                webhookUrl: 'http://localhost:7500/agent/{{agent.id}}',
                webhookVerb: 'GET',
                webhookPayload: '',
                webhookPayloadType: 'None'
            };
            const options = {
                method: 'POST',
                url: `/agent/${preCreatedAgentId}/webhook`,
                payload: data
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result.webhookUrl).to.equal(data.webhookUrl);
                agentId = res.result.id;
                done();
            });
        });

    });
});

suite('/agent/import', () => {

    suite('/post', () => {

        test('should import the agent successfuly and return the imported agent', { timeout: 120000 }, (done) => {

            const options = {
                method: 'POST',
                url: '/agent/import',
                payload: AgentToImport
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result.agentName).to.equal(AgentToImport.agentName);
                importedAgentId = res.result.id;
                done();
            });
        });

        test('should be able to import the exported agent in the export test and return the imported agent', (done) => {

            exportedTestAgent.agentName = 'Exported-71999911-cb70-442c-8864-bc1d4e6a306e';

            const options = {
                method: 'POST',
                url: '/agent/import',
                payload: exportedTestAgent
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result.agentName).to.equal(exportedTestAgent.agentName);
                importedAgentId = res.result.id;
                done();
            });
        });
    });

});

suite('/agent/name/{agentName}', () => {

    suite('/get', () => {

        test('should respond with 200 successful operation and return a single object', (done) => {

            server.inject(`/agent/name/${preCreatedAgent.agentName}`, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result.id).to.be.equal(preCreatedAgentId);
                done();
            });
        });

        test('should respond with 404 Not Found', (done) => {

            server.inject('/agent/name/-1', (res) => {

                expect(res.statusCode).to.equal(404);
                expect(res.result.message).to.contain('The agent "-1" doesn\'t exist');
                done();
            });
        });
    });

});
