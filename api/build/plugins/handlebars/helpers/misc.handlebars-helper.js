"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.name = void 0;

var _handlebarsHelpers = _interopRequireDefault(require("handlebars-helpers"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const name = 'Misc Handlebars (handlebars-helpers)';
exports.name = name;
const helpers = ['array', 'collection', 'comparison', 'inflection', 'math', 'misc', 'number', 'object', 'string', 'url'];

var _default = ({
  Handlebars
}) => {
  (0, _handlebarsHelpers.default)(helpers, {
    handlebars: Handlebars
  });
};

exports.default = _default;
//# sourceMappingURL=misc.handlebars-helper.js.map