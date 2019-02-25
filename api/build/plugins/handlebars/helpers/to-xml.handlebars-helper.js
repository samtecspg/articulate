"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.name = void 0;

var _json2xml = _interopRequireDefault(require("json2xml"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const name = 'To XML (json2xml)';
exports.name = name;

var _default = ({
  Handlebars
}) => {
  Handlebars.registerHelper('toXML', obj => (0, _json2xml.default)(obj));
};

exports.default = _default;
//# sourceMappingURL=to-xml.handlebars-helper.js.map