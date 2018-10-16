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
        const isAnIntervalWithoutFinish = (output.value.type === 'interval' && !output.value.to);
        if (output.value.type !== 'interval' || isAnIntervalWithoutFinish){
            delete newOutput.value;
            newOutput.value = { type: output.value.type, values: output.value.values ? output.value.values : [] };
            const time = isAnIntervalWithoutFinish ? Moment(output.value.from.value).tz(timezone) : Moment(output.value.value).tz(timezone);
            const todayTime = Moment().tz(timezone);
            const grain =  isAnIntervalWithoutFinish ? output.value.from.grain : output.value.grain;
            newOutput.value.from = {
                value: time.format(),
                grain
            };
            switch (grain) {
                case 'second':
                    newOutput.value.to = {
                        value: isAnIntervalWithoutFinish ? time.add((todayTime.second() - time.second()), grain + 's').format() : time.add(1, grain + 's').format(),
                        grain
                    };
                    break;
                case 'minute':
                    newOutput.value.to = {
                        value: isAnIntervalWithoutFinish ? time.add((todayTime.minute() - time.minute()), grain + 's').format() : time.add(1, grain + 's').format(),
                        grain
                    };
                    break;
                case 'hour':
                    newOutput.value.to = {
                        value: isAnIntervalWithoutFinish ? time.add((todayTime.hour() - time.hour()), grain + 's').format() : time.add(1, grain + 's').format(),
                        grain
                    };
                    break;
                case 'day':
                    newOutput.value.to = {
                        value: isAnIntervalWithoutFinish ? time.add((todayTime.day() - time.day()), grain + 's').format() : time.add(1, grain + 's').format(),
                        grain
                    };
                    break;
                case 'week':
                    newOutput.value.to = {
                        value: isAnIntervalWithoutFinish ? time.add((todayTime.week() - time.week()), grain + 's').format() : time.add(1, grain + 's').format(),
                        grain
                    };
                    break;
                case 'month':
                    newOutput.value.to = {
                        value: isAnIntervalWithoutFinish ? time.add((todayTime.month() - time.month()), grain + 's').format() : time.add(1, grain + 's').format(),
                        grain
                    }
                    break;
                case 'year':
                    newOutput.value.to = {
                        value: isAnIntervalWithoutFinish ? time.add((todayTime.year() - time.year()), grain + 's').format() : time.add(1, grain + 's').format(),
                        grain
                    };
                    break;
                case 'quarter':
                    newOutput.value.to = {
                        value: isAnIntervalWithoutFinish ? time.add(todayTime.months() - time.months(), grain + 's').format() : time.add(3, 'months').format(),
                        grain
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
