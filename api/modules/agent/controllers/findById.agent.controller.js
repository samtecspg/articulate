'use strict';
// TODO: PATH 1.1.1
module.exports = (request, reply) => {
    return reply(null, request.plugins['flow-loader']);
};
