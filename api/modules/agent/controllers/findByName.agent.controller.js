'use strict';
const Boom = require('boom');
const Flat = require('../../../helpers/flat');
const Cast = require('../../../helpers/cast');

module.exports = (request, reply) => {

    const agentName = request.params.agentName;
    const redis = request.server.app.redis;

    redis.zscore('agents', agentName, (err, agentId) => {

        if (err){
            const error = Boom.badImplementation('An error occurred checking if the agent exists.');
            return reply(error);
        }
        if (agentId){
            redis.hgetall('agent:' + agentId, (err, data) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred retrieving the agent.');
                    return reply(error);
                }
                if (data){
                    return reply(null, Cast(Flat.unflatten(data), 'agent'));
                }
                const error = Boom.notFound('The specified agent doesn\'t exists');
                return reply(error);
            });
        }
        else {
            const error = Boom.notFound(`The agent "${agentName}" doesn't exist`);
            return reply(error, null);
        }
    });

};
