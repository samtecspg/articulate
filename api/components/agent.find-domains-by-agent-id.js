'use strict';

const Noflo = require('noflo');
const RedisDS = require('../datasources/redis.ds');

const PORT_REDIS = 'redis';
const PORT_OUT = 'out';
const PORT_ERROR = 'error';
const PORT_IN = 'in';

exports.getComponent = () => {

    const c = new Noflo.Component();
    c.description = 'Get all domains by agent id';
    c.icon = 'user';
    c.inPorts.add(PORT_IN, {
        datatype: 'object',
        description: 'Object with all parsed values.'
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

        if (!input.has(PORT_IN)) {
            return;
        }

        if (!input.has(PORT_REDIS)) {
            return;
        }
        const { scope } = input;
        const redis = input.getData(PORT_REDIS);
        const { start, limit, filter, id } = input.getData(PORT_IN);
        let total = 0;
        RedisDS
            .findAllInSet({
                redis,
                start: 0,
                limit: -1,
                type: `agentDomains:${id}`,
                subType: 'domain'
            })
            .then((domains) => {

                total = domains.length;
                // TODO: Do the filtering and sorting on the DB
                if (filter && filter !== '') {
                    domains = _.filter(domains, (domain) => {

                        return domain.domainName.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
                    });
                    total = domains.length;
                }
                domains = _.sortBy(domains, 'domainName');
                if (limit !== -1) {
                    domains = domains.slice(start, limit);
                }
                return output.sendDone({ [PORT_OUT]: new NoFlo.IP('data', { domains, total }, { scope }) });
            })
            .catch((err) => {

                return output.sendDone({ [PORT_ERROR]: new NoFlo.IP('data', err, { scope }) });
            });
    });
};
