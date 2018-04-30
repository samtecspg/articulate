'use strict';

const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();

const expect = Code.expect;
const suite = lab.suite;
const test = lab.test;
const before = lab.before;

let server;
const sessionId = 'articulateAPI';
let contextId = null;

before({ timeout: 60000 }, (done) => {

    require('../../../index')((err, srv) => {

        if (err) {
            done(err);
        }
        server = srv;
        done();
    });
});

suite('context', () => {

    suite('context/{sessionId}', () => {

        suite('/post', () => {

            test('should respond with 200 successful operation', (done) => {

                const postData = {
                    name: 'Test Scenario',
                    scenario: 'Test Scenario',
                    slots: {
                        'Test Entity': {
                            value: 'mobile',
                            original: 'cell phone'
                        }
                    }
                };

                const options = {
                    method: 'POST',
                    url: `/context/${sessionId}`,
                    payload: postData
                };

                server.inject(options, (res) => {

                    expect(res.statusCode).to.equal(200);
                    expect(res.result.scenario).to.be.equal(postData.scenario);
                    expect(Object.keys(res.result.slots).length).to.be.greaterThan(0);
                    contextId = res.result.id;
                    done();
                });
            });

            test('should respond with 400 Bad Request', (done) => {

                const data = {
                    invalid: true
                };
                const options = {
                    method: 'POST',
                    url: `/context/${sessionId}`,
                    payload: data
                };

                server.inject(options, (res) => {

                    expect(res.statusCode).to.equal(400);
                    expect(res.result.error).to.contain('Bad Request');
                    done();
                });
            });
        });

        suite('/get', () => {

            test('should respond with 200 successful operation and return a single object', (done) => {

                server.inject(`/context/${sessionId}`, (res) => {

                    expect(res.statusCode).to.equal(200);
                    expect(res.result).to.be.an.array();
                    expect(res.result.length).to.be.greaterThan(0);
                    done();
                });
            });

            test('should respond with 404 Not Found', (done) => {

                server.inject(`/context/${sessionId}`, (res) => {

                    expect(res.statusCode).to.equal(200);
                    expect(res.result).to.be.an.array();
                    expect(res.result.length).to.be.greaterThan(0);
                    done();
                });
            });
        });

        suite('/put', () => {

            test('should respond with 200 successful operation', (done) => {

                const updateData = {
                    slots: {
                        'Test Entity': {
                            value: 'mobile',
                            original: 'iphone'
                        }
                    }
                };

                const options = {
                    method: 'PUT',
                    url: `/context/${sessionId}/${contextId}`,
                    payload: updateData
                };

                server.inject(options, (res) => {

                    expect(res.statusCode).to.equal(200);
                    expect(res.result.slots['Test Entity'].value).to.be.equal('mobile');
                    done();
                });
            });

            test('should respond with 400 Bad Request', (done) => {

                const data = {
                    invalid: true
                };
                const options = {
                    method: 'PUT',
                    url: `/context/${sessionId}/${contextId}`,
                    payload: data
                };

                server.inject(options, (res) => {

                    expect(res.statusCode).to.equal(400);
                    expect(res.result.error).to.contain('Bad Request');
                    done();
                });
            });

            test('should respond with 404 Not Found', (done) => {

                const data = {
                    slots: {}
                };
                const options = {
                    method: 'PUT',
                    url: `/context/${sessionId}/-1`,
                    payload: data
                };

                server.inject(options, (res) => {

                    expect(res.statusCode).to.equal(404);
                    expect(res.result.message).to.contain('This context element doesn\'t exists in this session');
                    done();
                });
            });

            test('should respond with 404 Not Found', (done) => {

                const data = {
                    slots: {}
                };
                const options = {
                    method: 'PUT',
                    url: '/context/articulateAPI2/-1',
                    payload: data
                };

                server.inject(options, (res) => {

                    expect(res.statusCode).to.equal(404);
                    expect(res.result.message).to.contain('This session doesn\'t have a context');
                    done();
                });
            });
        });

    });

    suite('context/{sessionId}', () => {

        suite('/delete', () => {

            test('should respond with 200 successful operation', (done) => {

                const options = {
                    method: 'DELETE',
                    url: `/context/${sessionId}`
                };

                server.inject(options, (res) => {

                    expect(res.statusCode).to.equal(200);
                    done();
                });
            });
        });

    });

});
