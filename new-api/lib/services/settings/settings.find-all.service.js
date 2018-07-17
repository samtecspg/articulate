import { MODEL_SETTINGS } from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ asArray = false } = {}) {

    const { redis } = this.server.app;
    const Model = await redis.factory(MODEL_SETTINGS);

    try {

        const settingsArray = await Model.findAll();
        if (asArray) {
            return settingsArray;
        }
        const settings = {};
        settingsArray.forEach((setting) => {

            const { name, value } = setting.allProperties();
            settings[name] = value;
        });
        return settings;
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
