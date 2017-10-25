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

let agentId = null;
let domainId = null;

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
            agentId = res.result._id;
            return callback(null);
        }

        return callback({
            message: 'Error creating agent'
        });
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
            return done(res.result);
        }
        return done();
    });
});

suite('/domain', () => {

    suite('/get', () => {

        test('should respond with 200 successful operation and return and array of objects', (done) => {

            server.inject('/domain', (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result).to.be.an.array();
                done();
            });
        });
    });

    suite('/post', () => {

        test('should respond with 200 successful operation and return an domain object', (done) => {

            const data = {
                agent: agentId,
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

                expect(res.statusCode).to.equal(200);
                expect(res.result).to.include(data);
                domainId = res.result._id;

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

                expect(res.statusCode).to.equal(400);
                expect(res.result.message).to.equal('The document with id -1 doesn\'t exists in index agent');
                done();
            });
        });

    });

});

suite('/domain/{id}', () => {

    suite('/get', () => {

        test('should respond with 200 successful operation and return a single object', (done) => {

            const data = {
                _id: domainId,
                agent: agentId,
                domainName: 'string',
                enabled: true,
                intentThreshold: 0
            };

            server.inject('/domain/' + data._id, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result._id).to.be.equal(data._id);
                done();
            });
        });

        test('should respond with 404 Not Found', (done) => {

            const data = {
                _id: '-1'
            };

            server.inject('/domain/' + data._id, (res) => {

                expect(res.statusCode).to.equal(404);
                expect(res.result.message).to.contain('Not Found');
                done();
            });
        });
    });

    suite('/put', () => {

        test('should respond with 200 successful operation', (done) => {

            const data = {
                _id: domainId,
                agent: agentId,
                domainName: 'string',
                enabled: false,
                intentThreshold: 0.55
            };

            const updatedData = {
                agent: agentId,
                enabled: false,
                intentThreshold: 0.55
            };

            const options = {
                method: 'PUT',
                url: '/domain/' + data._id,
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
                agent: agentId
            };

            const options = {
                method: 'PUT',
                url: '/domain/-1',
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
                _id: domainId,
                invalid: true
            };
            const options = {
                method: 'PUT',
                url: '/domain/' + data._id,
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
                url: '/domain/' + domainId,
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
                url: '/domain/' + data._id
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(404);
                expect(res.result.message).to.contain('Not Found');
                done();
            });
        });

        test('should respond with 200 successful operation', (done) => {

            const data = {
                _id: domainId
            };
            const options = {
                method: 'DELETE',
                url: '/domain/' + data._id
            };

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(200);
                done();
            });
        });
    });

});
