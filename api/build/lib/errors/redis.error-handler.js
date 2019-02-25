"use strict";

var Constants = _interopRequireWildcard(require("../../util/constants"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

module.exports = ({
  error,
  message = null
}) => {
  console.error({
    error,
    message
  });

  if (error.isHandled) {
    return error;
  }

  const response = {
    isHandled: true,
    statusCode: 500
  };

  if (!error) {
    return response;
  }

  const errorMessage = error instanceof Error ? error.message : error;
  message = message ? message : errorMessage;

  switch (errorMessage) {
    case Constants.ERROR_NOT_FOUND:
      return _objectSpread({}, response, {
        message,
        statusCode: 404
      });
    //NotFound

    case Constants.ERROR_VALIDATION:
      return _objectSpread({}, response, {
        message: JSON.stringify(error.errors),
        statusCode: 400
      });

    case Constants.ERROR_FIELD_NOT_FOUND:
      return _objectSpread({}, response, {
        message: Constants.ERROR_FIELD_NOT_FOUND,
        statusCode: 400
      });
    //Bad Request

    default:
      return _objectSpread({}, response, {
        message: errorMessage
      });
    //BadImplementation
  }
};
//# sourceMappingURL=redis.error-handler.js.map