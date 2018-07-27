'use strict';
const Flat = require('../../../helpers/flat');
const Cast = require('../../../helpers/cast');

module.exports = (request, reply) => {
    let agents = request.plugins['flow-loader'];
    agents = agents.map((agent) => {
        return Cast(Flat.unflatten(agent), 'agent');
    });
    reply(agents);
};