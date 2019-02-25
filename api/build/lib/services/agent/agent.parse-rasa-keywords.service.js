"use strict";

var _lodash = _interopRequireDefault(require("lodash"));

var _moment = _interopRequireDefault(require("moment"));

var _constants = require("../../../util/constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

module.exports = async function ({
  AgentModel,
  text,
  trainedCategories,
  rasaURL = null
}) {
  const _ref = await this.server.services(),
        rasaNLUService = _ref.rasaNLUService;

  const agent = AgentModel.allProperties();

  let categoryRecognizerTrainedCategory = _lodash.default.filter(trainedCategories, trainedCategory => {
    return trainedCategory.model.indexOf(_constants.RASA_MODEL_CATEGORY_RECOGNIZER) > -1;
  });

  categoryRecognizerTrainedCategory = categoryRecognizerTrainedCategory.length > 0 ? categoryRecognizerTrainedCategory[0] : null;
  let categoryRecognitionResults;

  if (categoryRecognizerTrainedCategory) {
    categoryRecognitionResults = await rasaNLUService.parse({
      text,
      project: agent.agentName,
      trainedCategory: categoryRecognizerTrainedCategory,
      baseURL: rasaURL
    });
  }

  const rasaResults = await Promise.all(trainedCategories.map(async trainedCategory => {
    if (!categoryRecognitionResults || trainedCategory.name !== categoryRecognitionResults.category) {
      const startTime = new _moment.default();
      let categoryRasaResults = await rasaNLUService.parse({
        text,
        project: agent.agentName,
        trainedCategory,
        baseURL: rasaURL
      });
      const endTime = new _moment.default();

      const duration = _moment.default.duration(endTime.diff(startTime), 'ms').asMilliseconds();

      categoryRasaResults = _objectSpread({}, categoryRasaResults, {
        elapsed_time_ms: duration
      });

      if (categoryRecognitionResults) {
        let categoryScore = _lodash.default.filter(categoryRecognitionResults[_constants.RASA_ACTION_RANKING], recognizedCategory => {
          return recognizedCategory.name === categoryRasaResults.category;
        });

        categoryScore = categoryScore.length > 0 ? categoryScore[0].confidence : 0;
        categoryRasaResults = _objectSpread({}, categoryRasaResults, {
          categoryScore
        });
      } else {
        categoryRasaResults = _objectSpread({}, categoryRasaResults, {
          categoryScore: 1
        });
      }

      return categoryRasaResults;
    }
  }));
  return rasaResults;
};
//# sourceMappingURL=agent.parse-rasa-keywords.service.js.map