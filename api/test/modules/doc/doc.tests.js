'use strict';
const Async = require('async');

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
let documentId = null;

before({ timeout: 120000 }, (done) => {

    Async.waterfall([
        (cb) => {

            require('../../../index')((err, srv) => {

                if (err) {
                    return cb(err);
                }
                server = srv;
                return cb(null);
            });
        },
        (cb) => {

            server.inject(`/agent/name/${PrecreatedAgentName}`, (res) => {

                if (res.result && res.result.statusCode && res.result.statusCode !== 200){
                    return cb(new Error(`An error ocurred getting the name of the test agent. Error message: ${res.result.message}`));
                }
                preCreatedAgent = res.result;
                return cb(null);
            });
        },
        (cb) => {

            server.inject(`/agent/${preCreatedAgent.id}/parse?text=Locate%20my%20car&timezone=UTC`, (res) => {

                if (res.result && res.result.statusCode && res.result.statusCode !== 200){
                    return cb(new Error(`An error ocurred parsing a sample text. Error message: ${res.result.message}`));
                }
                documentId = res.result.id;
                return cb(null);
            });
        }
    ], (err) => {

        if (err){
            done(err);
        }
        done();
    });
});

suite('/doc/{id}', () => {

    suite('/get', () => {

        test('should respond with 200 successful operation and return a single object', (done) => {

            server.inject(`/doc/${documentId}`, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result.id).to.be.equal(documentId);
                done();
            });
        });

        test('should respond with 404 Not Found', (done) => {

            server.inject('/doc/-1', (res) => {

                expect(res.statusCode).to.equal(404);
                expect(res.result.message).to.contain('The specified document doesn\'t exists');
                done();
            });
        });
    });

});
