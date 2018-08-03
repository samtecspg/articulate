'use strict';

module.exports = (request, reply) => {

    return reply(request.plugins['flow-loader']);
};
