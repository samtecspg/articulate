'use strict';
const _ = require('lodash');

const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const PrecreatedAgentName = require('../../api/preCreatedAgent').agentName;

const expect = Code.expect;
const suite = lab.suite;
const test = lab.test;
const before = lab.before;
const after = lab.after;

let server;

let preCreatedAgent = null;
let agentName = null;
let agentId = null;
let domainName = null;
let intentName = null;
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
                        intentName = 'Simple Test Intent';
                        intentId = _.filter(preCreatedAgent.domains[0].intents, (tempIntent) => {

                            return tempIntent.intentName === intentName;
                        })[0].id;
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

suite('webhook', () => {

    suite('/intent/{id}/webhook', () => {

        suite('/post', () => {

            test('should respond with 200 successful operation and return an webhook object', (done) => {

                const data = {
                    agent: agentName,
                    domain: domainName,
                    intent: intentName,
                    webhookUrl: 'http://localhost:3000/agent',
                    webhookVerb: 'GET',
                    webhookPayloadType: 'None',
                    webhookPayload: ''
                };

                const options = {
                    method: 'POST',
                    url: `/intent/${intentId}/webhook`,
                    payload: data
                };

                server.inject(options, (res) => {

                    expect(res.statusCode).to.equal(200);
                    expect(res.result.webhookUrl).to.include(data.webhookUrl);
                    done();
                });

            });

            test('should respond with 400 Bad Request', (done) => {

                const data = {
                    invalid: true
                };
                const options = {
                    method: 'POST',
                    url: `/intent/${intentId}/webhook`,
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
                    webhookUrl: 'http://localhost:3000/agent',
                    webhookVerb: 'GET',
                    webhookPayloadType: 'None',
                    webhookPayload: ''
                };

                const options = {
                    method: 'POST',
                    url: `/intent/${intentId}/webhook`,
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
                    webhookUrl: 'http://localhost:3000/agent',
                    webhookVerb: 'GET',
                    webhookPayloadType: 'None',
                    webhookPayload: ''
                };

                const options = {
                    method: 'POST',
                    url: `/intent/${intentId}/webhook`,
                    payload: data
                };

                server.inject(options, (res) => {

                    expect(res.statusCode).to.equal(400);
                    expect(res.result.message).to.be.equal(`The domain -1 doesn't exist in the agent ${agentName}`);
                    done();
                });
            });
        });

    });

    suite('intent/{id}/webhook', () => {

        suite('/get', () => {

            test('should respond with 200 successful operation and return a single object', (done) => {

                const data = {
                    agent: agentName,
                    domain: domainName,
                    intent: intentName,
                    webhookUrl: 'http://localhost:3000/agent',
                    webhookVerb: 'GET',
                    webhookPayloadType: 'None',
                    webhookPayload: ''
                };

                server.inject(`/intent/${intentId}/webhook`, (res) => {

                    expect(res.statusCode).to.equal(200);
                    expect(res.result.webhookUrl).to.be.equal(data.webhookUrl);
                    done();
                });
            });

            test('should respond with 404 Not Found', (done) => {

                const data = {
                    id: '-1'
                };

                server.inject(`/intent/${data.id}/webhook`, (res) => {

                    expect(res.statusCode).to.equal(404);
                    expect(res.result.message).to.contain('The specified webhook doesn\'t exists');
                    done();
                });
            });
        });

        suite('/put', () => {

            test('should respond with 200 successful operation', (done) => {

                const updatedData = {
                    webhookUrl: 'http://localhost:3000/domain'
                };

                const options = {
                    method: 'PUT',
                    url: `/intent/${intentId}/webhook`,
                    payload: updatedData
                };

                server.inject(options, (res) => {

                    expect(res.statusCode).to.equal(200);
                    expect(res.result.webhookUrl).to.be.equal(updatedData.webhookUrl);
                    done();
                });
            });

            test('should respond with 404 Not Found', (done) => {

                const updatedData = {
                    webhookUrl: 'http://localhost:3000/agent'
                };

                const options = {
                    method: 'PUT',
                    url: '/intent/-1/webhook',
                    payload: updatedData
                };

                server.inject(options, (res) => {

                    expect(res.statusCode).to.equal(404);
                    expect(res.result.message).to.contain('The specified webhook doesn\'t exists');
                    done();
                });
            });

            test('should respond with 400 Bad Request', (done) => {

                const data = {
                    invalid: true
                };
                const options = {
                    method: 'PUT',
                    url: `/intent/${intentId}/webhook`,
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
                    url: `/intent/${data.id}/webhook`
                };

                server.inject(options, (res) => {

                    expect(res.statusCode).to.equal(404);
                    expect(res.result.message).to.contain('The specified webhook doesn\'t exists');
                    done();
                });
            });

            test('should respond with 200 successful operation', (done) => {

                const data = {
                    id: intentId
                };
                const options = {
                    method: 'DELETE',
                    url: `/intent/${data.id}/webhook`
                };

                server.inject(options, (res) => {

                    expect(res.statusCode).to.equal(200);
                    done();
                });
            });
        });

    });

});
