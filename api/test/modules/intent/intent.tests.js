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
let keywordId = null;
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
                        keywordId = preCreatedAgent.keywords[0].id;
                        done();
                    }
                });
            }
        });
    });
});

suite('/saying', () => {

    suite('/post', () => {

        test('should respond with 200 successful operation and return an saying object', { timeout: 60000 }, (done) => {

            const data = {
                agent: agentName,
                domain: domainName,
                sayingName: 'Test Saying 2',
                examples: [
                    {
                        userSays: 'Locate my car',
                        keywords: [
                            {
                                start: 10,
                                end: 13,
                                value: 'car',
                                keyword: 'Test Keyword',
                                keywordId
                            }
                        ]
                    },
                    {
                        userSays: 'Where is my car',
                        keywords: [
                            {
                                start: 12,
                                end: 15,
                                value: 'car',
                                keyword: 'Test Keyword',
                                keywordId
                            }
                        ]
                    }
                ],
                useWebhook: true,
                usePostFormat: false
            };

            const options = {
                method: 'POST',
                url: '/saying',
                payload: data
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result.sayingName).to.equal(data.sayingName);
                sayingId = res.result.id;

                done();
            });
        });

        test('should respond with 400 Bad Request', (done) => {

            const data = { invalid: true };
            const options = {
                method: 'POST',
                url: '/saying',
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
                sayingName: 'Test Saying 2',
                examples: [
                    {
                        userSays: 'Locate my car',
                        keywords: [
                            {
                                start: 10,
                                end: 12,
                                value: 'car',
                                keyword: 'Test Keyword',
                                keywordId
                            }
                        ]
                    },
                    {
                        userSays: 'Where is my car',
                        keywords: [
                            {
                                start: 12,
                                end: 14,
                                value: 'car',
                                keyword: 'Test Keyword',
                                keywordId
                            }
                        ]
                    }
                ],
                useWebhook: true,
                usePostFormat: false
            };

            const options = {
                method: 'POST',
                url: '/saying',
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
                sayingName: 'Test Saying 2',
                examples: [
                    {
                        userSays: 'Locate my car',
                        keywords: [
                            {
                                start: 10,
                                end: 12,
                                value: 'car',
                                keyword: 'Test Keyword',
                                keywordId
                            }
                        ]
                    },
                    {
                        userSays: 'Where is my car',
                        keywords: [
                            {
                                start: 12,
                                end: 14,
                                value: 'car',
                                keyword: 'Test Keyword',
                                keywordId
                            }
                        ]
                    }
                ],
                useWebhook: true,
                usePostFormat: false
            };

            const options = {
                method: 'POST',
                url: '/saying',
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
                sayingName: 'Test Saying 2',
                examples: [
                    {
                        userSays: 'Locate my car',
                        keywords: [
                            {
                                start: 10,
                                end: 12,
                                value: 'car',
                                keyword: '-1',
                                keywordId
                            }
                        ]
                    },
                    {
                        userSays: 'Where is my car',
                        keywords: [
                            {
                                start: 12,
                                end: 14,
                                value: 'car',
                                keyword: '-1',
                                keywordId
                            }
                        ]
                    }
                ],
                useWebhook: true,
                usePostFormat: false
            };

            const options = {
                method: 'POST',
                url: '/saying',
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

suite('/saying/{id}', () => {

    suite('/get', () => {

        test('should respond with 200 successful operation and return a single object', (done) => {

            const data = {
                sayingName: 'Test Saying 2'
            };

            server.inject('/saying/' + sayingId, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result.sayingName).to.be.equal(data.sayingName);
                done();
            });
        });

        test('should respond with 404 Not Found', (done) => {

            const data = {
                id: '-1'
            };

            server.inject('/saying/' + data.id, (res) => {

                expect(res.statusCode).to.equal(404);
                expect(res.result.message).to.contain('The specified saying doesn\'t exists');
                done();
            });
        });
    });

    suite('/put', () => {

        test('should respond with 200 successful operation', { timeout: 60000 }, (done) => {

            const data = {
                agent: agentName,
                domain: domainName,
                sayingName: 'Test Saying 2 Updated',
                examples: [
                    {
                        userSays: 'Locate my car',
                        keywords: [
                            {
                                start: 10,
                                end: 12,
                                value: 'car',
                                keyword: 'Test Keyword',
                                keywordId
                            }
                        ]
                    },
                    {
                        userSays: 'Where is my car',
                        keywords: [
                            {
                                start: 12,
                                end: 14,
                                value: 'car',
                                keyword: 'Test Keyword',
                                keywordId
                            }
                        ]
                    }
                ],
                useWebhook: true
            };

            const updatedData = {
                sayingName: 'Test Saying 2 Updated',
                examples: [
                    {
                        userSays: 'Locate my car',
                        keywords: [
                            {
                                start: 10,
                                end: 12,
                                value: 'car',
                                keyword: 'Test Keyword',
                                keywordId
                            }
                        ]
                    },
                    {
                        userSays: 'Where is my car',
                        keywords: [
                            {
                                start: 12,
                                end: 14,
                                value: 'car',
                                keyword: 'Test Keyword',
                                keywordId
                            }
                        ]
                    }
                ]
            };

            const options = {
                method: 'PUT',
                url: '/saying/' + sayingId,
                payload: updatedData
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result.sayingName).to.be.equal(data.sayingName);
                expect(res.result.examples.length).to.be.equal(updatedData.examples.length);
                done();
            });
        });

        test('should respond with 404 Not Found', (done) => {

            const data = {
                sayingName: 'Test Saying 2',
                examples: [
                    {
                        userSays: 'Locate my car',
                        keywords: [
                            {
                                start: 10,
                                end: 12,
                                value: 'car',
                                keyword: 'Test Keyword',
                                keywordId
                            }
                        ]
                    },
                    {
                        userSays: 'Where is my car',
                        keywords: [
                            {
                                start: 12,
                                end: 14,
                                value: 'car',
                                keyword: 'Test Keyword',
                                keywordId
                            }
                        ]
                    }
                ],
                useWebhook: true
            };

            const options = {
                method: 'PUT',
                url: '/saying/-1',
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
                id: sayingId,
                invalid: true
            };
            const options = {
                method: 'PUT',
                url: '/saying/' + data.id,
                payload: data
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(400);
                expect(res.result.error).to.contain('Bad Request');
                done();
            });
        });

        test('should respond with 400 because keyword doesn\'t exists', (done) => {

            const updatedData = {
                sayingName: 'Test Saying Updated',
                examples: [
                    {
                        userSays: 'Locate my car',
                        keywords: [
                            {
                                start: 10,
                                end: 12,
                                value: 'car',
                                keyword: '-1',
                                keywordId
                            }
                        ]
                    },
                    {
                        userSays: 'Where is my car',
                        keywords: [
                            {
                                start: 12,
                                end: 14,
                                value: 'car',
                                keyword: '-1',
                                keywordId
                            }
                        ]
                    }
                ],
                useWebhook: true
            };

            const options = {
                method: 'PUT',
                url: '/saying/' + sayingId,
                payload: updatedData
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(400);
                expect(res.result.message).to.be.equal(`The keyword with the name -1 doesn't exist in the agent ${agentId}`);
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
                url: '/saying/' + data.id
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(404);
                expect(res.result.message).to.contain('The specified saying doesn\'t exists');
                done();
            });
        });

        test('should respond with 200 successful operation', { timeout: 60000 }, (done) => {

            const data = {
                id: sayingId
            };
            const options = {
                method: 'DELETE',
                url: '/saying/' + data.id
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(200);
                done();
            });
        });
    });

});
