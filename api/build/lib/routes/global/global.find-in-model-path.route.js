"use strict";

var _boom = _interopRequireDefault(require("boom"));

var _joi = _interopRequireDefault(require("joi"));

var _lodash = _interopRequireDefault(require("lodash"));

var _constants = require("../../../util/constants");

var _global = _interopRequireDefault(require("../../validators/global.validator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//const logger = require('../../../server/util/logger')({ name: `route:global:find-all-related-models-in-path` });
const validateConfiguration = ({
  models,
  isFindById,
  isSingleResult
}) => {
  if (!_lodash.default.isArray(models) || models.length < 2) {
    throw new Error('A related model path needs an array of at least 2 models');
  }

  if (isFindById && isSingleResult) {
    throw new Error('Route can\'t be configured findById and isSingleResult at the same time: \n' + 'isFindById: false && isSingleResult: false -> (Find all linked models)         -> /{model}\n' + 'isFindById: false && isSingleResult: true  -> (Find single linked model)       -> /{model}\n' + 'isFindById: true  && isSingleResult: false -> (Find single linked model by id) -> /{model}/{modelId}\n' + 'isFindById: true  && isSingleResult: true ->  (Error) -> ☠️\n' + '');
  }
};

const generateModelRouteMap = model => {
  const route = _constants.MODEL_TO_ROUTE[model];

  if (!route) {
    throw new Error(`Model '${model}' doesn't have an assigned route.`);
  }

  const idName = `${route}${_constants.PARAMS_POSTFIX_ID}`;
  const path = `${route}/{${idName}}`;
  return {
    model,
    route,
    idName,
    path
  };
};

module.exports = ({
  models,
  isFindById = false,
  isSingleResult = false
}) => {
  validateConfiguration({
    models,
    isFindById,
    isSingleResult
  });
  const modelRouteMap = (0, _lodash.default)(models).map(generateModelRouteMap).value();
  const path = (0, _lodash.default)(modelRouteMap).initial().map('path').value();

  if (isFindById) {
    path.push((0, _lodash.default)(modelRouteMap).last().path); // /{model}/{modelId}
  } else {
    path.push((0, _lodash.default)(modelRouteMap).last().route); // /{model}
  }

  return {
    method: 'get',
    path: `/${path.join('/')}`,
    options: {
      tags: ['api'],
      validate: {
        query: (() => {
          if (!isFindById && !isSingleResult) {
            return _global.default.findAll.query;
          }

          return null;
        })(),
        params: (() => {
          const validation = {};
          const filteredMap = isFindById ? (0, _lodash.default)(modelRouteMap) : (0, _lodash.default)(modelRouteMap).initial();
          filteredMap.each(modeRoute => {
            validation[modeRoute.idName] = _joi.default.string().required().description(`${modeRoute.model} id`);
          });
          return validation;
        })()
      },
      handler: async request => {
        const _ref = await request.services(),
              globalService = _ref.globalService;

        const getParametersFromRequest = modeRoute => {
          const model = modeRoute.model,
                idName = modeRoute.idName;
          const id = request.params[idName];
          return {
            model,
            id
          };
        };

        const _request$query = request.query,
              skip = _request$query.skip,
              limit = _request$query.limit,
              direction = _request$query.direction,
              field = _request$query.field,
              filter = _request$query.filter;
        const modelPath = (0, _lodash.default)(modelRouteMap).map(getParametersFromRequest).value();

        try {
          return await globalService.findInModelPath({
            modelPath,
            isFindById,
            isSingleResult,
            skip,
            limit,
            direction,
            field,
            filter
          });
        } catch (_ref2) {
          let message = _ref2.message;
          let statusCode = _ref2.statusCode;
          return new _boom.default(message, {
            statusCode
          });
        }
      }
    }
  };
};
//# sourceMappingURL=global.find-in-model-path.route.js.map