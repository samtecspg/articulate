"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.name = void 0;

const Moment = require('moment');

const name = 'Date Time Format (Moment)';
exports.name = name;

var _default = ({
  Handlebars
}) => {
  Handlebars.registerHelper('dateTimeFormat', (datetime, format) => Moment(datetime).format(format));
};

exports.default = _default;
//# sourceMappingURL=date-time-format.handlebars-helper.js.map