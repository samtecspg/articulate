'use strict';

const NoFlo = require('noflo');
const RedisDS = require('../datasources/redis.ds');
const _ = require('lodash');
const PORT_REDIS = 'redis';
const PORT_OUT = 'out';
const PORT_ERROR = 'error';
const PORT_IN = 'in';
const PORT_DOMAIN_EXISTS = 'domain_exists';

exports.getComponent = () => {

    const c = new NoFlo.Component();
    c.description = 'Get all sayings by domain id';
    c.icon = 'user';

    c.inPorts.add(PORT_IN, {
        datatype: 'object',
        description: 'Object with all parsed values.'
    });

    c.inPorts.add(PORT_DOMAIN_EXISTS, {
        datatype: 'boolean',
        description: 'Domain Exists'
    });

    c.inPorts.add(PORT_REDIS, {
        datatype: 'object',
        description: 'Redis client'
    });

    c.outPorts.add(PORT_OUT, {
        datatype: 'object'
    });

    c.outPorts.add(PORT_ERROR, {
        datatype: 'object'
    });

    return c.process((input, output) => {
        console.log(`domain.find-sayings-by-agent-id::`); // TODO: REMOVE!!!!
        console.log(input.has(PORT_IN, PORT_REDIS, PORT_DOMAIN_EXISTS)); // TODO: REMOVE!!!!
        if (!input.has(PORT_IN, PORT_REDIS, PORT_DOMAIN_EXISTS)) {
            return;
        }

        const { scope } = input;
        const redis = input.getData(PORT_REDIS);
        const domainExists = input.getData(PORT_DOMAIN_EXISTS);
        const { start, limit, filter, id } = input.getData(PORT_IN);

        if (!domainExists) {
            return output.sendDone({ [PORT_ERROR]: new NoFlo.IP('data', `Domain [${id}] doesn't exists`, { scope }) });

        }
        let total = 0;
        RedisDS
            .findAllInSet({
                redis,
                start: 0,
                limit: -1,
                type: `domainSayings:${id}`,
                subType: 'saying'
            })
            .then((sayings) => {

                total = sayings.length;
                // TODO: Do the filtering and sorting on the DB
                if (filter && filter !== '') {
                    sayings = _.filter(sayings, (saying) => {

                        return saying.userSays.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
                    });
                    total = sayings.length;
                }
                sayings = _.sortBy(sayings, 'sayingName');
                if (limit !== -1) {
                    sayings = sayings.slice(start, limit);
                }
                return output.sendDone({ [PORT_OUT]: new NoFlo.IP('data', { sayings, total }, { scope }) });
            })
            .catch((err) => {

                return output.sendDone({ [PORT_ERROR]: new NoFlo.IP('data', err, { scope }) });
            });
    });
};
