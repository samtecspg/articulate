"use strict";

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

  switch (error.status) {
    case 404:
      return _objectSpread({}, response, {
        message,
        statusCode: 404
      });
    //NotFound

    default:
      return _objectSpread({}, response, {
        message: errorMessage
      });
    //BadImplementation
  }
};
//# sourceMappingURL=es.error-handler.js.map