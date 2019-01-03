import { MODEL_AGENT, STATUS_OUT_OF_DATE, CONFIG_SETTINGS_RASA_TRAINING } from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';
import _ from 'lodash';

module.exports = async function ({ id, settingsData, AgentModel = null, returnModel = false }) {

    const { globalService } = await this.server.services();
    try {
        AgentModel = AgentModel || await globalService.findById({ id, model: MODEL_AGENT, returnModel: true });

        //Keep settings that are not in the new object
        const oldSettings = AgentModel.property('settings');
        const newSettings = { ...oldSettings, ...settingsData };

        const trainingSettingsChanged = CONFIG_SETTINGS_RASA_TRAINING.some((setting) => {
            
            return !_.isEqual(oldSettings[setting], newSettings[setting]);
        });
        if (trainingSettingsChanged){
            await AgentModel.property('status', STATUS_OUT_OF_DATE);
        }
        await AgentModel.property('settings', newSettings);
        await AgentModel.saveInstance();
        return returnModel ? AgentModel : AgentModel.allProperties();
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
