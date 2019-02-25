"use strict";

var _perf_hooks = require("perf_hooks");

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async function ({
  id,
  model,
  returnModel = false
}) {
  const redis = this.server.app.redis;

  try {
    const someFunction = async (agentModel, agentId) => {
      return await redis.factory(agentModel, agentId);
    };

    const wrapped = _perf_hooks.performance.timerify(someFunction);

    const obs = new _perf_hooks.PerformanceObserver(list => {
      console.log(`global.find-by-id.service::`); // TODO: REMOVE!!!!

      console.log(list.getEntries()); // TODO: REMOVE!!!!
    });
    obs.observe({
      entryTypes: ['mark', 'measure', 'function'],
      buffered: true
    });
    const Model = await wrapped(model, id);

    _perf_hooks.performance.mark(`test${id}`);

    _perf_hooks.performance.mark(`test2${id}`);

    _perf_hooks.performance.mark(`test3${id}`);

    _perf_hooks.performance.measure(`test${id} to test3${id}`, `test${id}`, `test3${id}`);

    obs.disconnect();
    return returnModel ? Model : Model.allProperties();
  } catch (error) {
    throw (0, _redis.default)({
      error,
      message: `${model} id=[${id}]`
    });
  }
};
//# sourceMappingURL=global.find-by-id.service.js.map