"use strict";

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Routes = require('require-dir')('./document');

module.exports = [..._lodash.default.values(Routes)];
//# sourceMappingURL=document.routes.js.map