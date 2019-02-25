"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _logToFile = _interopRequireDefault(require("log-to-file"));

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

        (0, _logToFile.default)(`${name},${duration}`);
        return result;
      }
    };
    return tmp[name];
  }

  return fn;
}
//# sourceMappingURL=service-timing-wrapper.js.map