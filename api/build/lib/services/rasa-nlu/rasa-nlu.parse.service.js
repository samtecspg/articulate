"use strict";

var _constants = require("../../../util/constants");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

module.exports = async function ({
  text,
  project,
  trainedCategory,
  baseURL = null
}) {
  const rasaNLU = this.server.app[`rasa-nlu`];
  const result = await rasaNLU.Parse({
    q: text,
    project,
    model: trainedCategory.model,
    baseURL
  });
  delete result.text;
  const temporalParse = {
    category: trainedCategory.name
  };
  result.entities.forEach((entity, index) => {
    result.entities[index].keyword = entity.entity;
    delete result.entities[index].entity;
  });
  result.keywords = result.entities;
  delete result.entities;

  if (trainedCategory.justER) {
    delete result.intent;
    result.action = {
      name: trainedCategory.saying,
      confidence: 1
    };
  } else {
    result.action = result.intent.name ? result.intent : {
      name: '',
      confidence: result.intent.confidence
    };
    delete result.intent;
  }

  if (result[_constants.RASA_INTENT_RANKING]) {
    result[_constants.RASA_ACTION_RANKING] = result[_constants.RASA_INTENT_RANKING];
    delete result[_constants.RASA_INTENT_RANKING];
  }

  return _objectSpread({}, temporalParse, result);
};
//# sourceMappingURL=rasa-nlu.parse.service.js.map