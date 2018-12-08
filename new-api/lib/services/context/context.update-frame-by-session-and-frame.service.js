import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ sessionId, frameId, frameData, returnModel = false }) {

    const {
        contextService,
        frameService
    } = await this.server.services();

    try {
        const Frame = await contextService.findFrameBySessionAndFrame({sessionId, frameId, returnModel: true})
        if (Frame.inDb) {
            return await frameService.update({ id: frameId, data: frameData, returnModel });
        } else {
            return Promise.reject(NotFoundErrorHandler({ model: MODEL_FRAME, id: frameId }));
        }
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
