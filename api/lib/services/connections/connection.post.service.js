import { MODEL_CONNECTION } from '../../../util/constants';
import RedisErrorHandler from '../../../lib/errors/redis.error-handler';

module.exports = async function ({ id, request, h, returnModel = false }) {

    const { globalService, channelService } = await this.server.services();

    try {
        const ConnectionModel = await globalService.findById({ id: id, model: MODEL_CONNECTION, returnModel: true });

        return await channelService.post({ connection: ConnectionModel.allProperties(), request, h });
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }


};
