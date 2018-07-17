import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id, model, returnModel = false }) {

    const { redis } = this.server.app;

    try {
        const Model = await redis.factory(model, id);
        return returnModel ? Model : Model.allProperties();
    }
    catch (error) {
        throw RedisErrorHandler({ error, message: `${model} id=[${id}]` });
    }
};
