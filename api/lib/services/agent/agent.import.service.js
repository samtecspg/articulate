import _ from 'lodash';
import { STATUS_OUT_OF_DATE, MODEL_AGENT, MODEL_ACTION, MODEL_KEYWORD, MODEL_CATEGORY, MODEL_SAYING } from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ payload }) {

    const { agentService, categoryService, globalService, sayingService, actionService, keywordService } = await this.server.services();
    const {
        isVersionImport,
        actions,
        categories,
        keywords,
        settings,
        postFormat: agentPostFormat,
        webhook: agentWebhook,
        userCredentials,
        ...agent
    } = payload;
    const keywordsDir = {};
    try {

        var AgentModel;
        var originalAgentName = agent.originalAgentVersionName;
        if (!isVersionImport) {
            AgentModel = await agentService.create({
                data: {
                    ...agent,
                    ...{
                        status: STATUS_OUT_OF_DATE,
                        enableModelsPerCategory: _.defaultTo(agent.enableModelsPerCategory, true),
                        multiCategory: _.defaultTo(agent.multiCategory, true),
                        extraTrainingData: _.defaultTo(agent.extraTrainingData, true)
                    }
                },
                isImport: true,
                returnModel: true,
                userCredentials
            });
        } else {
            agent.loadedAgentVersionName = agent.agentName;
            agent.agentName = originalAgentName;
            AgentModel = await agentService.updateById({ id: agent.originalAgentVersionId, data: agent, returnModel: true });
            await agentService.removePostFormat({ id: agent.originalAgentVersionId, returnModel: true });
            await agentService.removeWebhook({ id: agent.originalAgentVersionId, returnModel: true });

            var linkedSayings = await globalService.loadAllLinked({ parentModel: AgentModel, model: MODEL_SAYING, returnModel: true });
            var linkedCategories = await globalService.loadAllLinked({ parentModel: AgentModel, model: MODEL_CATEGORY, returnModel: false });
            var linkedActions = await globalService.loadAllLinked({ parentModel: AgentModel, model: MODEL_ACTION, returnModel: false });
            var linkedKeywords = await globalService.loadAllLinked({ parentModel: AgentModel, model: MODEL_KEYWORD, returnModel: false });

            await Promise.all(linkedSayings.map(async (saying) => {
                let CategoryModel = await globalService.loadAllLinked({ parentModel: saying, model: MODEL_CATEGORY, returnModel: true });
                const deletedSaying = await sayingService.remove({
                    SayingModel: saying,
                    AgentModel,
                    CategoryModel: CategoryModel[0],
                    isBulk: true
                });
            }))

            await Promise.all(linkedCategories.map(async (category) => {
                const deletedCategory = await categoryService.remove({
                    id: Number(category.id),
                    AgentModel,
                    isBulk: true
                });
            }))

            await Promise.all(linkedActions.map(async (action) => {
                const deletedAction = await actionService.remove({
                    id: Number(action.id),
                    AgentModel
                });
            }))

            await Promise.all(linkedKeywords.map(async (keyword) => {
                const deletedKeyword = await keywordService.remove({
                    id: Number(keyword.id),
                    AgentModel,
                    isBulk: true
                });
            }))
        }

        if (settings) {
            await agentService.updateAllSettings({ AgentModel, settingsData: settings });
        }

        if (agent.usePostFormat) {
            await agentService.createPostFormat({
                AgentModel,
                postFormatData: agentPostFormat
            });
        }

        if (agent.useWebhook) {
            await agentService.createWebhook({
                AgentModel,
                webhookData: agentWebhook
            });
        }

        await Promise.all(keywords.map(async (keyword) => {

            const newKeyword = await agentService.createKeyword({
                AgentModel,
                keywordData: keyword
            });
            keywordsDir[newKeyword.keywordName] = parseInt(newKeyword.id);
        }));

        const updatedKeywords = {}
        await Promise.all(keywords.map(async (keyword) => {

            updatedKeywords[keyword.keywordName] = false;
            keyword.modifiers = keyword.modifiers.map((modifier) => {

                modifier.sayings = modifier.sayings.map((saying) => {

                    saying.keywords = saying.keywords.map((sayingkeyword) => {

                        updatedKeywords[keyword.keywordName] = true;
                        sayingkeyword.keywordId = keywordsDir[sayingkeyword.keyword]
                        return sayingkeyword;
                    });

                    return saying;
                });

                return modifier;
            });

            if (updatedKeywords[keyword.keywordName]) {
                await agentService.updateKeyword({
                    id: AgentModel.id,
                    keywordId: keywordsDir[keyword.keywordName],
                    keywordData: {
                        modifiers: keyword.modifiers
                    }
                });
            }
        }));

        await Promise.all(actions.map(async (action) => {

            const { postFormat, webhook, ...actionData } = action;
            const ActionModel = await agentService.createAction({
                AgentModel,
                actionData
            });

            if (action.usePostFormat) {
                await agentService.upsertPostFormatInAction({
                    id: AgentModel.id,
                    actionId: ActionModel.id,
                    postFormatData: postFormat
                });
            }

            if (action.useWebhook) {
                await agentService.upsertWebhookInAction({
                    id: AgentModel.id,
                    actionId: ActionModel.id,
                    data: webhook
                });
            }
        }));

        await Promise.all(categories.map(async (category) => {

            const { sayings, ...categoryData } = category;
            if (categoryData.model) {
                delete categoryData.model;
            }
            const CategoryModel = await agentService.createCategory({
                AgentModel,
                categoryData,
                returnModel: true
            });
            return await Promise.all(sayings.map(async (saying) => {

                saying.keywords.forEach((tempKeyword) => {

                    tempKeyword.keywordId = keywordsDir[tempKeyword.keyword];
                });
                return await agentService.upsertSayingInCategory({
                    id: AgentModel.id,
                    categoryId: CategoryModel.id,
                    sayingData: saying,
                    isImport: true
                });
            }));
        }));
        return await agentService.export({ id: AgentModel.id });
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
