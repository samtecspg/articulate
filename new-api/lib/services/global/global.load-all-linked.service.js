import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ parentModel, model, relationName = model, returnModel = false }) {

    const { redis } = this.server.app;

    try {
        const ids = await parentModel.getAll(model, relationName);
        const Model = await redis.factory(model);
        const results = await Model.loadAllByIds({ ids });
        if (returnModel) {
            return results;
        }
        return results.map((resultModel) => resultModel.allProperties());
    }
    catch (error) {
        throw RedisErrorHandler({ error, message: `${model} error loading linked models` });
    }
};
