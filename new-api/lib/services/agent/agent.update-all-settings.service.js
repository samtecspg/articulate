import { MODEL_AGENT } from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id, settingsData, returnModel = false }) {

    const { globalService } = await this.server.services();
    try {

        const AgentModel = await globalService.findById({ id, model: MODEL_AGENT, returnModel: true });

        //Keep settings that are not in the new object
        const oldSettings = AgentModel.property('settings');
        const newSettings = { ...oldSettings, ...settingsData };

        await AgentModel.property('settings', newSettings);
        await AgentModel.save();
        return returnModel ? AgentModel : AgentModel.allProperties();
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
