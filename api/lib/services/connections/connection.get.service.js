import Joi from 'joi'

import { MODEL_CONNECTION, MODEL_AGENT } from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';
import GlobalDefaultError from '../../errors/global.default-error';

module.exports = async function ({ id, request }) {

    const { redis } = this.server.app;
    const { globalService, channelService } = await this.server.services();

    try {
        const ConnectionModel = await globalService.findById({ id: id, model: MODEL_CONNECTION, returnModel: true });

        return await channelService.get({ connection: ConnectionModel.allProperties(), request });
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }


};
