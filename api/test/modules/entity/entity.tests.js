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
let entityId = null;

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

before((done) => {

    require('../../../index')((err, srv) => {

        if (err){
            done(err);
        }
        server = srv;

        createAgent( (err) => {

            if (err) {
                console.log(err);
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
            console.log(res.result);
            return done(res.result);
        }
        return done();
    });
});

suite('/entity', () => {

    suite('/post', () => {

        test('should respond with 200 successful operation and return an entity object', (done) => {

            const data = {
                entityName: 'Test Entity',
                agent: agentName,
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

                expect(res.statusCode).to.equal(200);
                expect(res.result.entityName).to.include(data.entityName);
                entityId = res.result.id;

                done();
            });

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

            const data = {
                entityName: 'string',
                agent: '-1',
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
                expect(res.result.message).to.equal('The agent -1 doesn\'t exist');
                done();
            });
        });
    });

});

suite('/entity/{id}', () => {

    suite('/get', () => {

        test('should respond with 200 successful operation and return a single object', (done) => {

            const data = {
                entityName: 'Test Entity',
                agent: agentName,
                examples: [{
                    value: 'car',
                    synonyms: [
                        'car',
                        'vehicle',
                        'automobile'
                    ]
                }]
            };

            server.inject('/entity/' + entityId, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result.entityName).to.be.contain(data.entityName);
                done();
            });
        });

        test('should respond with 404 Not Found', (done) => {

            const data = {
                id: '-1'
            };

            server.inject('/entity/' + data.id, (res) => {

                expect(res.statusCode).to.equal(404);
                expect(res.result.message).to.contain('The specified entity doesn\'t exists');
                done();
            });
        });
    });

    suite('/put', () => {

        test('should respond with 200 successful operation', (done) => {

            const data = {
                entityName: 'Test Entity Updated',
                agent: agentName,
                examples: [{
                    value: 'car',
                    synonyms: [
                        'car',
                        'vehicle',
                        'automobile'
                    ]
                }]
            };

            const updatedData = {
                entityName: 'Test Entity Updated',
                examples: [{
                    value: 'car',
                    synonyms: [
                        'car',
                        'vehicle'
                    ]
                }]
            };

            const options = {
                method: 'PUT',
                url: '/entity/' + entityId,
                payload: updatedData
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result.entityName).to.be.equal(data.entityName);
                done();
            });
        });

        test('should respond with 404 Not Found', (done) => {

            const data = {
                examples: []
            };

            const options = {
                method: 'PUT',
                url: '/entity/-1',
                payload: data
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(404);
                expect(res.result.message).to.contain('The specified entity doesn\'t exists');
                done();
            });
        });

        test('should respond with 400 Bad Request', (done) => {

            const data = {
                id: entityId,
                invalid: true
            };
            const options = {
                method: 'PUT',
                url: '/entity/' + data.id,
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
                url: '/entity/' + data.id
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(404);
                expect(res.result.message).to.contain('The specified entity doesn\'t exists');
                done();
            });
        });

        test('should respond with 200 successful operation', (done) => {

            const data = {
                id: entityId
            };
            const options = {
                method: 'DELETE',
                url: '/entity/' + data.id
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(200);
                done();
            });
        });
    });

});
