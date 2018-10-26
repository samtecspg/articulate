import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ field, value, model }) {

    const { redis } = this.server.app;

    try {
        const Model = await redis.factory(model);
        return await Model.searchByField({ field, value });
    }
    catch (error) {
        throw RedisErrorHandler({ error, message: `${model} ${field}=[${value}]` });
    }

};
