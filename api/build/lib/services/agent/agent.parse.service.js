"use strict";

var _lodash = _interopRequireDefault(require("lodash"));

var _moment = _interopRequireDefault(require("moment"));

var _constants = require("../../../util/constants");

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async function ({
  id,
  AgentModel,
  text,
  timezone,
  sessionId = null
}) {
  const startTime = new _moment.default();
  const redis = this.server.app.redis;

  const _ref = await this.server.services(),
        agentService = _ref.agentService,
        keywordService = _ref.keywordService,
        documentService = _ref.documentService;

  try {
    AgentModel = AgentModel || (await redis.factory(_constants.MODEL_AGENT, id));
    const agent = AgentModel.allProperties();
    const trainedCategories = await agentService.getTrainedCategories({
      AgentModel
    });
    const _agent$settings = agent.settings,
          ducklingURL = _agent$settings.ducklingURL,
          rasaURL = _agent$settings.rasaURL,
          spacyPretrainedEntities = _agent$settings.spacyPretrainedEntities,
          ducklingDimension = _agent$settings.ducklingDimension;

    const rasaKeywords = _lodash.default.compact((await agentService.parseRasaKeywords({
      AgentModel,
      text,
      trainedCategories,
      rasaURL
    })));

    const ducklingKeywords = _lodash.default.compact((await agentService.parseDucklingKeywords({
      AgentModel,
      text,
      timezone,
      ducklingURL
    })));

    const regexKeywords = await agentService.parseRegexKeywords({
      AgentModel,
      text
    });
    const parsedSystemKeywords = await keywordService.parseSystemKeywords({
      parseResult: {
        rasa: rasaKeywords,
        duckling: ducklingKeywords,
        regex: regexKeywords
      },
      spacyPretrainedEntities,
      ducklingDimension
    });
    const endTime = new _moment.default();

    const duration = _moment.default.duration(endTime.diff(startTime), 'ms').asMilliseconds();

    const maximumSayingScore = (0, _lodash.default)(parsedSystemKeywords).map('action').map('confidence').compact().max();
    const maximumCategoryScore = (0, _lodash.default)(parsedSystemKeywords).map('categoryScore').compact().max();
    return await documentService.create({
      data: {
        document: text,
        [_constants.PARAM_DOCUMENT_TIME_STAMP]: new Date().toISOString(),
        [_constants.PARAM_DOCUMENT_RASA_RESULTS]: _lodash.default.orderBy(parsedSystemKeywords, 'categoryScore', 'desc'),
        [_constants.PARAM_DOCUMENT_MAXIMUM_SAYING_SCORE]: maximumSayingScore,
        [_constants.PARAM_DOCUMENT_TOTAL_ELAPSED_TIME]: duration,
        [_constants.PARAM_DOCUMENT_MAXIMUM_CATEGORY_SCORE]: maximumCategoryScore || null,
        [_constants.PARAM_DOCUMENT_AGENT_ID]: agent.id,
        [_constants.PARAM_DOCUMENT_AGENT_MODEL]: agent.model,
        [_constants.PARAM_DOCUMENT_SESSION]: sessionId
      }
    });
  } catch (error) {
    throw (0, _redis.default)({
      error
    });
  }
};
//# sourceMappingURL=agent.parse.service.js.map