'use strict';
const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();

const expect = Code.expect;
const suite = lab.suite;
const test = lab.test;
const before = lab.before;

let server;
let uiLanguage = null;
let domainClassifierPipeline = null;
let intentClassifierPipeline = null;
let entityClassifierPipeline = null;

before((done) => {

    require('../../../index')((err, srv) => {

        if (err) {
            done(err);
        }
        server = srv;
        done();
    });
});

suite('settings', () => {

    suite('/settings/uiLanguage', () => {

        suite('/get', () => {

            test('should respond with 200 successful operation and return an object', (done) => {

                server.inject('/settings/uiLanguage', (res) => {

                    expect(res.statusCode).to.equal(200);
                    expect(res.result.uiLanguage).to.be.an.string();
                    uiLanguage = res.result;
                    done();
                });

            });
        });

        suite('/put', () => {

            test('should respond with 200 successful operation and return an object', (done) => {

                const options = {
                    method: 'PUT',
                    url: '/settings/uiLanguage',
                    payload: uiLanguage
                };

                server.inject(options, (res) => {

                    expect(res.statusCode).to.equal(200);
                    expect(res.result).to.be.equal(uiLanguage);
                    done();
                });

            });
        });

    });

    suite('/settings/domainClassifierPipeline', () => {

        suite('/get', () => {

            test('should respond with 200 successful operation and return an object', (done) => {

                server.inject('/settings/domainClassifierPipeline', (res) => {

                    expect(res.statusCode).to.equal(200);
                    expect(res.result).to.be.an.array();
                    domainClassifierPipeline = res.result;
                    done();
                });

            });
        });

        suite('/put', () => {

            test('should respond with 200 successful operation and return an object', (done) => {

                const options = {
                    method: 'PUT',
                    url: '/settings/domainClassifierPipeline',
                    payload: domainClassifierPipeline
                };

                server.inject(options, (res) => {

                    expect(res.statusCode).to.equal(200);
                    expect(res.result).to.be.equal(domainClassifierPipeline);
                    done();
                });

            });
        });

    });

    suite('/settings/intentClassifierPipeline', () => {

        suite('/get', () => {

            test('should respond with 200 successful operation and return an object', (done) => {

                server.inject('/settings/intentClassifierPipeline', (res) => {

                    expect(res.statusCode).to.equal(200);
                    expect(res.result).to.be.an.array();
                    intentClassifierPipeline = res.result;
                    done();
                });

            });
        });

        suite('/put', () => {

            test('should respond with 200 successful operation and return an object', (done) => {

                const options = {
                    method: 'PUT',
                    url: '/settings/intentClassifierPipeline',
                    payload: intentClassifierPipeline
                };

                server.inject(options, (res) => {

                    expect(res.statusCode).to.equal(200);
                    expect(res.result).to.be.equal(intentClassifierPipeline);
                    done();
                });

            });
        });

    });

    suite('/settings/entityClassifierPipeline', () => {

        suite('/get', () => {

            test('should respond with 200 successful operation and return an object', (done) => {

                server.inject('/settings/entityClassifierPipeline', (res) => {

                    expect(res.statusCode).to.equal(200);
                    expect(res.result).to.be.an.array();
                    entityClassifierPipeline = res.result;
                    done();
                });

            });
        });

        suite('/put', () => {

            test('should respond with 200 successful operation and return an object', (done) => {

                const options = {
                    method: 'PUT',
                    url: '/settings/entityClassifierPipeline',
                    payload: entityClassifierPipeline
                };

                server.inject(options, (res) => {

                    expect(res.statusCode).to.equal(200);
                    expect(res.result).to.be.equal(entityClassifierPipeline);
                    done();
                });

            });
        });

    });

});
