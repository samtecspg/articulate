import { MODEL_SETTINGS } from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ settingsData, returnModel = false }) {

    const { redis } = this.server.app;
    const Model = await redis.factory(MODEL_SETTINGS);
    try {
        for (const name of Object.keys(settingsData)){
            await Model.findByName({ name });
            await Model.updateInstance({ data: { value: settingsData[name] } });
        }
        const settingsArray = await Model.findAll();
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


