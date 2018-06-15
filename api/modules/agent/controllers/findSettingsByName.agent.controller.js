'use strict';
const Boom = require('boom');
const Flat = require('../../../helpers/flat');

module.exports = (request, reply) => {

    const agentId = request.params.id;
    const name = request.params.name;
    const redis = request.server.app.redis;

    redis.hgetall(`agentSettings:${agentId}:${name}`, (err, data) => {

        if (err){
            const error = Boom.badImplementation(`An error occurred retrieving the setting ${name}.`);
            return reply(error);
        }
        if (data){
            let unflattenData = Flat.unflatten(data);
            unflattenData = unflattenData.string_value_setting ? unflattenData.string_value_setting : unflattenData;
            return reply(null, unflattenData);
        }
        const error = Boom.notFound('This setting doesn\'t exists');
        return reply(error);
    });

};
