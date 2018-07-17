import { MODEL_SETTINGS } from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ data, returnModel = false }) {

    const { redis } = this.server.app;
    const SettingsModel = await redis.factory(MODEL_SETTINGS);
    try {
        await SettingsModel.createInstance({ data });
        return returnModel ? SettingsModel : SettingsModel.allProperties();
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
