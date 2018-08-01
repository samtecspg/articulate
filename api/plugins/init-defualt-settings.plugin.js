'use strict';
const name = 'initDefaultSettings';
const _ = require('lodash');
const DefaultSettings = require('./defaultSettings.json');
const Async = require('async');

exports.register = (server, options, next) => {
    next = _.once(next); //Prevent calling the async next when there is an error after a successful connection
    Async.eachLimit(Object.keys(DefaultSettings), 1,
        (setting, cb) => {

            server.inject(`/settings/${setting}`, (res) => {
                if (res.statusCode === 200) {
                    return cb(null);
                }
                if (res.statusCode !== 404) {
                    const error = Boom.create(res.statusCode, `An error occurred checking if the setting ${setting} exists`);
                    return cb(error, null);
                }
                const payload = {};
                payload[setting] = DefaultSettings[setting];

                const options = {
                    url: '/settings',
                    method: 'PUT',
                    payload
                };

                server.inject(options, (resPut) => {

                    if (resPut.statusCode !== 200) {
                        return cb(resPut.result);
                    }
                    return cb(null);
                });
            });
        },
        (err) => {

            if (err) {
                return next(JSON.stringify(err, null, 2));
            }
            return next(null);
        }
    );
};

exports.register.attributes = {
    name,
    once: true,
    dependencies: ['redis', 'flow-loader']
};
