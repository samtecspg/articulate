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

let server;

let preCreatedAgent = null;
let agentName = null;
let agentId = null;
let domainName = null;
let keywordName = null;
let sayingName = null;
let sayingId = null;

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
                        keywordName = preCreatedAgent.keywords[0].keywordName;
                        sayingName = 'Simple Test Saying';
                        sayingId = _.filter(preCreatedAgent.domains[0].sayings, (tempSaying) => {

                            return tempSaying.sayingName === sayingName;
                        })[0].id;
                        done();
                    }
                });
            }
        });
    });
});

suite('scenario', () => {

    suite('/saying/{id}/scenario', () => {

        suite('/post', () => {

            test('should respond with 200 successful operation and return an scenario object', (done) => {

                const data = {
                    agent: agentName,
                    domain: domainName,
                    saying: sayingName,
                    scenarioName: 'Test Scenario 2',
                    slots: [{
                        slotName: 'searchedObject',
                        keyword: keywordName,
                        isList: false,
                        isRequired: true,
                        textPrompts: [
                            'What are you looking for?',
                            'Are you trying to find something?'
                        ]
                    }],
                    sayingResponses: [
                        'Your {searchedObject} is located at...',
                        'I was unable to find the {searchedObject}',
                        'The {searchedObject} is near 7th street at the downtown.'
                    ]
                };

                const options = {
                    method: 'POST',
                    url: `/saying/${sayingId}/scenario`,
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
                    url: `/saying/${sayingId}/scenario`,
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
                    saying: sayingName,
                    scenarioName: 'Test Scenario 2',
                    slots: [{
                        slotName: 'searchedObject',
                        keyword: keywordName,
                        isList: false,
                        isRequired: true,
                        textPrompts: [
                            'What are you looking for?',
                            'Are you trying to find something?'
                        ]
                    }],
                    sayingResponses: [
                        'Your {searchedObject} is located at...',
                        'I was unable to find the {searchedObject}',
                        'The {searchedObject} is near 7th street at the downtown.'
                    ]
                };

                const options = {
                    method: 'POST',
                    url: `/saying/${sayingId}/scenario`,
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
                    saying: sayingName,
                    scenarioName: 'Test Scenario 2',
                    slots: [{
                        slotName: 'searchedObject',
                        keyword: keywordName,
                        isList: false,
                        isRequired: true,
                        textPrompts: [
                            'What are you looking for?',
                            'Are you trying to find something?'
                        ]
                    }],
                    sayingResponses: [
                        'Your {searchedObject} is located at...',
                        'I was unable to find the {searchedObject}',
                        'The {searchedObject} is near 7th street at the downtown.'
                    ]
                };

                const options = {
                    method: 'POST',
                    url: `/saying/${sayingId}/scenario`,
                    payload: data
                };

                server.inject(options, (res) => {

                    expect(res.statusCode).to.equal(400);
                    expect(res.result.message).to.be.equal(`The domain -1 doesn't exist in the agent ${agentName}`);
                    done();
                });
            });

            test('should respond with 400 because keyword doesn\'t exists', (done) => {

                const data = {
                    agent: agentName,
                    domain: domainName,
                    saying: sayingName,
                    scenarioName: 'Test Scenario 2',
                    slots: [{
                        slotName: 'searchedObject',
                        keyword: '-1',
                        isList: false,
                        isRequired: true,
                        textPrompts: [
                            'What are you looking for?',
                            'Are you trying to find something?'
                        ]
                    }],
                    sayingResponses: [
                        'Your {searchedObject} is located at...',
                        'I was unable to find the {searchedObject}',
                        'The {searchedObject} is near 7th street at the downtown.'
                    ]
                };

                const options = {
                    method: 'POST',
                    url: `/saying/${sayingId}/scenario`,
                    payload: data
                };

                server.inject(options, (res) => {

                    expect(res.statusCode).to.equal(400);
                    expect(res.result.message).to.be.equal(`The keyword with the name -1 doesn't exist in the agent ${agentId}`);
                    done();
                });
            });
        });

    });

    suite('saying/{id}/scenario', () => {

        suite('/get', () => {

            test('should respond with 200 successful operation and return a single object', (done) => {

                const data = {
                    agent: agentName,
                    domain: domainName,
                    saying: sayingName,
                    scenarioName: 'Test Scenario 2',
                    slots: [{
                        slotName: 'searchedObject',
                        keyword: keywordName,
                        isList: false,
                        isRequired: true,
                        textPrompts: [
                            'What are you looking for?',
                            'Are you trying to find something?'
                        ]
                    }],
                    sayingResponses: [
                        'Your {searchedObject} is located at...',
                        'I was unable to find the {searchedObject}',
                        'The {searchedObject} is near 7th street at the downtown.'
                    ]
                };

                server.inject(`/saying/${sayingId}/scenario`, (res) => {

                    expect(res.statusCode).to.equal(200);
                    expect(res.result.scenarioName).to.be.equal(data.scenarioName);
                    done();
                });
            });

            test('should respond with 404 Not Found', (done) => {

                const data = {
                    id: '-1'
                };

                server.inject(`/saying/${data.id}/scenario`, (res) => {

                    expect(res.statusCode).to.equal(404);
                    expect(res.result.message).to.contain('The specified scenario doesn\'t exists');
                    done();
                });
            });
        });

        suite('/put', () => {

            test('should respond with 200 successful operation', (done) => {

                const updatedData = {
                    scenarioName: 'Test Scenario 2 Updated',
                    sayingResponses: [
                        'Your {searchedObject} is located at...'
                    ]
                };

                const options = {
                    method: 'PUT',
                    url: `/saying/${sayingId}/scenario`,
                    payload: updatedData
                };

                server.inject(options, (res) => {

                    expect(res.statusCode).to.equal(200);
                    expect(res.result.scenarioName).to.be.equal(updatedData.scenarioName);
                    expect(res.result.sayingResponses.length).to.be.equal(updatedData.sayingResponses.length);
                    done();
                });
            });

            test('should respond with 404 Not Found', (done) => {

                const updatedData = {
                    scenarioName: 'Test Scenario 2 Updated',
                    sayingResponses: [
                        'Your {searchedObject} is located at...'
                    ]
                };

                const options = {
                    method: 'PUT',
                    url: '/saying/-1/scenario',
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
                    url: `/saying/${sayingId}/scenario`,
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
                    url: `/saying/${data.id}/scenario`
                };

                server.inject(options, (res) => {

                    expect(res.statusCode).to.equal(404);
                    expect(res.result.message).to.contain('The specified scenario doesn\'t exists');
                    done();
                });
            });

            test('should respond with 200 successful operation', (done) => {

                const data = {
                    id: sayingId
                };
                const options = {
                    method: 'DELETE',
                    url: `/saying/${data.id}/scenario`
                };

                server.inject(options, (res) => {

                    expect(res.statusCode).to.equal(200);
                    done();
                });
            });
        });

    });

});
