import _ from 'lodash';
import { MODEL_SETTINGS } from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ settingsData }) {

    const { redis } = this.server.app;
    const { settingsService } = await this.server.services();
    try {
        await Promise.all(_.map(settingsData, async (value, name) => {

            const Model = await redis.factory(MODEL_SETTINGS);
            await Model.createInstance({ data: { name, value } });
        }));

        return await settingsService.findAll();
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};


