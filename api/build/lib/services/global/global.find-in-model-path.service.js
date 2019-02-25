"use strict";

var _global = _interopRequireDefault(require("../../errors/global.not-found-error"));

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

var _redis2 = _interopRequireDefault(require("../../errors/redis.not-linked-error"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

module.exports = async function ({
  modelPath,
  isFindById,
  isSingleResult,
  skip,
  limit,
  direction,
  field,
  filter,
  returnModel = false
}) {
  //TODO: Needs refactoring, should handle a single function but is doing 3 different things
  const redis = this.server.app.redis;
  let totalCount = 0;

  try {
    const findById = async ({
      model,
      id
    }) => {
      try {
        const Model = await redis.factory(model, id);
        return await Model;
      } catch (err) {
        throw (0, _global.default)({
          model,
          id
        });
      }
    };

    const reducer = async (parentModel, current, index, sourceArray) => {
      //the first one
      if (!parentModel) {
        // Load the model, wait for it to load and pass it
        return await findById(current);
      }

      const model = current.model,
            id = current.id; //wait for parent to load

      parentModel = await parentModel; // the last one in a find all or find a single model

      if (!id) {
        const ids = await parentModel.getAll(model, model);
        totalCount = ids.length; //if single result then only get the first one

        const childModel = await findById({
          model,
          id: isSingleResult ? ids[0] : null
        });

        if (isSingleResult) {
          if (childModel.inDb) {
            return returnModel ? childModel : childModel.allProperties();
          }

          return Promise.reject((0, _global.default)({
            model
          }));
        }

        const allResultsModels = await childModel.findAllByIds({
          ids,
          skip,
          limit,
          direction,
          field,
          filter
        });

        if (returnModel) {
          return allResultsModels;
        }

        return allResultsModels.map(resultModel => resultModel.allProperties());
      } //load child model


      const childModel = await findById(current);
      const belongs = await parentModel.belongsTo(childModel, model);

      if (belongs) {
        // the last one in a find by id else continue
        const isLast = sourceArray.length === index + 1;

        if (isLast) {
          return returnModel ? childModel : childModel.allProperties();
        }

        return childModel;
      }

      throw (0, _redis2.default)({
        mainType: parentModel.modelName,
        mainId: parentModel.id,
        subType: model,
        subId: current.id
      });
    };

    const data = await modelPath.reduce(reducer, null);

    if (isFindById || isSingleResult) {
      return _objectSpread({}, data);
    }

    return {
      data,
      totalCount
    };
  } catch (error) {
    throw (0, _redis.default)({
      error
    });
  }
};
//# sourceMappingURL=global.find-in-model-path.service.js.map