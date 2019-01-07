import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ skip, limit, direction, field, model, filter, returnModel = false }) {

    const { redis } = this.server.app;
    const Model = await redis.factory(model);

    try {
        const allResultsModels = await Model.findAll({ skip, limit, direction, field, filter });
        if (returnModel) {
            return allResultsModels;
        }
        const totalCount = await Model.count();
        const data = allResultsModels.map((resultModel) => resultModel.allProperties());
        return { data, totalCount };
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
