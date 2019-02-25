"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.name = void 0;

var _handlebarsIntl = _interopRequireDefault(require("handlebars-intl"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const name = 'Handlebars internationalization';
exports.name = name;

var _default = ({
  Handlebars
}) => {
  _handlebarsIntl.default.registerWith(Handlebars);
};

exports.default = _default;
//# sourceMappingURL=intl.handlebars-helper.js.map