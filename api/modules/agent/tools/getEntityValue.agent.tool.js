'use strict';
const debug = require('debug')('nlu:model:Converse:tool:getEntityValue');

const Moment = require('moment');
const MomentTimezone = require('moment-timezone');

const Ordinal = require('ordinal');

debug('Loaded MomentTimezone %O', MomentTimezone.defaultZone);

const getDateTextByGrain = (from, to, grain, type, timezone) => {

    const fromTime = Moment(from).tz(timezone);
    const toTime = Moment(to).tz(timezone);
    switch (grain) {
        case 'second':
            if (type === 'interval'){
                return fromTime.fromNow();
            }
            return 'for ' + fromTime.calendar(null, {
                lastDay : '[Yesterday at] LTS',
                sameDay : '[Today at] LTS',
                nextDay : '[Tomorrow at] LTS',
                lastWeek : '[last] dddd [at] LTS',
                nextWeek : 'dddd [at] LTS',
                sameElse : 'LTS'
            }).toLowerCase();
            break;
        case 'minute':
        case 'hour':
            if (type === 'interval'){
                return fromTime.fromNow();
            }
            return 'for ' + fromTime.calendar(null, {
                lastDay : '[Yesterday at] LT',
                sameDay : '[Today at] LT',
                nextDay : '[Tomorrow at] LT',
                lastWeek : '[last] dddd [at] LT',
                nextWeek : 'dddd [at] LT',
                sameElse : 'LT'
            }).toLowerCase();
            break;
        case 'day':
            if (type === 'interval'){
                return 'from ' + fromTime.format('MMM Do YY') + ' to ' + toTime.format('MMM Do YY');
            }
            return 'for ' + fromTime.calendar().split(' at')[0].toLowerCase();
            break;
        case 'week':
            return 'from ' + fromTime.format('MMM Do YY') + ' to ' + toTime.subtract(1, 'second').format('MMM Do YY');
            break;
        case 'month':
            if (type === 'interval'){
                return 'from ' + fromTime.format('MMMM-YYYY') + ' to ' + toTime.format('MMMM-YYYY');
            }
            return 'for ' + fromTime.format('MMMM-YYYY');
            break;
        case 'year':
            if (type === 'interval'){
                return 'from ' + fromTime.format('YYYY') + ' to ' + toTime.format('YYYY');
            }
            return 'for ' + fromTime.format('YYYY');
            break;
        case 'quarter':
            return 'from ' + fromTime.format('MMMM-YYYY') + ' to ' + toTime.format('MMMM-YYYY');
            break;
        default:
            newOutput = output;
            break;
    }
};

const getOrdinalValue = (input) => {

    return Ordinal(parseInt(input));
};

module.exports = (recognizedEntity, timezone) => {

    switch (recognizedEntity.entity){

        case 'sys.duckling_time':
            return {
                from : recognizedEntity.value.from.value, 
                to: recognizedEntity.value.to.value
            };
            break;
        default:
            return recognizedEntity.value.value;
            break;
    };
};
