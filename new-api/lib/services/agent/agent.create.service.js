import _ from 'lodash';
import {
    CONFIG_SETTINGS_DEFAULT_AGENT,
    MODEL_AGENT,
    STATUS_OUT_OF_DATE
} from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ data, returnModel = false }) {

    const { redis } = this.server.app;
    const { settingsService } = await this.server.services();

    data.status = data.status || STATUS_OUT_OF_DATE;
    data.settings = {};
    if (data.enableModelsPerCategory === undefined) {
        data.enableModelsPerCategory = true;
    }

    const AgentModel = await redis.factory(MODEL_AGENT);
    try {
        const allSettings = await settingsService.findAll();

        _.each(CONFIG_SETTINGS_DEFAULT_AGENT, (value) => {

            data.settings[value] = allSettings[value];
        });
        await AgentModel.createInstance({ data });
        return returnModel ? AgentModel : AgentModel.allProperties();
    } catch (error) {
        throw RedisErrorHandler({ error });
    }
};
