import _ from 'lodash';
import Moment from 'moment';
import MomentTimezone from 'moment-timezone';

module.exports = function ({ ducklingOutput, timezone }) {

    return _.map(ducklingOutput, (output) => {

        if (output.dim !== 'time') {
            return output;
        }
        const newOutput = _.cloneDeep(output);
        const isAnIntervalWithoutFinish = (output.value.type === 'interval' && !output.value.to);
        if (output.value.type !== 'interval' || isAnIntervalWithoutFinish) {
            delete newOutput.value;
            newOutput.value = { type: output.value.type, values: output.value.values ? output.value.values : [] };
            const time = isAnIntervalWithoutFinish ? Moment(output.value.from.value).tz(timezone) : Moment(output.value.value).tz(timezone);
            const todayTime = Moment().tz(timezone);
            const grain = isAnIntervalWithoutFinish ? output.value.from.grain : output.value.grain;
            newOutput.value.from = {
                value: time.format(),
                grain
            };
            switch (grain) {
                case 'second':
                case 'minute':
                case 'hour':
                case 'day':
                case 'week':
                case 'year':
                    newOutput.value.to = {
                        value: isAnIntervalWithoutFinish ? time.add((todayTime[grain]() - time[grain]()), grain + 's').format() : time.add(1, grain + 's').format(),
                        grain
                    };
                    break;
                case 'month':
                    break;
                case 'quarter':
                    newOutput.value.to = {
                        value: isAnIntervalWithoutFinish ? time.add(todayTime.months() - time.months(), grain + 's').format() : time.add(3, 'months').format(),
                        grain
                    };
                    break;
            }
        }
        return newOutput;
    });
};
