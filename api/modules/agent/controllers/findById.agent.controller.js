'use strict';
const Flat = require('../../../helpers/flat');
const Cast = require('../../../helpers/cast');
// TODO: PATH 1.1.1
module.exports = (request, reply) => {
    const agent = request.plugins['flow-loader'];
    return reply(null, Cast(Flat.unflatten(agent), 'agent'));
};
