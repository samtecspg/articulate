import {
    performance,
    PerformanceObserver
} from 'perf_hooks';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id, model, returnModel = false }) {

    const { redis } = this.server.app;

    try {
        const someFunction = async (agentModel, agentId) => {

            return await redis.factory(agentModel, agentId);
        };
        const wrapped = performance.timerify(someFunction);
        const obs = new PerformanceObserver((list) => {

            console.log(`global.find-by-id.service::`); // TODO: REMOVE!!!!
            console.log(list.getEntries()); // TODO: REMOVE!!!!
        });

        obs.observe({ entryTypes: ['mark', 'measure', 'function'], buffered: true });
        const Model = await wrapped(model, id);
        performance.mark(`test${id}`);
        performance.mark(`test2${id}`);
        performance.mark(`test3${id}`);
        performance.measure(`test${id} to test3${id}`, `test${id}`, `test3${id}`);
        obs.disconnect();
        return returnModel ? Model : Model.allProperties();
    }
    catch (error) {
        throw RedisErrorHandler({ error, message: `${model} id=[${id}]` });
    }
};
