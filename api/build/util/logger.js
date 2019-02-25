"use strict";

var _package = _interopRequireDefault(require("../../package.json"));

var Constants = _interopRequireWildcard(require("./constants"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = ({
  name
}) => {
  const Debug = require('debug');

  const baseScope = `${_package.default.name}:${name}`;
  const scope = {
    info: `${baseScope}:${Constants.DEBUG_LEVEL_INFO}`,
    debug: `${baseScope}:${Constants.DEBUG_LEVEL_DEBUG}`,
    error: `${baseScope}:${Constants.DEBUG_LEVEL_ERROR}`
  };
  const info = Debug(scope.info);
  const debug = Debug(scope.debug);
  const error = Debug(scope.error);
  return {
    info,
    debug,
    error
  };
};
//# sourceMappingURL=logger.js.map