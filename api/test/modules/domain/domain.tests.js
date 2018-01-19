'use strict';

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
let domainId = null;

const createAgent = (callback) => {

    const data = {
        agentName: 'Test Agent',
        description: 'This is test agent',
        language: 'en',
        timezone: 'America/Kentucky/Louisville',
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

before({ timeout: 15000 }, (done) => {

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

suite('/domain', () => {

    suite('/post', () => {

        test('should respond with 200 successful operation and return an domain object', (done) => {

            const data = {
                agent: agentName,
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

                expect(res.statusCode).to.equal(200);
                expect(res.result.domainName).to.include(data.domainName);
                domainId = res.result.id;
                done();
            });
        });

        test('should respond with 400 Bad Request', (done) => {

            const data = { invalid: true };
            const options = {
                method: 'POST',
                url: '/domain',
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

                expect(res.statusCode).to.equal(400);
                expect(res.result.message).to.equal('The agent -1 doesn\'t exist');
                done();
            });
        });

    });

});

suite('/domain/{id}', () => {

    suite('/get', () => {

        test('should respond with 200 successful operation and return a single object', (done) => {

            const data = {
                id: domainId,
                agent: agentName,
                domainName: 'Test Domain',
                enabled: true,
                intentThreshold: 0.7
            };

            server.inject('/domain/' + data.id, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result.domainName).to.be.equal(data.domainName);
                done();
            });
        });

        test('should respond with 404 Not Found', (done) => {

            const data = {
                id: '-1'
            };

            server.inject('/domain/' + data.id, (res) => {

                expect(res.statusCode).to.equal(404);
                expect(res.result.message).to.contain('The specified domain doesn\'t exists');
                done();
            });
        });
    });

    suite('/put', () => {

        test('should respond with 200 successful operation', (done) => {

            const data = {
                id: domainId,
                agent: agentName,
                domainName: 'Test Domain Updated',
                enabled: false,
                intentThreshold: 0.55
            };

            const updatedData = {
                domainName: 'Test Domain Updated',
                enabled: false,
                intentThreshold: 0.55
            };

            const options = {
                method: 'PUT',
                url: '/domain/' + data.id,
                payload: updatedData
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result.domainName).to.be.equal(data.domainName);
                done();
            });
        });

        test('should respond with 404 Not Found', (done) => {

            const data = {
                domainName: 'Test Domain With Error'
            };

            const options = {
                method: 'PUT',
                url: '/domain/-1',
                payload: data
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(404);
                expect(res.result.message).to.contain('The specified domain doesn\'t exists');
                done();
            });
        });

        test('should respond with 400 Bad Request', (done) => {

            const data = {
                id: domainId,
                invalid: true
            };
            const options = {
                method: 'PUT',
                url: '/domain/' + data.id,
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
                url: '/domain/' + data.id
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(404);
                expect(res.result.message).to.contain('The specified domain doesn\'t exists');
                done();
            });
        });

        test('should respond with 200 successful operation', (done) => {

            const data = {
                id: domainId
            };
            const options = {
                method: 'DELETE',
                url: '/domain/' + data.id
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(200);
                done();
            });
        });
    });

});
