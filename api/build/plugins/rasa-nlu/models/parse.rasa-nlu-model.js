"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.path = exports.name = void 0;
const name = 'Parse';
exports.name = name;
const path = '/parse';
exports.path = path;

var _default = ({
  http
}) => {
  return async ({
    q,
    project,
    model,
    baseURL = null
  }) => {
    const response = await http.post(path, {
      q,
      project,
      model
    }, {
      baseURL
    });
    return response.data;
  };
};

exports.default = _default;
//# sourceMappingURL=parse.rasa-nlu-model.js.map