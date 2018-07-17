'use strict';

module.exports = (request, reply) => {

    return reply(null, request.plugins['flow-loader']);
};
