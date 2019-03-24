import Joi from 'joi'

import { MODEL_CONNECTION, MODEL_AGENT } from '../../../util/constants';
import RedisErrorHandler from '../../../lib/errors/redis.error-handler';
import GlobalDefaultError from '../../../lib/errors/global.default-error';

module.exports = async function ({ data, returnModel = false }) {

    const { redis } = this.server.app;
    const { globalService, channelService } = await this.server.services();
    const ConnectionModel = await redis.factory(MODEL_CONNECTION);

    try {
        const agent = await globalService.findById({ id: data.agent, model: MODEL_AGENT, returnModel: false });
        if (agent.id === null) {
            return Promise.reject(GlobalDefaultError({
                statusCode: 400,
                message: `Agent ${data.agent} does not exist.`
            }));
        }
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }

    const validation = await channelService.validate({ method: 'create', data: data });
    if (validation.error) {
        return Promise.reject(GlobalDefaultError({
            statusCode: 400,
            message: `Channel detail validation failed because ${JSON.stringify(validation.error.details)}.`
        }));
    }

    const initData = await channelService.init({ data: data })

    try {
        await ConnectionModel.createInstance({ data: initData });
        return returnModel ? ConnectionModel : ConnectionModel.allProperties();
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
