"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _fs = _interopRequireDefault(require("fs"));

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const log = text => {
  const filename = 'performance-timing.csv';
  const logText = text + '\r\n';

  _fs.default.appendFile(filename, logText, 'utf8', err => {
    if (err) {
      console.log(err);
    }
  });
};

function _default({
  fn,
  name
}) {
  name = name || fn.name || 'tmp';

  if (process.env.PERF === 'true') {
    const tmp = {
      [name]: async function () {
        const start = new _moment.default();
        const result = await fn.apply(this, arguments);
        const end = new _moment.default();

        const duration = _moment.default.duration(end.diff(start)).asMilliseconds();

        log(`${name},${duration}`);
        return result;
      }
    };
    return tmp[name];
  }

  return fn;
}
//# sourceMappingURL=service-timing-wrapper.js.map