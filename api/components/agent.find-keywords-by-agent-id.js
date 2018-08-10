'use strict';

const Noflo = require('noflo');
const RedisDS = require('../datasources/redis.ds');

const PORT_REDIS = 'redis';
const PORT_OUT = 'out';
const PORT_ERROR = 'error';
const PORT_IN = 'in';

exports.getComponent = () => {

    const c = new Noflo.Component();
    c.description = 'Get all Keywords by agent id';
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
        const redis = input.getData(PORT_REDIS);
        const { start, limit, filter, id } = input.getData(PORT_IN);
        let total = 0;
        RedisDS
            .findAllInSet({
                redis,
                start: 0,
                limit: -1,
                type: `agentKeywords:${id}`,
                subType: 'keyword'
            })
            .then((keywords) => {
                total = keywords.length;
                // TODO: Do the filtering and sorting on the DB
                if (filter && filter !== '') {
                    keywords = _.filter(keywords, (keyword) => {

                        return keyword.keywordName.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
                    });
                    total = keywords.length;
                }
                keywords = _.sortBy(keywords, 'keywordName');
                if (limit !== -1) {
                    keywords = keywords.slice(start, limit);
                }
                return output.sendDone({ [PORT_OUT]: { keywords, total } });
            })
            .catch((err) => {

                return output.sendDone({ [PORT_ERROR]: err });
            });
    });
};
