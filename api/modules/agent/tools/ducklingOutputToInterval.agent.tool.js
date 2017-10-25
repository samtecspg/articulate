'use strict';
const debug = require('debug')('nlu:model:Parse:tool:ducklingOutputToInterval');
const _ = require('lodash');
const Moment = require('moment');
const MomentTimezone = require('moment-timezone');

debug('Loaded MomentTimezone %O', MomentTimezone.defaultZone);

const ducklingOutputToInterval = (ducklingOutput, timezone) => {


    const result = _.map(ducklingOutput, (output) => {

        if (output.dim !== 'time'){
            return output;
        }
        const newOutput = _.cloneDeep(output);
        if (output.value.type !== 'interval'){
            delete newOutput.value;
            newOutput.value = { type: output.value.type, values: output.value.values ? output.value.values : [] };
            const time = Moment(output.value.value).tz(timezone);
            switch (output.value.grain) {
                case 'second':
                case 'minute':
                case 'hour':
                    newOutput.value.from = {
                        value: time.format(),
                        grain: output.value.grain
                    };
                    newOutput.value.to = {
                        value: time.add(1, output.value.grain + 's').format(),
                        grain: output.value.grain
                    };
                    break;
                case 'day':
                case 'week':
                case 'month':
                case 'year':
                    newOutput.value.from = {
                        value: time.format(),
                        grain: output.value.grain
                    };
                    newOutput.value.to = {
                        value: time.add(1, output.value.grain + 's').format(),
                        grain: output.value.grain
                    };
                    break;
                case 'quarter':
                    newOutput.value.from = {
                        value: time.format(),
                        grain: output.value.grain
                    };
                    newOutput.value.to = {
                        value: time.add(3, 'months').format(),
                        grain: output.value.grain
                    };
                    break;
                default:
                    newOutput = output;
                    break;
            }

        }
        return newOutput;
    });
    return result;
};

module.exports = ducklingOutputToInterval;
