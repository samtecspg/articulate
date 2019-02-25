"use strict";

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Routes = require('require-dir')('./settings');

module.exports = [..._lodash.default.values(Routes)];
//# sourceMappingURL=settings.routes.js.map