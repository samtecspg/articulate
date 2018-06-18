'use strict';
const Async = require('async');
const Boom = require('boom');
const DefaultSettings =  require('./defaultSettings.json');

module.exports = (server, redis, callback) => {

    Async.eachLimit(Object.keys(DefaultSettings), 1,
        (setting, cb) => {

            server.inject(`/settings/${setting}`, (res) => {

                if (res.statusCode === 200){
                    return cb(null);
                }
                if (res.statusCode !== 404){
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

            if (err){
                return callback(JSON.stringify(err, null, 2));
            }
            return callback(null);
        }
    );
};
