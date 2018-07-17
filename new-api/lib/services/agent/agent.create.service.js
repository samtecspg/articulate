import _ from 'lodash';
import {
    CONFIG_SETTINGS_DEFAULT_AGENT,
    MODEL_AGENT,
    STATUS_OUT_OF_DATE,
    CONFIG_SETTINGS_DEFAULT_FALLBACK_ACTION_NAME,
    CONFIG_SETTINGS_RESPONSES_AGENT_DEFAULT
} from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ data, isImport = false, returnModel = false }) {

    const defaultFallbackAction = {
        useWebhook: false,
        usePostFormat: false,
        responses: [],
        slots: []
    };

    const { redis } = this.server.app;
    const { settingsService, agentService } = await this.server.services();

    data.status = data.status || STATUS_OUT_OF_DATE;
    data.settings = {};
    if (data.enableModelsPerCategory === undefined) {
        data.enableModelsPerCategory = true;
    }

    const AgentModel = await redis.factory(MODEL_AGENT);
    try {
        const allSettings = await settingsService.findAll();

        defaultFallbackAction.actionName = allSettings[CONFIG_SETTINGS_DEFAULT_FALLBACK_ACTION_NAME];
        _.each(allSettings[CONFIG_SETTINGS_RESPONSES_AGENT_DEFAULT], (fallbackResponse) => {

            defaultFallbackAction.responses.push({
                textResponse: fallbackResponse,
                actions: []
            });
        });

        _.each(CONFIG_SETTINGS_DEFAULT_AGENT, (value) => {

            data.settings[value] = allSettings[value];
        });

        data.fallbackAction = isImport ? data.fallbackAction : allSettings[CONFIG_SETTINGS_DEFAULT_FALLBACK_ACTION_NAME];

        await AgentModel.createInstance({ data });
        if (!isImport){
            await agentService.createAction({
                AgentModel,
                actionData: defaultFallbackAction
            });
        }
        return returnModel ? AgentModel : AgentModel.allProperties();
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
