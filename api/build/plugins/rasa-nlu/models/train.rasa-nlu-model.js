"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.path = exports.name = void 0;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//import qs from 'querystring';
const config = {
  headers: {
    'Content-Type': 'application/x-yml'
  }
};
const name = 'Train';
exports.name = name;
const path = '/train';
exports.path = path;

var _default = ({
  http
}) => {
  return async ({
    language,
    project,
    model,
    payload,
    baseURL = null
  }) => {
    const response = await http.post(path, payload, _objectSpread({}, config, {
      baseURL,
      params: {
        language,
        project,
        model
      }
    }));
    return response.data;
  };
};

exports.default = _default;
//# sourceMappingURL=train.rasa-nlu-model.js.map