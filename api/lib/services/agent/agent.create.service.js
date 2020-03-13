import _ from 'lodash';
import {
    CONFIG_SETTINGS_DEFAULT_AGENT,
    MODEL_AGENT,
    STATUS_OUT_OF_DATE,
    STATUS_READY,
    CONFIG_SETTINGS_DEFAULT_FALLBACK_ACTION_NAME,
    CONFIG_SETTINGS_RESPONSES_AGENT_DEFAULT,
    CONFIG_SETTINGS_DEFAULT_WELCOME_ACTION_NAME,
    CONFIG_SETTINGS_WELCOME_RESPONSES_AGENT_DEFAULT

} from '../../../util/constants';
import OverLimitErrorHandler from '../../errors/global.over-limit';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ data, isImport = false, returnModel = false, userCredentials = null }) {

    const defaultFallbackAction = {
        useWebhook: false,
        usePostFormat: false,
        responses: [],
        slots: []
    };

    const defaultWelcomeAction = {
        useWebhook: false,
        usePostFormat: false,
        responses: [],
        slots: []
    }

    const { redis } = this.server.app;
    const { settingsService, agentService } = await this.server.services();

    data.status = isImport ? STATUS_OUT_OF_DATE : (data.status || STATUS_READY);
    data.settings = {};
    if (data.enableModelsPerCategory === undefined) {
        data.enableModelsPerCategory = true;
    }

    const AgentModel = await redis.factory(MODEL_AGENT);
    const agentCount = await AgentModel.count();
    const agentLimit = this.options.agentLimit;
    const defaults = AgentModel.defaults;
    const ownerAccessPolicy = _.mapValues(defaults.accessPolicies, () => true);
    data.accessPolicies = {
        [userCredentials.id]: ownerAccessPolicy
    };
    if (agentLimit !== -1 && agentCount >= agentLimit) {
        return Promise.reject(OverLimitErrorHandler({ level: agentCount, limit: agentLimit, type: 'Agents' }));
    }
    try {
        const allSettings = await settingsService.findAll();

        defaultFallbackAction.actionName = allSettings[CONFIG_SETTINGS_DEFAULT_FALLBACK_ACTION_NAME];
        _.each(allSettings[CONFIG_SETTINGS_RESPONSES_AGENT_DEFAULT], (fallbackResponse) => {

            defaultFallbackAction.responses.push({
                textResponse: fallbackResponse,
                actions: []
            });
        });

        defaultWelcomeAction.actionName = allSettings[CONFIG_SETTINGS_DEFAULT_WELCOME_ACTION_NAME];
        _.each(allSettings[CONFIG_SETTINGS_WELCOME_RESPONSES_AGENT_DEFAULT], (welcomeResponse) => {

            defaultWelcomeAction.responses.push({
                textResponse: welcomeResponse,
                actions: []
            });
        });

        _.each(CONFIG_SETTINGS_DEFAULT_AGENT, (value) => {

            data.settings[value] = allSettings[value];
        });

        data.fallbackAction = isImport ? data.fallbackAction : allSettings[CONFIG_SETTINGS_DEFAULT_FALLBACK_ACTION_NAME];
        data.welcomeAction = isImport ? data.welcomeAction : allSettings[CONFIG_SETTINGS_DEFAULT_WELCOME_ACTION_NAME];

        if (isImport && data.model) {
            delete data.model;
        }

        await AgentModel.createInstance({ data });
        if (!isImport) {
            await agentService.createAction({
                AgentModel,
                actionData: defaultFallbackAction
            });
            await agentService.createAction({
                AgentModel,
                actionData: defaultWelcomeAction
            });
        }
        return returnModel ? AgentModel : AgentModel.allProperties();
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
