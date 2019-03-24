import Joi from 'joi'

import { MODEL_CONNECTION, MODEL_AGENT } from '../../../util/constants';
import RedisErrorHandler from '../../../lib/errors/redis.error-handler';
import GlobalDefaultError from '../../../lib/errors/global.default-error';

module.exports = async function ({ id, request, h, returnModel = false }) {

    const { redis } = this.server.app;
    const { globalService, channelService } = await this.server.services();

    try {
        const ConnectionModel = await globalService.findById({ id: id, model: MODEL_CONNECTION, returnModel: true });

        return await channelService.post({ connection: ConnectionModel.allProperties(), request, h });
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }


};
