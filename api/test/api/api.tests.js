'use strict';

const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const Inert = require('inert');
const Vision = require('vision');
const PrecreatedAgent = require('./preCreatedAgent');

const expect = Code.expect;
const suite = lab.suite;
const test = lab.test;

suite('NLU API', () => {

    suite('start server', () => {

        test('should start the server successfuly', { timeout: 120000 }, (done) => {

            require('../../index')((err, server) => {

                if (err) {
                    done(err);
                }

                server.register([Inert, Vision], (err) => {

                    if (err) {
                        done(err);
                    }
                    server.start( (errStart) => {

                        if (errStart) {
                            done(errStart);
                        }
                        expect(server).to.be.an.object();

                        const options = {
                            method: 'POST',
                            url: '/agent/import',
                            payload: PrecreatedAgent
                        };

                        server.inject(options, (res) => {

                            if (res.result && res.result.statusCode && res.result.statusCode !== 200){
                                done(new Error(`An error ocurred creating an agent for the tests. Error message: ${res.result.message}`));
                            }
                            else {
                                done();
                            }
                        });
                    });
                });
            });
        });
    });

});
