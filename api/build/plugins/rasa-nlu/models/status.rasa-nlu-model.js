"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.path = exports.name = void 0;
const name = 'Status';
exports.name = name;
const path = '/status';
exports.path = path;

var _default = ({
  http
}) => {
  return async ({
    baseURL = null
  }) => {
    const response = await http.get(path, {
      baseURL
    });
    return response.data;
  };
};

exports.default = _default;
//# sourceMappingURL=status.rasa-nlu-model.js.map