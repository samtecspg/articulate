"use strict";

var _axios = _interopRequireDefault(require("axios"));

var _querystring = _interopRequireDefault(require("querystring"));

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const getHeaders = (headers, contentType) => {
  const result = {};
  let userSpecifiedContentType = false;
  headers.forEach(header => {
    result[header.key] = header.value;

    if (header.key.toUpperCase() === 'Content-Type'.toUpperCase()) {
      userSpecifiedContentType = true;
    }
  });

  if (!userSpecifiedContentType && contentType) {
    result['Content-Type'] = contentType;
  }

  return result;
};

module.exports = async function ({
  url,
  templatePayload,
  payloadType,
  method,
  templateContext,
  headers,
  username,
  password
}) {
  const handlebars = this.server.app.handlebars;

  try {
    const compiledUrl = handlebars.compile(url)(templateContext);
    let compiledPayload;
    let data = '';
    let contentType = '';

    if (payloadType !== 'None' && payloadType !== '') {
      compiledPayload = handlebars.compile(templatePayload)(templateContext);
    }

    if (compiledPayload) {
      if (payloadType === 'URL Encoded') {
        data = _querystring.default.stringify(JSON.parse(templatePayload));
        contentType = 'application/x-www-form-urlencoded';
      } else if (payloadType === 'JSON') {
        data = JSON.parse(compiledPayload);
        contentType = 'application/json';
      } else {
        data = compiledPayload;
        contentType = 'text/xml';
      }
    }

    const startTime = new _moment.default();
    const response = await (0, _axios.default)({
      method,
      url: compiledUrl,
      data,
      headers: getHeaders(headers, contentType),
      responseType: payloadType === 'XML' ? 'text' : 'json',
      auth: username ? {
        username,
        password
      } : undefined
    });
    const endTime = new _moment.default();

    const elapsed_time_ms = _moment.default.duration(endTime.diff(startTime), 'ms').asMilliseconds();

    if (typeof response.data === 'string') {
      return {
        text: response.data,
        elapsed_time_ms
      };
    }

    return _objectSpread({}, response.data, {
      elapsed_time_ms
    });
  } catch (error) {
    return {
      textResponse: 'We\'re having trouble fulfilling that request',
      actions: []
    };
  }
};
//# sourceMappingURL=agent.converse-call-webhook.service.js.map