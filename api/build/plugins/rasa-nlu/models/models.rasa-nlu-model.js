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
const name = 'Models';
exports.name = name;
const path = '/models';
exports.path = path;

var _default = ({
  http
}) => {
  return async ({
    project,
    model,
    baseURL = null
  }) => {
    const response = await http.delete(path, _objectSpread({}, config, {
      baseURL,
      params: {
        project,
        model
      }
    }));
    return response.data;
  };
};

exports.default = _default;
//# sourceMappingURL=models.rasa-nlu-model.js.map