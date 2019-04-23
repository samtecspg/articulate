import { MODEL_SETTINGS, CONFIG_SETTINGS_STRING_VALUE } from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ name, value, returnModel = false }) {

    const { redis } = this.server.app;
    const Model = await redis.factory(MODEL_SETTINGS);
    try {
        await Model.findByName({ name });
        if (CONFIG_SETTINGS_STRING_VALUE.indexOf(name) !== -1){
            await Model.updateInstance({ data: { value: typeof value === 'string' ? value : Object.keys(value)[0] } });
        }
        else {
            await Model.updateInstance({ data: { value } });
        }
        return returnModel ? Model : Model.allProperties();
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
