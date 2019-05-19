import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ data, returnModel = false }) {

    const { serverService } = await this.server.services();
    try {
        const ServerModel = await serverService.get({ returnModel: true });
        
        await ServerModel.updateInstance({ data });
        return returnModel ? ServerModel : ServerModel.allProperties();
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
