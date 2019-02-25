"use strict";

var _json2yaml = _interopRequireDefault(require("json2yaml"));

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async function ({
  project,
  model,
  oldModel = null,
  trainingSet,
  pipeline,
  language,
  baseURL = null
}) {
  const rasaNLU = this.server.app[`rasa-nlu`];

  try {
    const stringTrainingSet = JSON.stringify(trainingSet, null, 2);
    let payload = {
      language,
      pipeline
    };
    payload = _json2yaml.default.stringify(payload);
    payload += `  data: ${stringTrainingSet}`;
    await rasaNLU.Train({
      project,
      model,
      payload,
      baseURL
    });

    if (oldModel) {
      try {
        await rasaNLU.Models({
          project,
          model: oldModel,
          baseURL
        });
      } catch (error) {
        console.warn(`Unable to unload model ${oldModel}. Error data: ${error}`);
      }
    }
  } catch (error) {
    throw (0, _redis.default)({
      error
    });
  }
};
//# sourceMappingURL=rasa-nlu.train.service.js.map