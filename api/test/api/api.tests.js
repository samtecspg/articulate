'use strict';

const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const Inert = require('inert');
const Vision = require('vision');
// const HapiSwagger = require('hapi-swagger');
// const Pack = require('../../package');

const expect = Code.expect;
const suite = lab.suite;
const test = lab.test;

suite('NLU API', () => {

    suite('start server and flush db', () => {

        test('should start the server successfuly', (done) => {

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

                        done();
                    });
                });
            });
        });
    });

});
