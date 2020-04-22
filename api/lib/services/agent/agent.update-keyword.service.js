import _ from 'lodash';
import {
    MODEL_AGENT,
    MODEL_CATEGORY,
    MODEL_KEYWORD,
    STATUS_OUT_OF_DATE,
    MODEL_ACTION
} from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id, keywordId, keywordData, returnModel = false }) {

    const { globalService, agentService } = await this.server.services();
    try {
        const modelPath = [MODEL_AGENT, MODEL_KEYWORD];
        const modelPathIds = [id, keywordId];

        // Load Used Models
        const models = await globalService.getAllModelsInPath({ modelPath, ids: modelPathIds, returnModel: true });
        const AgentModel = models[MODEL_AGENT];
        const KeywordModel = models[MODEL_KEYWORD];
        const changedName = KeywordModel.property('keywordName') !== keywordData.keywordName;
        const oldKeywordName = KeywordModel.property('keywordName')
        await KeywordModel.updateInstance({ data: keywordData });

        // Update Agent and related categories status
        // TODO: Publish Agent update
        AgentModel.property('status', STATUS_OUT_OF_DATE);
        await AgentModel.saveInstance();

        const keywordCategoryIds = await KeywordModel.getAll(MODEL_CATEGORY, MODEL_CATEGORY);
        const KeywordCategoryModels = await globalService.loadAllByIds({
            ids: keywordCategoryIds, //Only load the keywords we are going to use
            model: MODEL_CATEGORY,
            returnModel: true
        });

        const categoryStatusUpdatePromise = KeywordCategoryModels.map(async (CategoryModel) => {

            CategoryModel.property('status', STATUS_OUT_OF_DATE);
            return await CategoryModel.saveInstance();
        });
        await Promise.all(categoryStatusUpdatePromise);

        const agentActionsModels = await globalService.loadAllLinked({ parentModel: AgentModel, model: MODEL_ACTION, returnModel: true });
        const actionsUpdatePromise = agentActionsModels.map(async (ActionModel) => {

            let updated = false;
            ActionModel.property('slots', ActionModel.property('slots').map((actionSlot) => {
                if (actionSlot.keywordId === keywordId) {
                    updated = true;
                    actionSlot.keyword = keywordData.keywordName ? keywordData.keywordName : KeywordModel.property('keywordName');
                    actionSlot.uiColor = keywordData.uiColor ? keywordData.uiColor : KeywordModel.property('uiColor');
                }
                return actionSlot;
            }));
            if (updated) {
                return await ActionModel.saveInstance();
            }
            return null;
        });
        await Promise.all(actionsUpdatePromise);

        if (changedName) {
            var sayings = await agentService.findAllSayings({ id, skip: 0, limit: -1, filter: { keywords: [oldKeywordName] } });
            var sayingsModified = sayings.data.map(
                saying => {
                    return {
                        ...saying, keywords: saying.keywords.map((keyword) => {
                            return {
                                ...keyword,
                                keyword: keywordData.keywordName
                            }
                        })
                    }
                })
            await Promise.all(_.map(sayingsModified, async (saying) => {
                const sayingId = saying.id;
                const categoryId = saying.Category[0].id;
                delete saying.id
                delete saying.Category;
                delete saying.Action;
                return await agentService.upsertSayingInCategory({
                    id: AgentModel.id,
                    sayingId,
                    categoryId,
                    sayingData: saying,
                    isImport: false
                })
            }))
        }

        return returnModel ? KeywordModel : KeywordModel.allProperties();

    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
