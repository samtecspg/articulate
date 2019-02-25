"use strict";

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Routes = require('require-dir')('./context');

module.exports = [..._lodash.default.values(Routes)];
//# sourceMappingURL=context.routes.js.map