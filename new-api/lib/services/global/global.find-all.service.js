import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ skip, limit, direction, field, model, returnModel = false }) {

    const { redis } = this.server.app;
    const Model = await redis.factory(model);

    try {
        const allResultsModels = await Model.findAll({ skip, limit, direction, field });
        if (returnModel) {
            return allResultsModels;
        }
        return allResultsModels.map((resultModel) => resultModel.allProperties());
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
