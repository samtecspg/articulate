"use strict";

var _lodash = _interopRequireDefault(require("lodash"));

var _moment = _interopRequireDefault(require("moment"));

var _momentTimezone = _interopRequireDefault(require("moment-timezone"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function ({
  ducklingOutput,
  timezone
}) {
  return _lodash.default.map(ducklingOutput, output => {
    if (output.dim !== 'time') {
      return output;
    }

    const newOutput = _lodash.default.cloneDeep(output);

    const isAnIntervalWithoutFinish = output.value.type === 'interval' && !output.value.to;

    if (output.value.type !== 'interval' || isAnIntervalWithoutFinish) {
      delete newOutput.value;
      newOutput.value = {
        type: output.value.type,
        values: output.value.values ? output.value.values : []
      };
      const time = isAnIntervalWithoutFinish ? (0, _moment.default)(output.value.from.value).tz(timezone) : (0, _moment.default)(output.value.value).tz(timezone);
      const todayTime = (0, _moment.default)().tz(timezone);
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
            value: isAnIntervalWithoutFinish ? time.add(todayTime[grain]() - time[grain](), grain + 's').format() : time.add(1, grain + 's').format(),
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
//# sourceMappingURL=duckling.convert-interval.service.js.map