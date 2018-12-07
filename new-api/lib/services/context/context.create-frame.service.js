import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ sessionId, frameData, returnModel = false }) {

    const {
        contextService,
        frameService
    } = await this.server.services();

    try {
        const ContextModel = await contextService.findBySession({ sessionId, returnModel: true });
        return await frameService.create({ context: ContextModel, data: frameData, returnModel });

    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
