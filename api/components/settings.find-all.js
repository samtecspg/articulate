'use strict';

const NoFlo = require('noflo');
const Async = require('async');
const Flat = require('../helpers/flat');
const PORT_REDIS = 'redis';
const PORT_OUT = 'out';
const PORT_ERROR = 'error';
const PORT_IN = 'in';

exports.getComponent = () => {

    const c = new NoFlo.Component();
    c.description = 'Get all settings';
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
        const settings = {};
        // TODO: move to redis.ds, keeping ot here bcs it has a different Cast/Flat than others
        const settingByName = (name, cb) => {

            redis.hgetall(`settings:${name}`, (err, setting) => {

                if (err) {
                    err.key = name;
                    return cb(err);
                }
                if (!setting) {
                    err = new Error('Setting not found');
                    err.key = name;
                    return cb(err);
                }
                let unflattenData = Flat.unflatten(setting);
                unflattenData = unflattenData.string_value_setting ? unflattenData.string_value_setting : unflattenData;
                settings[name] = unflattenData;
                return cb();
            });
        };

        redis.smembers('settings', (err, results) => {

            if (err) {
                return output.sendDone({ [PORT_ERROR]: new NoFlo.IP('data', err, { scope }) });
            }
            Async.each(results, settingByName, (err) => {

                if (err) {
                    return output.sendDone({ [PORT_ERROR]: new NoFlo.IP('data', err, { scope }) });
                }
                return output.sendDone({ [PORT_OUT]: new NoFlo.IP('data', settings, { scope }) });
            });
        });

    });
};
