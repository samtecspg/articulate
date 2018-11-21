import _ from 'lodash';
import { MODEL_SETTINGS } from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ settingsData }) {

    const { redis } = this.server.app;
    const Model = await redis.factory(MODEL_SETTINGS);
    try {
        const settingsProperties = await Promise.all(_.map(settingsData, async (value, name) => {

            await Model.findByName({ name });
            if (Model.inDb) {
                await Model.updateInstance({ data: { value } });
            }
            else {
                await Model.createInstance({ data: { name, value } });
            }
            return Model.allProperties();
        }));

        const settings = {};
        settingsProperties.forEach(({ name, value }) => {

            settings[name] = value;
        });

        return settings;
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};


