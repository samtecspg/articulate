'use strict';

module.exports = (request, reply) => {

    reply(request.plugins['flow-loader']);
};
