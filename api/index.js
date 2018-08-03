'use strict';
require('dotenv').load();

const Hapi = require('hapi');
const Routes = require('./config/routes');

module.exports = (callback) => init(callback);

const init = (callback) => {

    const server = new Hapi.Server();
    server.connection({ port: 7500, routes: { cors: true } });

    /* $lab:coverage:off$ */
    for (const route in Routes) {
        if (Routes.hasOwnProperty(route)) {
            server.route(Routes[route]);
        }
    }
    return callback(null, server);
    /* $lab:coverage:on$ */
};
