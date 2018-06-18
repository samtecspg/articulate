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
let domainId = null;
let preCreatedDomain = null;

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
                        agentName = preCreatedAgent.agentName;
                        preCreatedDomain = preCreatedAgent.domains[0];
                        done();
                    }
                });
            }
        });
    });
});

suite('/domain', () => {

    suite('/post', () => {

        test('should respond with 200 successful operation and return an domain object', (done) => {

            const data = {
                agent: agentName,
                domainName: 'Test Domain 2',
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
                domainName: 'Test Domain 2',
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
                domainName: 'Test Domain 2 Updated',
                enabled: false,
                intentThreshold: 0.55
            };

            const updatedData = {
                domainName: 'Test Domain 2 Updated',
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

suite('/domain/{id}/entity', () => {

    suite('/get', () => {

        test('should respond with 200 successful operation and return a single object', (done) => {

            server.inject(`/domain/${preCreatedDomain.id}/entity`, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result).to.be.an.array();
                expect(res.result.length).to.be.greaterThan(0);
                done();
            });
        });

        test('should respond with 404 Not Found', (done) => {

            server.inject('/domain/-1/entity', (res) => {

                expect(res.statusCode).to.equal(404);
                expect(res.result.message).to.contain('The specified domain doesn\'t exists');
                done();
            });
        });
    });

});

suite('/domain/{id}/intent', () => {

    suite('/get', () => {

        test('should respond with 200 successful operation and return a single object', (done) => {

            server.inject(`/domain/${preCreatedDomain.id}/intent`, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result.intents).to.be.an.array();
                expect(res.result.intents.length).to.be.greaterThan(0);
                done();
            });
        });

        test('should respond with 404 Not Found', (done) => {

            server.inject('/domain/-1/intent', (res) => {

                expect(res.statusCode).to.equal(404);
                expect(res.result.message).to.contain('The specified domain doesn\'t exists');
                done();
            });
        });
    });

});

suite('/domain/{id}/train', () => {

    suite('/get', () => {

        test('should respond with 200 successful operation and return a single object', { timeout: 120000 }, (done) => {

            server.inject(`/domain/${preCreatedDomain.id}/train`, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result.domainName).to.equal(preCreatedDomain.domainName);
                expect(res.result.model).to.not.be.equal(preCreatedDomain.model);
                done();
            });
        });

        test('should respond with 404 Not Found', (done) => {

            server.inject('/domain/-1/train', (res) => {

                expect(res.statusCode).to.equal(404);
                expect(res.result.message).to.contain('The specified domain doesn\'t exists');
                done();
            });
        });
    });

});
