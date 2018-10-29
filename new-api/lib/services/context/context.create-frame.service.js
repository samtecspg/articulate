import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ session, frameData, returnModel = false }) {

    const {
        contextService,
        frameService
    } = await this.server.services();

    try {
        const ContextModel = await contextService.findBySession({ session });
        return await frameService.create({ ContextModel, data: frameData, returnModel });

    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
