'use strict';

module.exports = (request, reply) => {

    const payload = request.payload;

    request.server.app.redis.hset("hash key", payload.key + Math.random(), payload.value);
    request.server.app.redis.hkeys("hash key", function (err, replies) {
        return reply(replies);
    });
};
