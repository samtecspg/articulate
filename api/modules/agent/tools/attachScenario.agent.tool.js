'use strict';

const debug = require('debug')('nlu:model:Converse:attachScenario');
const Boom = require('boom');

module.exports = (server, scenario, callback) => {

    server.inject('/scenario/' + scenario, (res) => {

        if (res.statusCode !== 200){
            debug('NLU API - converse - attachScenario: Error= %o', res.result);
            const error = Boom.create(res.statusCode, 'An error occurred attaching scenario');
            return callback(error, null);
        }
        return callback(null, res.result);
    });
};
